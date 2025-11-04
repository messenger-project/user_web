import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_ROUTES = ['/checkout/shipping'];

async function verifyToken(token: string) {
    const res = await fetch(`${process.env.LARAVEL_URL}/api/v1/user`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return false;
    return true;
}

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value;
    const pathname = req.nextUrl.pathname;

    const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

    if (isProtected) {
        if (!token) return NextResponse.redirect(new URL('/login', req.url));

        const valid = await verifyToken(token);
        if (!valid) return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.svg|fonts|images).*)'],
};
