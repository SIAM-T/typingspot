import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of paths that require authentication
const protectedPaths = [
  '/dashboard',
  '/profile',
  '/settings',
  '/race',
  '/achievements',
  '/multiplayer'
];

// List of paths that should redirect to dashboard if user is authenticated
const authPaths = [
  '/login',
  '/signup',
  '/auth/reset-password'
];

// List of paths that should be allowed without authentication
const publicPaths = [
  '/',
  '/about',
  '/contact',
  '/features',
  '/pricing',
  '/leaderboard',
  '/privacy-policy',
  '/terms-of-service',
  '/auth/callback',
  '/auth/verify/success',
  '/auth/error',
  '/api/trpc',
  '/api/auth',
  '/api/webhook',
  '/_next',
  '/favicon.ico',
  '/manifest.json',
  '/robots.txt',
  '/sitemap.xml'
];

export async function middleware(req: NextRequest) {
  try {
    // Create supabase client
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    // Check if the path matches any public paths or starts with public assets
    const { pathname } = req.nextUrl;
    
    // Allow all static files and public paths
    if (pathname.startsWith('/_next') || 
        pathname.startsWith('/static') ||
        pathname.startsWith('/images') ||
        pathname.startsWith('/fonts') ||
        pathname.startsWith('/api/') ||
        publicPaths.some(path => pathname === path || pathname.startsWith(path))) {
      return res;
    }

    // Get session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Handle auth paths (login/signup)
    if (authPaths.some(path => pathname.startsWith(path))) {
      if (session) {
        // If user is logged in, redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      return res;
    }

    // Handle protected paths
    if (protectedPaths.some(path => pathname.startsWith(path))) {
      if (!session) {
        // Save the original URL to redirect back after login
        const redirectUrl = pathname + req.nextUrl.search;
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('redirect', redirectUrl);
        return NextResponse.redirect(loginUrl);
      }
      return res;
    }

    // For all other routes, allow access
    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    // In case of error, redirect to login
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

// Update matcher to be more specific about which paths to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * Note: This is a custom matcher function that lets you filter paths
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 