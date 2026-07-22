import { NextResponse } from 'next/server';
import { searchFlights, type CabinClass } from '@/lib/providers/flights';
import { rateLimit, clientIp, tooManyRequestsResponse } from '@/lib/rateLimit';

const clampPax = (raw: string | null, max: number) => Math.min(max, Math.max(0, parseInt(raw || '0', 10) || 0));

export async function GET(req: Request) {
  // This proxies a paid, quota-metered upstream (Sky Scrapper) — throttle per IP
  // so a scripted loop can't drain quota or run up cost.
  const { allowed, resetAt } = rateLimit(`flights:${clientIp(req)}`, 20, 60_000);
  if (!allowed) return tooManyRequestsResponse(resetAt);

  const { searchParams } = new URL(req.url);
  const from = searchParams.get('from') || 'JFK';
  const to = searchParams.get('to') || 'LHR';
  const date = searchParams.get('date') || '';
  const returnDate = searchParams.get('returnDate') || '';
  const cabinClass = (searchParams.get('class') as CabinClass) || 'Economy';
  const adults = Math.min(9, Math.max(1, parseInt(searchParams.get('adults') || '1', 10) || 1));
  const children = clampPax(searchParams.get('children'), 8);
  const infants = Math.min(adults, clampPax(searchParams.get('infants'), 9));

  try {
    const flights = await searchFlights({ from, to, date, returnDate, cabinClass, adults, children, infants });
    // Empty array is a valid "no flights on this route/date" answer (200).
    return NextResponse.json(flights);
  } catch (err) {
    // A thrown error here is a real upstream/provider failure, not "no results" —
    // signal it distinctly (502) so the client can show "try again", not "no flights".
    console.error('Flight search failed', err);
    return NextResponse.json({ error: 'search_failed' }, { status: 502 });
  }
}
