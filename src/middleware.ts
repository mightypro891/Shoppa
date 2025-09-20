
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = path.startsWith('/admin') || path.startsWith('/profile') || path.startsWith('/fund-wallet');
  
  // The Firebase session is stored in a cookie. We just need to check for its existence.
  // Note: The actual cookie name might vary, but 'session' is a common pattern.
  // For this prototype, checking any cookie that looks like a session is sufficient.
  const sessionCookie = request.cookies.get('session') || Object.keys(request.cookies).find(key => key.includes('firebase:authUser'));

  if (isProtectedRoute && !sessionCookie) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/signin';
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*', '/profile/:path*', '/fund-wallet/:path*'],
}
