import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_ROUTES = ['/login', '/register'];

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const pathname = request.nextUrl.pathname;

    const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));

    if (!token) {
        if (isPublicRoute) return NextResponse.next();

        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
        await jwtVerify(token, secret);

        if (isPublicRoute) {
            return NextResponse.redirect(new URL('/c/me', request.url));
        }

        return NextResponse.next();
    } catch (err) {
        console.log('Invalid token:', err);

        if (isPublicRoute) return NextResponse.next();

        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|logo.svg|fonts|images).*)',
    ],
};
