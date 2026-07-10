import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_SESSION_COOKIE, adminSessionToken } from '@/lib/adminAuth';

export async function proxy(req: NextRequest) {
  if (req.nextUrl.pathname === '/admin/login') return NextResponse.next();

  const session = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const expected = await adminSessionToken();

  if (!session || session !== expected) {
    const url = req.nextUrl.clone();
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
