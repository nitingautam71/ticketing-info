import { NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE } from '@/lib/adminAuth';

export async function GET(req: Request) {
  const res = NextResponse.redirect(new URL('/admin/login', req.url));
  res.cookies.delete(ADMIN_SESSION_COOKIE);
  return res;
}
