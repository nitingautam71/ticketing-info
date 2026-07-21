import { NextResponse } from 'next/server';

export const ADMIN_SESSION_COOKIE = 'admin_session';

/**
 * Derives a verifiable session token from the shared ADMIN_PASSWORD so the
 * cookie can't just be forged by setting an arbitrary value in devtools.
 * This is a stopgap gate for a single-operator MVP admin panel — replace
 * with real multi-user auth (e.g. NextAuth) once there's more than one admin.
 */
export async function adminSessionToken(): Promise<string> {
  const password = process.env.ADMIN_PASSWORD || '';
  const data = new TextEncoder().encode(`ticketing-info-admin:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Constant-time string comparison. Avoids leaking how many leading characters
 * of a secret matched via response-timing differences. Works on the Edge
 * runtime (no Node `crypto.timingSafeEqual`). The compare runs over a fixed
 * number of iterations regardless of input so length itself isn't a fast oracle.
 */
export function constantTimeEqual(a: string, b: string): boolean {
  const len = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < len; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

function readCookie(req: Request, name: string): string | undefined {
  const header = req.headers.get('cookie');
  if (!header) return undefined;
  for (const part of header.split(';')) {
    const eq = part.indexOf('=');
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() === name) return part.slice(eq + 1).trim();
  }
  return undefined;
}

/** True when the request carries a valid admin session cookie. */
export async function isValidAdminSession(req: Request): Promise<boolean> {
  const session = readCookie(req, ADMIN_SESSION_COOKIE);
  if (!session) return false;
  return constantTimeEqual(session, await adminSessionToken());
}

/**
 * Handler-level authorization guard for /api/admin routes. Edge middleware
 * (`proxy.ts`) already gates these paths, but calling this at the top of each
 * handler enforces authorization in depth so a middleware bypass or matcher
 * misconfiguration can't silently expose admin data. Returns a 401 response to
 * short-circuit on failure, or `null` when the caller may proceed.
 */
export async function requireAdmin(req: Request): Promise<NextResponse | null> {
  if (await isValidAdminSession(req)) return null;
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
