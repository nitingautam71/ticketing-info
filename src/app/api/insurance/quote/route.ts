import { NextResponse } from 'next/server';
import { z } from 'zod';
import { logInsuranceQuote, quotePlans } from '@/lib/insurance/engine';
import { resolveCountry } from '@/lib/visas/countries';
import { clientIp, rateLimit, tooManyRequestsResponse } from '@/lib/rateLimit';

/**
 * GET /api/insurance/quote
 *   ?residence=IN&destination=US&start=2026-09-01&end=2026-09-20
 *   &ages=34,62&tripCost=4000&categories=family,senior&annual=false
 *
 * Public quote contract. Deterministic per input (cacheable at the edge);
 * premiums are indicative estimates, never bindable prices.
 */

const CATEGORY_VALUES = [
  'single_trip', 'annual_multi_trip', 'domestic_india', 'schengen', 'student', 'senior', 'family',
  'business', 'cruise', 'adventure', 'backpacker', 'digital_nomad', 'visitors_usa', 'visitors_india',
  'medical_travel', 'pilgrimage', 'group',
] as const;

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const querySchema = z.object({
  residence: z.string().min(2).max(60),
  destination: z.string().min(2).max(60),
  start: z.string().regex(DATE_RE, 'start must be YYYY-MM-DD'),
  end: z.string().regex(DATE_RE, 'end must be YYYY-MM-DD'),
  ages: z
    .string()
    .transform((s) => s.split(',').map((a) => Number(a.trim())).filter((n) => Number.isFinite(n)))
    .pipe(z.array(z.number().int().min(0).max(110)).min(1).max(9)),
  tripCost: z.coerce.number().min(0).max(500_000).optional(),
  categories: z
    .string()
    .optional()
    .transform((s) => (s ? s.split(',').map((c) => c.trim()) : []))
    .pipe(z.array(z.enum(CATEGORY_VALUES)).max(5)),
  annual: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => v === 'true'),
});

export async function GET(req: Request) {
  const { allowed, resetAt } = rateLimit(`insurance-quote:${clientIp(req)}`, 30, 60_000);
  if (!allowed) return tooManyRequestsResponse(resetAt);

  const url = new URL(req.url);
  const parsed = querySchema.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 });
  }

  const residence = resolveCountry(parsed.data.residence);
  const destination = resolveCountry(parsed.data.destination);
  if (!residence || !destination) {
    return NextResponse.json({ error: 'Unknown residence or destination country' }, { status: 404 });
  }
  if (parsed.data.end < parsed.data.start) {
    return NextResponse.json({ error: 'end date must be on or after start date' }, { status: 400 });
  }

  const result = await quotePlans({
    residence: residence.code,
    destination: destination.code,
    startDate: parsed.data.start,
    endDate: parsed.data.end,
    travellers: parsed.data.ages.map((age) => ({ age })),
    tripCostUsd: parsed.data.tripCost,
    categories: parsed.data.categories,
    annual: parsed.data.annual,
  });

  logInsuranceQuote({
    residence: residence.code,
    destination: destination.code,
    durationDays: result.input.durationDays,
    travellers: parsed.data.ages.length,
    oldestAge: Math.max(...parsed.data.ages),
    categories: parsed.data.categories,
    topPlanId: result.quotes[0]?.plan.id,
    source: 'api',
  });

  return NextResponse.json(result, {
    headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
  });
}
