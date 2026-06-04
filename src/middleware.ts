import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-url', request.nextUrl.pathname + request.nextUrl.search);
  requestHeaders.set('x-method', request.method);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes (/api/...)
     * - static files (_next/static/...)
     * - Next.js image optimization (/_next/image...)
     * - standard public asset files (favicon.ico, icon.svg, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|icon.svg|images|.*\\.).*)',
  ],
};
