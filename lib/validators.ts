import {z} from "zod";
import { PAYMENT_METHODS } from "./constants";
//import { formatNumberWithDecimal } from "./utils";



//schema for inserting products
const currency = z.string().refine(
  (value) => {
    const num = parseFloat(value);
    return !isNaN(num) && num >= 0;
  },
  'Price must be a valid positive number'
).transform((value) => {
  return parseFloat(value).toFixed(2); // Ensure 2 decimal places
});
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
    password:z.string().min(3,'Password should be atleast 6 characters')
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
    items:z.array(cartItemSchema),
    itemPrice:currency,
    totalPrice:currency,
    taxPrice:currency,
    shippingPrice:currency,
    sessionCartId:z.string().min(1,'Session Cart Id is required'),
    userId:z.string().optional().nullable(),
});

//schema for shipping address
export const shippingAddressSchema = z.object({
    fullName:z.string().min(3,'Name should be atleast 3 characters'),
    streetAddress:z.string().min(3,'Street name should be atleast 3 characters'),
    phoneNumber:z.string().min(10,'Phone number should be atleast 10 characters'),
    city:z.string().min(3,'City should be atleast 3 characters'),
    country:z.string().min(3,'Country should be atleast 3 characters'),
    lat:z.number().optional(),
    lng:z.number().optional(),
});

//schema for payment method 
export const paymentMethodSchema = z.object({
    type:z.string().min(1, 'Payment method is required'),
}).refine((data) => PAYMENT_METHODS.includes(data.type),{
    path:['type'],
    message:'Invalid payment method',
})