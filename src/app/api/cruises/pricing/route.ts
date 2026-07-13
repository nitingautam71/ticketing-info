import { NextResponse } from 'next/server';
import { getCruiseBySlug, getCruisePricing } from '@/lib/providers/cruises';
import type { CruiseTravelerType, CruisePricingTier } from '@/lib/cruises/types';

const VALID_TRAVELERS: CruiseTravelerType[] = ['solo', 'couple', 'family4', 'largeFamily', 'group', 'senior', 'honeymoon', 'luxuryTraveler'];
const VALID_TIERS: CruisePricingTier[] = ['budget', 'midRange', 'premium', 'luxury'];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slug, originMarket, travelerType: travelerTypeParam, tier: tierParam } = body;

    if (!slug) {
      return NextResponse.json({ error: 'Missing cruise package slug' }, { status: 400 });
    }

    const pkg = getCruiseBySlug(slug);
    if (!pkg) {
      return NextResponse.json({ error: 'Cruise package not found' }, { status: 404 });
    }

    const travelerType = VALID_TRAVELERS.includes(travelerTypeParam) ? travelerTypeParam : 'couple';
    const tier = VALID_TIERS.includes(tierParam) ? tierParam : 'midRange';

    const pricing = getCruisePricing(
      pkg,
      originMarket || 'US',
      travelerType,
      tier
    );

    return NextResponse.json(pricing);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error computing pricing' }, { status: 500 });
  }
}
