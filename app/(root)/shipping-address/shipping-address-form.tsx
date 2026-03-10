'use client'

import { useRouter } from "next/navigation";
import { toast } from "sonner";   
import { useTransition } from "react";
import { ShippingAddress } from "@/types";
import { shippingAddressSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler} from "react-hook-form";
import { z } from 'zod';
import { shippingAddressDefaultValues } from "@/lib/constants";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader } from "lucide-react";
import { updateUserAddress } from "@/lib/actions/user.actions";

const ShippingAddressForm = ({ address }: { address: ShippingAddress }) => {
    const router = useRouter();
    const form = useForm<z.infer<typeof shippingAddressSchema>>({
        resolver: zodResolver(shippingAddressSchema),
        defaultValues: address || shippingAddressDefaultValues,
    });
    const [isPending, startTransition] = useTransition();

    const onSubmit: SubmitHandler<z.infer<typeof shippingAddressSchema>> = async (values) => {
        startTransition(async () => {
            const res = await updateUserAddress(values);

            if (!res.success) {
                toast.error(res.message || 'Failed to update address');
                return;
            }
            
            toast.success('Address updated successfully!');
            router.push('/payment-method'); 
        });
    };

    return (
        <div className='max-w-md mx-auto space-y-4'>
            <h1 className='text-center h2-bold mt-4'>Shipping Address</h1>
            <p className='text-center text-sm text-muted-foreground'>Please enter your delivery address</p>
            
            <Form {...form}>
                <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name='fullName'
                        render={({ field}) => (
                            <FormItem>
                                <FormLabel className='font-bold'>Full Name</FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter your name' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='streetAddress'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='font-bold'>Street Address</FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter your street address' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='city'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='font-bold'>City</FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter your city' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='phoneNumber'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='font-bold'>Phone Number</FormLabel>
                                <FormControl>
                                    <Input placeholder='+998 50 001 01 01' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='country'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='font-bold'>Country</FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter country name' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className='flex gap-2'>
                        <Button type="submit" disabled={isPending} className='w-full'>
                        {isPending ? (
                            <Loader className='w-4 h-4 animate-spin mr-2' />
                        ) : (
                            <ArrowRight className='w-4 h-4 mr-2' />
                        )}
                        {isPending ? 'Processing...' : 'Next'}
                    </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default ShippingAddressForm;