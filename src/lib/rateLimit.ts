/**
 * In-memory fixed-window rate limiter — good enough for a single-instance MVP
 * deployment. It resets per server process, so on serverless platforms with
 * multiple concurrent instances the effective limit is per-instance, not
 * global. Swap for a shared store (Upstash Redis, Vercel KV) if traffic
 * outgrows a single instance or abuse becomes a real problem.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

function prune(now: number) {
  if (buckets.size < 5000) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export function rateLimit(key: string, limit: number, windowMs: number): { allowed: boolean; resetAt: number } {
  const now = Date.now();
  prune(now);

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { allowed: true, resetAt };
  }

  if (existing.count >= limit) {
    return { allowed: false, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return { allowed: true, resetAt: existing.resetAt };
}

export function clientIp(req: Request): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

export function tooManyRequestsResponse(resetAt: number) {
  const retryAfterSeconds = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
  return Response.json(
    { error: 'Too many requests. Please try again shortly, or call/WhatsApp us directly.' },
    { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } },
  );
}
