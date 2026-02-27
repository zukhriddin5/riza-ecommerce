'use server';

import { CartItem} from "@/types";

export async function addItemCartToCart(data:CartItem){
  try {
    return {
        seccess:true,
        message:"Product added to the cart"
    }
  } catch (error) {
     return {
            success: false,
            message: 'Failed to add item to cart'
        };
  }
}
