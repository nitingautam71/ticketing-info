import { NextResponse } from 'next/server';
import { getCruiseBySlug, getCruisePricing, getAllCruisePricingTiers } from '@/lib/providers/cruises';
import type { CruiseTravelerType, CruisePricingTier } from '@/lib/cruises/types';

const VALID_TRAVELERS: CruiseTravelerType[] = ['solo', 'couple', 'family4', 'largeFamily', 'group', 'senior', 'honeymoon', 'luxuryTraveler'];
const VALID_TIERS: CruisePricingTier[] = ['budget', 'midRange', 'premium', 'luxury'];

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pkg = await getCruiseBySlug(slug);
  if (!pkg) {
    return NextResponse.json({ error: 'Cruise package not found' }, { status: 404 });
  }

  const { searchParams } = new URL(req.url);
  const origin = searchParams.get('origin')?.toUpperCase() || 'US';
  const travelerTypeParam = searchParams.get('travelerType') as CruiseTravelerType | null;
  const tierParam = searchParams.get('tier') as CruisePricingTier | null;

  const travelerType = travelerTypeParam && VALID_TRAVELERS.includes(travelerTypeParam) ? travelerTypeParam : 'couple';
  const tier = tierParam && VALID_TIERS.includes(tierParam) ? tierParam : 'midRange';

  try {
    const pricing = getCruisePricing(pkg, origin, travelerType, tier);
    const allTiers = getAllCruisePricingTiers(pkg, origin, travelerType);
    return NextResponse.json({ package: pkg, pricing, allTiers });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown origin market' },
      { status: 400 }
    );
  }
}
