'use server';

import { CartItem } from "@/types";
import { convertToPlainObject, formatError, round2 } from "../utils";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { prisma } from "../prisma";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

//calculate cart prices
const calculatePrice = (items:CartItem[]) => {
  const itemPrice = round2(items.reduce((acc,item)=>acc+Number(item.price)*item.quantity,0)
),
shippingPrice=round2(itemPrice >500 ? 0 : 100),
taxPrice=0,
totalPrice =round2(itemPrice+shippingPrice+taxPrice);
return {
  itemPrice:itemPrice.toFixed(2),
  taxPrice:taxPrice.toFixed(2),
  shippingPrice:shippingPrice.toFixed(2),
  totalPrice:totalPrice.toFixed(2)

}
}

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
    if(!product) throw new Error('Product not Found');

    if(!cart){
      //create cart object
      const newCart = insertCartSchema.parse({
        userId:userId,
        items:[item],
        sessionCartId:sessionCartId,
        ...calculatePrice([item])
      })
      //add to data base
      await prisma.cart.create({
        data:newCart
      });
      //revalidate Path
      revalidatePath(`/product/${product.slug}`)
      return {
       success: true,
       message: `${product.name} added to the cart`,
    };
    }else{
      //check if the product is already in cart
      const existItem=(cart.items as CartItem[]).find((x)=>x.productId === item.productId);
      if (existItem){
        //check stock
        if(product.stock < existItem.quantity +1){
          throw new Error('Not enough product in stock')
        }
        //increase quantity
        (cart.items as CartItem[]).find((x)=>x.productId === item.productId)!.quantity=existItem.quantity+1;
      }else{
        // if item does not exist in cart
        //check stock
        if(product.stock <1) {
          throw new Error('No enough product ');
        }
        //add item to the cart.items
        cart.items.push(item);
      }
      //save it to the database
      await prisma.cart.update({
        where:{id:cart.id},
        data:{
          items:cart.items as Prisma.CartUpdateitemsInput[],
          ...calculatePrice(cart.items as CartItem[]),
        }
      });
      revalidatePath(`/product/${product.slug}`);
      return {
        success:true,
        message:`${product.name} ${existItem ? 'updated in': 'added to'} cart`
      }

    }
  
   
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
  
 
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

   const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });
  
  if (!cart) return undefined;
  
  // Convert decimals and return 
  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemPrice: cart.itemPrice.toString(), 
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}

export async function removeItemFromCart(productId:string){
  try {
    //check for cart cookies
  const sessionCartId = (await cookies()).get('sessionCartId')?.value;
  if (!sessionCartId) throw new Error('Cart session not found');
    //get product 
  const product =await prisma.product.findFirst({
      where:{id:productId}
  });
  if(!product) throw new Error('Product Not Found');
  //get user cart
  const cart = await getMyCart();
  if(!cart) throw new Error('Cart Not Found');
  // check for item
  const exist = (cart.items as CartItem[]).find((x)=>x.productId ===productId); 
  if(!exist) throw new Error('Item Not Found');

  //check if only one in quantity
  if(exist.quantity === 1){
    //remove from cart
    cart.items = (cart.items as CartItem[]).filter((x)=>x.productId !==exist.productId);
  }else{
    //decrease quantity
    (cart.items as CartItem[]).find((x) => x.productId === productId)!.quantity = exist.quantity - 1
  }
  //update cart in database
  await prisma.cart.update({
    where:{id:cart.id},
    data:{
      items:cart.items as Prisma.CartUpdateitemsInput[],
      ...calculatePrice(cart.items as CartItem[]),
    }
  });
  revalidatePath(`/product/${product.slug}`);
  
  return {
    success:true,
    message:`${product.name} was removed from cart`,
  }
    
    
  } catch (error) {
    return {
      success:false,
      message:formatError(error)
    }   
  }
}