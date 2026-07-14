import { NextResponse } from 'next/server';
import { getCarBySlug, getCarPricing } from '@/lib/providers/cars';
import type { RentalDurationTier } from '@/lib/cars/types';

const VALID_TIERS: RentalDurationTier[] = ['hourly', 'halfDay', 'daily', 'weekend', 'weekly', 'monthly', 'longTerm'];

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const listing = getCarBySlug(slug);
  if (!listing) {
    return NextResponse.json({ error: 'Car rental listing not found' }, { status: 404 });
  }

  const { searchParams } = new URL(req.url);
  const origin = searchParams.get('origin')?.toUpperCase() || 'US';
  const tierParam = searchParams.get('durationTier') as RentalDurationTier | null;
  const durationTier = tierParam && VALID_TIERS.includes(tierParam) ? tierParam : 'daily';

  try {
    const pricing = getCarPricing(listing, origin, durationTier);
    return NextResponse.json({ listing, pricing });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown origin market' },
      { status: 400 }
    );
  }
}
