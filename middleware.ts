import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const sessionCartId = request.cookies.get('sessionCartId');
    

    if (!sessionCartId) {
        const response = NextResponse.next();
        const newSessionCartId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
        
        response.cookies.set('sessionCartId', newSessionCartId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30
        });
        
        return response;
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
    ],
};