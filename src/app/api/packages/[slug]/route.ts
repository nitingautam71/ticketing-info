import { NextResponse } from 'next/server';
import { getAllPricingTiers, getPackageBySlug, getPackagePricing } from '@/lib/providers/packages';
import type { PricingTier, TravelerType } from '@/lib/packages/types';

const VALID_TRAVELER_TYPES: TravelerType[] = ['solo', 'couple', 'family4', 'group8'];
const VALID_TIERS: PricingTier[] = ['budget', 'midRange', 'premium', 'luxury'];

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pkg = getPackageBySlug(slug);
  if (!pkg) return NextResponse.json({ error: 'Package not found' }, { status: 404 });

  const { searchParams } = new URL(req.url);
  const origin = searchParams.get('origin')?.toUpperCase() || 'US';
  const travelerTypeParam = searchParams.get('travelerType') as TravelerType | null;
  const tierParam = searchParams.get('tier') as PricingTier | null;
  const travelerType = travelerTypeParam && VALID_TRAVELER_TYPES.includes(travelerTypeParam) ? travelerTypeParam : 'couple';
  const tier = tierParam && VALID_TIERS.includes(tierParam) ? tierParam : 'midRange';

  try {
    const pricing = getPackagePricing(pkg, origin, travelerType, tier);
    const allTiers = getAllPricingTiers(pkg, origin, travelerType);
    return NextResponse.json({ package: pkg, pricing, allTiers });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown origin market' }, { status: 400 });
  }
}
