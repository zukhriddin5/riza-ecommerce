'use server';
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { formatError } from "../utils";
import { auth } from "@/auth";
import { getMyCart } from "./cart.actions";
import { redirect } from "next/navigation";
import { getUserById } from "./user.actions";
import { insertOrderSchema } from "../validators";
import { CartItem } from "@/types";
import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";

// Create order and order items
export async function createOrder() {
    try {
        const session = await auth();
        if (!session) throw new Error('User not authenticated');    
        
        const cart = await getMyCart();
        const userId = session?.user?.id;
        if (!userId) redirect('/sign-in');

        const user = await getUserById(userId);

        if (!cart || cart.items.length === 0) {
            return { success: false, message: 'Cart is empty', redirectTo: '/cart' };
        }

        if (!user.address) {
            return { success: false, message: 'Address is required', redirectTo: '/shipping-address' };
        }

        if (!user.paymentMethod) {
            return { success: false, message: 'Payment method is required', redirectTo: '/payment-method' };
        }

        // Validate with schema (this ensures data is correct)
        const order = insertOrderSchema.parse({
            userId: user.id,
            shippingAddress: user.address,
            paymentMethod: user.paymentMethod,
            itemsPrice: cart.itemPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,
        });

        // Create transaction
        const insertedOrderId = await prisma.$transaction(async (tx) => {
            // Create order - explicitly list all fields
            const insertedOrder = await tx.order.create({
                data: {
                    userId: order.userId,
                    shippingAddress: order.shippingAddress,
                    paymentMethod: order.paymentMethod,
                    itemsPrice: order.itemsPrice,
                    shippingPrice: order.shippingPrice,
                    taxPrice: order.taxPrice,
                    totalPrice: order.totalPrice,
                }   
            });

            // Create order items - explicitly specify fields
            for (const item of cart.items as CartItem[]) {
                await tx.orderItem.create({
                    data: {
                        orderId: insertedOrder.id,
                        productId: item.productId,
                        name: item.name,
                        slug: item.slug,
                        image: item.image,
                        quantity: item.quantity,
                        price: item.price,
                    },
                });

                // Update product stock
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: { decrement: item.quantity }
                    }
                });
            }

            // Clear cart 
            await tx.cart.update({
                where: { id: cart.id },
                data: {
                    items: [],
                    totalPrice: 0,
                    shippingPrice: 0,
                    taxPrice: 0,
                    itemPrice: 0, 
                },
            });

            return insertedOrder.id;
        });

        if (!insertedOrderId) throw new Error('Order not created');

        return {
            success: true,
            message: 'Order placed successfully', 
            redirectTo: `/order/${insertedOrderId}`,
        };
    } catch (error) {
        if (isRedirectError(error)) throw error;
        return { success: false, message: formatError(error) };  
    }
}