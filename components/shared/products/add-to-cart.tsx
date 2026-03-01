'use client';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { CartItem } from "@/types";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { addItemCartToCart } from "@/lib/actions/cart.actions";
 
const AddToCart = ({ item }: { item: CartItem }) => {
    const router = useRouter();

    const handleAddToCart = async () => {
        const res = await addItemCartToCart(item);

        if (!res.success) {
            toast.error(res.message);
            return;
        }

        // Show success toast with action button
        toast.success(`${item.name} added to cart`, {
            description:res.message,
            duration: 5000, // Show for 5 seconds
            action: {
                label: 'Go to Cart',
                onClick: () => router.push('/cart')
            },
        });
    };

    return (
        <Button 
            className='w-full' 
            type="button" 
            onClick={handleAddToCart}
        >
            <Plus className="mr-2 h-4 w-4" /> Add To Cart
        </Button>
    );
};
 
export default AddToCart;