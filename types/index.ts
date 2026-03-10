import { insertProductSchema,insertCartSchema,cartItemSchema, shippingAddressShcema} from '@/lib/validators';
import {z} from 'zod';
export type Product = z.infer<typeof insertProductSchema>&{
    id:string;
    rating:string;
    createdAt:Date;
}
export type Cart =z.infer<typeof insertCartSchema>;
export type CartItem =z.infer<typeof cartItemSchema>;
export type ShippingAddress =z.infer< typeof shippingAddressShcema>;