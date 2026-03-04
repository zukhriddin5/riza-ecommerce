'use client';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { Cart, CartItem } from "@/types";
import { Plus,Minus,Loader } from "lucide-react";
import { toast } from "sonner";
import { addItemCartToCart,removeItemFromCart } from "@/lib/actions/cart.actions";
import { useTransition } from "react";
 
const AddToCart = ({cart, item }: {cart?:Cart, item: CartItem }) => {
    const router = useRouter();
    
    const [isPendingPlus,startTransitionPlus] =useTransition();
    const [isPendingMinus,startTransitionMinus] =useTransition();

    const handleAddToCart = async () => {
        startTransitionPlus(async() =>{
            const res = await addItemCartToCart(item);

        if (!res.success) {
            toast.error(res.message);
            return;
        }

        // Show success toast with action button
        toast.success(`${item.name} added to cart`, {
            description:res.message,
            duration: 5000, 
            action: {
                label: 'Go to Cart',
                onClick: () => router.push('/cart')
            },
        });
        router.refresh();

        });
        
    };
    //handle remove from cart
    const handleRemoveFromCart= async  () =>{
        startTransitionMinus(async () => {
         const res = await removeItemFromCart(item.productId);
         toast[res.success ? 'success' : 'error'](res.message);
         router.refresh();
        })    
    }

    //check item if item is in cart
    const existItem =cart&& cart.items.find((x)=>x.productId === item.productId); 

    return existItem ? (
        <div>
            <Button type='button' variant='outline' onClick={handleRemoveFromCart}>
                {isPendingMinus ? (<Loader className="w-4 h-4 animate-spin"/>):(<Minus className='h-4 w-4'/>)}
            </Button>
            <span className='m-4'>{existItem.quantity}</span>
            <Button type='button' variant='outline' onClick={handleAddToCart}>
                {isPendingPlus ? (<Loader className="w-4 h-4 animate-spin"/>):(<Plus className='h-4 w-4'/>)}
            </Button>
        </div>
    ):(
        <Button 
            className='w-full' 
            type="button" 
            onClick={handleAddToCart}
        >
            {isPendingPlus ? (<Loader className="w-4 h-4 animate-spin"/>):(<Plus className='h-4 w-4'/>)} Add To Cart
        </Button>
    ) 
    
};
 
export default AddToCart;