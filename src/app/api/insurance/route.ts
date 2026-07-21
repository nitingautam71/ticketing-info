import { NextResponse } from 'next/server';
import { insuranceCatalogProvider } from '@/lib/providers/insurance';
import { providerById } from '@/lib/insurance/providers';
import { INSURANCE_DISCLAIMER } from '@/lib/insurance/types';

/** Public catalog summary — plan directory without pricing (pricing lives at
 * /api/insurance/quote, which needs trip context). Cacheable for a day. */
export async function GET() {
  const plans = insuranceCatalogProvider.plans().map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    provider: providerById(p.providerId)?.name ?? p.providerId,
    market: p.market,
    categories: p.categories,
    regions: p.regions,
    medicalSumInsured: p.medicalSumInsuredLabel,
    tagline: p.tagline,
    url: `/insurance/plan/${p.slug}`,
  }));
  return NextResponse.json(
    { plans, disclaimer: INSURANCE_DISCLAIMER },
    { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400' } },
  );
}
