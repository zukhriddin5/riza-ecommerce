'use server'; //server action
import { signInFormSchema } from "../validators";
import { signIn,signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { signUpFormSchema } from "../validators";
import { hashSync } from "bcrypt-ts-edge";
import {prisma} from '@/lib/prisma'
import { formatError } from "../utils";
//sign in the user with credentials
export async function signInWithCredentials( prevState:unknown,formData:FormData){
    try{
        const user =signInFormSchema.parse({
            email:formData.get('email'),
            password:formData.get('password')
        });

        await signIn('credentials',user);

        return{success:true, message:'signed in seccessfully'}

    }catch(error){
        if(isRedirectError(error)){
            throw error;
        }

        return {success:false, message:'Invalid email or password'}

    }
}

//sign user out
export async function signOutUser(){
    await signOut();
}

//sign up the user 
export async function signUpUser(prevState:unknown,formData:FormData){
    try {
        const user = signUpFormSchema.parse({
            name:formData.get('name'),
            email:formData.get('email'),
            password:formData.get('password'),
            confirmPassword:formData.get('confirmPassword'),
            })
            const plainPassword =user.password;
            user.password=hashSync(user.password,10);
            await prisma.user.create({
                data:{
                    name:user.name,
                    email:user.email,
                    password:user.password,
                },
            })
            await signIn('credentials',{
                email:user.email,
                password:plainPassword,
            })
        return {seccess:true, message:'User registered seccessfuly'}
    } catch (error) {
        if(isRedirectError(error)){
            throw error;
        }

        return {success:false, message:formatError(error)}
        
    }
}