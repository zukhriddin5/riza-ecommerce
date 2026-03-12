import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './lib/prisma';
import CredentialsProvider from 'next-auth/providers/credentials'; 
import { compareSync } from 'bcrypt-ts-edge';
import type { NextAuthConfig } from 'next-auth';
import { cookies } from 'next/headers'; 
import { NextResponse } from 'next/server';

const config = {
    pages: {
        signIn: "/sign-in",
        error: "/sign-in"           
    },          
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({ 
            credentials: {
                email: { type: 'email' },
                password: { type: 'password' }
            },
            async authorize(credentials) {
                if (credentials == null) return null;

                // Find user from database
                const user = await prisma.user.findFirst({
                    where: {
                        email: credentials.email as string
                    }
                });

                // If user exists and password matches
                if (user && user.password) {
                    const isMatch = compareSync(credentials.password as string, user.password);
                    
                    // If password is correct return user
                    if (isMatch) {
                        return {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            role: user.role,
                        }
                    }
                }
                
                return null;
            }
        })
    ],
    callbacks: {
        async session({ session, token, trigger }: any) { 
            session.user.id = token.sub;
            session.user.role = token.role;
            
            // If there are any updates, set the user name
            if (trigger === "update") {
                session.user.name = token.name;
            }
            
            return session; 
        },
        
        async jwt({ token, user, trigger, session }: any) {
            // Assign user fields to token
            if (user) {
                token.id = user.id;
                token.role = user.role;

                // If user has no name, use first part of email
                if (user.name === 'NO_NAME') {
                    token.name = user.email.split('@')[0];
                    
                    // Update database
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { name: token.name },
                    });
                }

               
                if (trigger === 'signIn' || trigger === 'signUp') { 
                    const cookiesObject = await cookies();
                    const sessionCartId = cookiesObject.get('sessionCartId')?.value; 
                    
                    if (sessionCartId) {
                        const sessionCart = await prisma.cart.findFirst({ 
                            where: { sessionCartId } 
                        });
                        
                        if (sessionCart) {
                            // Delete current user cart
                            await prisma.cart.deleteMany({
                                where: { userId: user.id },
                            });
                            
                            // Assign session cart to user
                            await prisma.cart.update({
                                where: { id: sessionCart.id }, 
                                data: { userId: user.id },
                            });
                        }
                    }
                }
            }
            
            return token;
        },
        authorized({request, auth}:any){
            //create array regex patterns of paths i am protecting
            const protectedPaths =[
                /\/shipping-address/,
                /\/payment-method/,
                /\/place-order/,
                /\/profile/,
                /\/user\/(.*)/,
                /\/order\/(.*)/,
                /\/admin/,
            ];
            //get pathname from req url object
            const {pathname} = request.nextUrl;

            //check if user not authenticated and accesing protected path
            if(!auth && protectedPaths.some((p)=> p.test(pathname))) return false;

            //check for session cart cookies
            if (!request.cookies.get('sessionCartId')){
                //generate new session cart  id cookies
                const sessionCartId = crypto.randomUUID();
                //clone the request headers
                const newRequestHeaders = new Headers(request.headers);
                //create new responce and add the headers
                const response = NextResponse.next({
                    request:{
                        headers:newRequestHeaders,
                    },
                });
                //set new generated session Cart id in the respond cookies
                response.cookies.set('sessionCartId',sessionCartId);
                return response;

            }
            return true;
        }   
    },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);