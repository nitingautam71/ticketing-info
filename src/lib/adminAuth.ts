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
