import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './lib/prisma';
import CredentialsProvider from 'next-auth/providers/credentials'; // Fixed typo
import { compareSync } from 'bcrypt-ts-edge';
import type { NextAuthConfig } from 'next-auth';


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
                
                // If user doesn't exist or password doesn't match
                return null;
            }
        })
    ],
    callbacks: {
        async session({ session, user, trigger, token }: any) { 
            session.user.id = token.sub;
            
            // If there are any updates, set the user name
            if (trigger === "update") {
                session.user.name = user.name;
            }
            
            return session; 
        },
    }
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);