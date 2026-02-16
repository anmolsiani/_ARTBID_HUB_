import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require authentication
const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/settings',
    '/upload',
    '/library/upload'
]

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const token = request.cookies.get('token')?.value || ''

    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

    // If trying to access protected route without token, redirect to login
    if (isProtectedRoute && !token) {
        const url = new URL('/login', request.url)
        url.searchParams.set('redirect', pathname)
        return NextResponse.redirect(url)
    }

    // If logged in and trying to access login/register, redirect to dashboard
    if (token && (pathname === '/login' || pathname === '/register')) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/ai-generator/:path*',
        '/messages/:path*',
        '/profile/:path*',
        '/settings/:path*',
        '/upload/:path*',
        '/library/upload/:path*',
        '/login',
        '/register',
    ],
}

