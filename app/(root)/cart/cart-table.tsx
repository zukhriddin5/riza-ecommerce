'use client'
import { useRouter } from "next/navigation";
import { toast } from 'sonner'
import { useTransition, useState } from "react";
import { addItemCartToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { ArrowRight, Loader, Plus, Minus } from "lucide-react";
import { Cart } from "@/types"; 
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableCell, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

const CartTable = ({ cart }: { cart?: Cart }) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    
      const [loadingItem, setLoadingItem] = useState<{
        productId: string;
        action: 'plus' | 'minus';
    } | null>(null);

    const handleRemove = (productId: string) => {
        setLoadingItem({ productId, action: 'minus' });
        startTransition(async () => {
            const res = await removeItemFromCart(productId);
            setLoadingItem(null);

            if (!res.success) {
                toast.error('Failed to remove item', {
                    description: res.message
                });
            }
        });
    };

    const handleAdd = (item: any) => {
        setLoadingItem({ productId: item.productId, action: 'plus' });
        startTransition(async () => {
            const res = await addItemCartToCart(item);
            setLoadingItem(null);

            if (!res.success) {
                toast.error('Failed to add item', {
                    description: res.message
                });
            }
        });
    };

    return (
        <>
            <h1 className='py-4 h2-bold'>Shopping Cart</h1>
            {!cart || cart.items.length === 0 ? (
                <div className="text-2xl text-red-700">
                    Cart Is Empty 
                    <Link href='/'>
                        <Button className='font-bold rounded-2xl hover:bg-blue-300 ml-9'>
                            Go To The Shopping
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className='grid md:grid-cols-4 md:gap-5'>
                    <div className='overflow-x-auto md:col-span-3'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Items</TableHead>
                                    <TableHead className='text-center'>Quantity</TableHead>
                                    <TableHead className='text-right'>Price</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cart.items.map((item) => {
                                    const isMinusLoading = loadingItem?.productId === item.productId && loadingItem?.action === 'minus';
                                    const isPlusLoading = loadingItem?.productId === item.productId && loadingItem?.action === 'plus';

                                    return (
                                        <TableRow key={item.slug}>
                                            <TableCell>
                                                <Link href={`/product/${item.slug}`} className='flex items-center'>
                                                    <Image src={item.image} alt={item.name} width={50} height={50} />
                                                    <span className='px-2'>{item.name}</span>
                                                </Link>
                                            </TableCell>
                                            <TableCell className='flex-center gap-2'>
                                                <Button 
                                                    disabled={isMinusLoading || isPlusLoading} 
                                                    variant='outline' 
                                                    type='button'
                                                    size='icon'
                                                    onClick={() => handleRemove(item.productId)}
                                                >
                                                    {isMinusLoading ? (
                                                        <Loader className='w-4 h-4 animate-spin' />
                                                    ) : (
                                                        <Minus className="w-4 h-4" />
                                                    )}
                                                </Button>
                                                <span className='m-2 font-semibold'>{item.quantity}</span>
                                                <Button 
                                                    disabled={isMinusLoading || isPlusLoading} 
                                                    variant='outline' 
                                                    type='button'
                                                    size='icon'
                                                    onClick={() => handleAdd(item)}
                                                >
                                                    {isPlusLoading ? (
                                                        <Loader className='w-4 h-4 animate-spin' />
                                                    ) : (
                                                        <Plus className="w-4 h-4" />
                                                    )}
                                                </Button>
                                            </TableCell>
                                            <TableCell className='text-right'>
                                                ${(Number(item.price) * item.quantity).toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                    <Card>
                        <CardContent className='p-4 gap-4'>
                            <div className='pb-3 text-xl'>
                                SubTotal ({cart.items.reduce((a, c) => a + c.quantity, 0)}) :
                                <span className='font-bold p-3'>{formatCurrency(cart.itemPrice)}</span>
                            </div>
                            <Button 
                                className='w-full' 
                                disabled={isPending}
                                onClick={() => startTransition(() => router.push('/shipping-address'))}
                            >
                                {isPending ? (
                                    <Loader className='w-4 h-4 animate-spin mr-2' />
                                ) : (
                                    <ArrowRight className='w-4 h-4 mr-2' />
                                )} 
                                Proceed to Checkout
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    );
};

export default CartTable;