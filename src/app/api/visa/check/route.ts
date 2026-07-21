import { NextResponse } from 'next/server';
import { z } from 'zod';
import { checkVisa, logVisaCheck } from '@/lib/visas/engine';
import { resolveCountry } from '@/lib/visas/countries';
import { rateLimit, clientIp, tooManyRequestsResponse } from '@/lib/rateLimit';

const querySchema = z.object({
  passport: z.string().trim().min(2).max(60),
  destination: z.string().trim().min(2).max(60),
  purpose: z
    .enum(['tourism', 'business', 'transit', 'student', 'work', 'medical', 'family_visit', 'digital_nomad'])
    .optional()
    .default('tourism'),
});

export async function GET(req: Request) {
  const { allowed, resetAt } = rateLimit(`visa-check:${clientIp(req)}`, 30, 60_000);
  if (!allowed) return tooManyRequestsResponse(resetAt);

  const { searchParams } = new URL(req.url);
  const parsed = querySchema.safeParse({
    passport: searchParams.get('passport') ?? searchParams.get('nationality') ?? '',
    destination: searchParams.get('destination') ?? '',
    purpose: searchParams.get('purpose') ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 });
  }

  const passport = resolveCountry(parsed.data.passport);
  const destination = resolveCountry(parsed.data.destination);
  if (!passport || !destination) {
    return NextResponse.json(
      { error: 'Unknown country. Use an ISO2 code (e.g. IN), a country slug (e.g. united-states), or the full name.' },
      { status: 404 },
    );
  }

  const result = await checkVisa({
    passportCode: passport.code,
    destinationCode: destination.code,
    purpose: parsed.data.purpose,
  });
  if (!result) return NextResponse.json({ error: 'No rule found for this pair.' }, { status: 404 });

  logVisaCheck({
    passportCode: passport.code,
    destinationCode: destination.code,
    category: result.category,
    purpose: parsed.data.purpose,
    source: 'api',
  });

  return NextResponse.json(result, {
    headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
  });
}
