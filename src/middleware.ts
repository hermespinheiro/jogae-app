import { NextResponse, type NextRequest } from 'next/server';

const protectedPrefixes = ['/account', '/admin'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const mutatingMethod = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method);
  const origin = request.headers.get('origin');
  if (mutatingMethod && origin && origin !== request.nextUrl.origin) {
    return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 });
  }
  const requiresSession = protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  if (requiresSession && !request.cookies.has('jogae_session')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };
