import { NextResponse } from 'next/server';
import { z } from 'zod';
import { logTrainSearch, searchCorridor, TRAIN_DISCLAIMER } from '@/lib/trains/engine';
import { rateLimit, clientIp, tooManyRequestsResponse } from '@/lib/rateLimit';

const querySchema = z.object({
  from: z.string().trim().min(2).max(80),
  to: z.string().trim().min(2).max(80),
});

/**
 * GET /api/trains/search?from=new-york&to=washington-dc
 * `from`/`to` accept a station code (NYP, NDLS), station slug, city slug or
 * free text. Returns every bundled service on the corridor with segment
 * timings, indicative fares and live admin status.
 */
export async function GET(req: Request) {
  const { allowed, resetAt } = rateLimit(`train-search:${clientIp(req)}`, 30, 60_000);
  if (!allowed) return tooManyRequestsResponse(resetAt);

  const { searchParams } = new URL(req.url);
  const parsed = querySchema.safeParse({ from: searchParams.get('from') ?? '', to: searchParams.get('to') ?? '' });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 });
  }

  const result = await searchCorridor(parsed.data.from, parsed.data.to);
  if (!result) {
    return NextResponse.json({ error: 'Unknown origin or destination station/city' }, { status: 404 });
  }

  logTrainSearch({
    fromQuery: parsed.data.from,
    toQuery: parsed.data.to,
    fromCode: result.from[0]?.code,
    toCode: result.to[0]?.code,
    results: result.journeys.length,
    source: 'api',
  });

  return NextResponse.json(
    { ...result, disclaimer: TRAIN_DISCLAIMER },
    { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } },
  );
}
