import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { callClickSchema, createCallClick } from '@/lib/callTracking';
import { rateLimit, clientIp, tooManyRequestsResponse } from '@/lib/rateLimit';

// Receives sendBeacon() payloads from call/WhatsApp CTAs (src/lib/attribution.ts).
// Beacons can't read the response, so this endpoint stays silent on success and
// never blocks the user's actual tel:/wa.me navigation.
export async function POST(req: Request) {
  const { allowed, resetAt } = rateLimit(`calls:${clientIp(req)}`, 20, 60_000);
  if (!allowed) return tooManyRequestsResponse(resetAt);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  try {
    const input = callClickSchema.parse(body);
    await createCallClick(input);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: 'Invalid input', issues: err.issues }, { status: 400 });
    }
    console.error('Failed to record call click:', err);
    return NextResponse.json({ error: 'Failed to record call click' }, { status: 500 });
  }
}
