import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all routes starting with /admin, except /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const adminToken = request.cookies.get('admin_token');

    if (!adminToken || adminToken.value !== 'validated_session_active') {
      // If not authenticated, redirect to the admin login page
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/admin/:path*',
};
