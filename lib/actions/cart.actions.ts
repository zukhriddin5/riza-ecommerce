'use server';

import { CartItem } from "@/types";
import { convertToPlainObject, formatError } from "../utils";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { prisma } from "../prisma";
import { cartItemSchema } from "../validators";

export async function addItemCartToCart(data: CartItem) {
  try {
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('Cart session not found');
    
    // Get user and session id
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;
    
    // Get cart
    const cart = await getMyCart();
    
    // Parse and validate
    const item = cartItemSchema.parse(data);

    //find product from data base
    const product =await prisma.product.findFirst({
      where:{id:item.productId},
    });

    console.log({
      'session Cart id': sessionCartId,
      'user id': userId,
      'required item': item,
      'current cart': cart,
      'product found':product,
    });
    
    return {
      success: true,
      message: "Product added to the cart"
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error)
    };
  }
}

export async function getMyCart() {
  const sessionCartId = (await cookies()).get('sessionCartId')?.value;
  if (!sessionCartId) return undefined;
  
  // Get user and session id
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  // Get cart from database - no include needed since items is Json
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });
  
  if (!cart) return undefined;
  
  // Convert decimals and return (note: itemPrice not itemsPrice)
  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemPrice: cart.itemPrice.toString(), // Changed from itemsPrice
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}