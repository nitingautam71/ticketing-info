import { NextResponse } from 'next/server';
import { searchAirports } from '@/lib/providers/flights';
import { rateLimit, clientIp, tooManyRequestsResponse } from '@/lib/rateLimit';

export async function GET(req: Request) {
  // The typeahead fires this on (debounced) keystrokes and it proxies the paid
  // Sky Scrapper airport lookup — throttle generously per IP to cap abuse cost
  // while leaving normal typing unaffected.
  const { allowed, resetAt } = rateLimit(`airports:${clientIp(req)}`, 40, 60_000);
  if (!allowed) return tooManyRequestsResponse(resetAt);

  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query') || '';

  try {
    const airports = await searchAirports(query);
    return NextResponse.json(airports);
  } catch (err) {
    console.error('Airport search failed', err);
    return NextResponse.json([]);
  }
}
