import { NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, adminSessionToken } from '@/lib/adminAuth';
import { rateLimit, clientIp, tooManyRequestsResponse } from '@/lib/rateLimit';

export async function POST(req: Request) {
  const { allowed, resetAt } = rateLimit(`admin-login:${clientIp(req)}`, 5, 15 * 60_000);
  if (!allowed) return tooManyRequestsResponse(resetAt);

  const { password } = await req.json();

  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  }

  const token = await adminSessionToken();
  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete(ADMIN_SESSION_COOKIE);
  return res;
}
