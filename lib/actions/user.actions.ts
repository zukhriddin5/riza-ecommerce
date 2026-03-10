'use server';
import { shippingAddressSchema, signInFormSchema, signUpFormSchema } from "../validators";
import { signIn, signOut, auth } from "@/auth";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from '@/lib/prisma';
import { formatError } from "../utils";
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { redirect } from "next/navigation";
import { ShippingAddress } from "@/types";

// Sign in the user with credentials
export async function signInWithCredentials(prevState: unknown, formData: FormData) {
    try {
        const user = signInFormSchema.parse({
            email: formData.get('email'),
            password: formData.get('password')
        });

        await signIn('credentials', {
            ...user,
            redirectTo: '/',
        });

        return { success: true, message: 'Signed in successfully' };

    } catch (error: any) {
        if (isRedirectError(error)) {
            throw error;
        }
        
        if (error?.type === 'CredentialsSignin') {
            return { success: false, message: 'Invalid email or password' };
        }
        
        if (error?.name === 'ZodError') {
            return { success: false, message: formatError(error) };
        }

        return { success: false, message: formatError(error) };
    }
}

// Sign user out
export async function signOutUser() {
    await signOut();
}

// Sign up the user 
export async function signUpUser(prevState: unknown, formData: FormData) {
    try {
        const user = signUpFormSchema.parse({
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
        });
        
        const plainPassword = user.password;
        user.password = hashSync(user.password, 10);
        
        await prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: user.password,
            },
        });
        
        await signIn('credentials', {
            email: user.email,
            password: plainPassword,
            redirectTo: '/',
        });
        
        return { success: true, message: 'User registered successfully' };
        
    } catch (error: any) {
        if (isRedirectError(error)) {
            throw error;
        }
        
        if (error?.type === 'CredentialsSignin') {
            return { success: false, message: 'Failed to sign in after registration' };
        }
        
        return { success: false, message: formatError(error) };
    }
}

// Get the user by their ID
export async function getUserById(userId: string) {
    const user = await prisma.user.findFirst({
        where:{id:userId}
    });
    if (!user) redirect('/sign-in')
    return user;
}

// update user adress from shipping address
 export async function updateUserAddress(data:ShippingAddress){
    try {
        const session = await auth();
        const currentUser = await prisma.user.findFirst({
            where:{id:session?.user?.id}
        })
        if(!currentUser) redirect('/sign-in');

        const address =shippingAddressSchema.parse(data);

        await prisma.user.update({
            where:{id:currentUser.id},
            data:{address}
        });
        return {
            success:true,
            message:'User address updated successfully'
        }
        
    } catch (error) {
        return {success:false, message:formatError(error)}
        
    }

 }