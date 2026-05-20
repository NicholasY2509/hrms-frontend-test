import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;

  const isAuthRoute =
    pathname.startsWith('/employee') ||
    pathname.startsWith('/management') ||
    pathname.startsWith('/configuration');

  const isGuestRoute = pathname.startsWith('/login');

  if (isAuthRoute && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  if (isGuestRoute && token && !pathname.startsWith('/login/callback')) {
    return NextResponse.redirect(new URL('/management', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

