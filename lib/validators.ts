import {z} from "zod";
import { formatNumberWithDecimal } from "./utils";


//schema for inserting products
const currency =z.string()
    .refine((value)=>/^d+(\.\d{2}$)?/.test(formatNumberWithDecimal(Number(value))), 'Price must have exactly 2 decimal places')
export const insertProductSchema=z.object({
    name:z.string().min(3,"Name must be at least 3 characters"),
    slug:z.string().min(3,"Slug must be at least 3 characters"),
    category:z.string().min(3,"Category must be at least 3 characters"),
    brand:z.string().min(3,"Brand must be at least 3 characters"),
    description:z.string().min(3,"Description must be at least 3 characters"),
    stock:z.coerce.number(),
    images:z.array(z.string().min(1,"Product must have at least 1 image ")),
    isFeatured:z.boolean().nullable(),
    banner:z.string().nullable(),
    price: currency,
})

//schema for sign in user
export const signInFormSchema = z.object({
    email:z.string().email('Invalid email adress'),
    password:z.string().min(6,'Password should be atleast 6 characters')
})
//schema for signing up the user 
export const signUpFormSchema = z.object({
    name:z.string().min(3,'Name should be atleast 3 character'),
    email:z.string().email('Invalid email adress'),
    password:z.string().min(6,'Password should be atleast 6 characters'),
    confirmPassword:z.string().min(6,'Confirm password should be atleast 6 characters')
})
.refine((data) =>data.password ===data.confirmPassword,{
    message:'Password does not same.Try again',
    path:['confirmPassword']
});

//caart item schema
export const cartItemSchema=z.object({
    productId:z.string().min(1,'Product is required'),
    name:z.string().min(1,'Name is required'),
    slug:z.string().min(1,'Slug is required'),
    quantity:z.number().nonnegative('Quantity should be positive number'),
    image:z.string().min(1,'Image is required'),
    price:currency,
});

export const insertCartSchema=z.object({
    itemsz:z.array(cartItemSchema),
    itemPrice:currency,
    totalPrice:currency,
    taxPrice:currency,
    shippingPrice:currency,
    sesionCartId:z.string().min(1,'Session Cart Id is required'),
    userId:z.string().optional().nullable(),
});