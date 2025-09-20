
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Protect routes that require any authenticated user
  const isUserProtectedRoute = path.startsWith('/profile') || path.startsWith('/fund-wallet');
  
  const sessionCookie = request.cookies.get('session') || Object.keys(request.cookies).find(key => key.includes('firebase:authUser'));

  if (isUserProtectedRoute && !sessionCookie) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/signin';
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // The client-side AuthContext and AppLayout will handle the more complex logic
  // of checking if a user is an admin for the /admin routes.
  // Middleware is best for simple authentication checks.

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/profile/:path*', '/fund-wallet/:path*'],
}
