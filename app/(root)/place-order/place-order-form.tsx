'use client';
import { createOrder } from "@/lib/actions/order.actions";
import { useFormStatus } from "react-dom";
import { Check, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const PlaceOrderForm = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            const res = await createOrder();
            
            if (!res.success) {
                toast.error(res.message);
                if (res.redirectTo) {
                    router.push(res.redirectTo);
                }
                return;
            }

            toast.success(res.message);
            if (res.redirectTo) {
                router.push(res.redirectTo);
            }
        } catch (error) {
            toast.error("Failed to place order");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='w-full'>
            <Button 
                disabled={isLoading} 
                className='w-full'
                type="submit"
            >
                {isLoading ? (
                    <Loader className='w-4 h-4 animate-spin' />
                ) : (
                    <Check className='w-4 h-4' />
                )}
                {' '}
                Place Order
            </Button>
        </form>
    );
}

export default PlaceOrderForm;