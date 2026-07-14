import { NextResponse } from 'next/server';
import { getCarBySlug, getCarPricing } from '@/lib/providers/cars';
import type { RentalDurationTier } from '@/lib/cars/types';
import type { CarPricingOptions } from '@/lib/cars/pricing';

const VALID_TIERS: RentalDurationTier[] = ['hourly', 'halfDay', 'daily', 'weekend', 'weekly', 'monthly', 'longTerm'];
const VALID_AGES = ['young', 'standard', 'senior'] as const;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slug, originMarket, durationTier: tierParam, options: rawOptions } = body;

    if (!slug) {
      return NextResponse.json({ error: 'Missing car listing slug' }, { status: 400 });
    }

    const listing = await getCarBySlug(slug);
    if (!listing) {
      return NextResponse.json({ error: 'Car rental listing not found' }, { status: 404 });
    }

    const durationTier: RentalDurationTier = VALID_TIERS.includes(tierParam) ? tierParam : 'daily';

    // Whitelist every option field — invalid values default rather than erroring.
    const raw = (rawOptions ?? {}) as Record<string, unknown>;
    const options: CarPricingOptions = {
      driverAge: VALID_AGES.includes(raw.driverAge as (typeof VALID_AGES)[number]) ? (raw.driverAge as CarPricingOptions['driverAge']) : 'standard',
      additionalDriver: raw.additionalDriver === true,
      oneWay: raw.oneWay === true,
      gps: raw.gps === true,
      wifi: raw.wifi === true,
      childSeat: raw.childSeat === true,
      snowChains: raw.snowChains === true,
      fuelPackage: raw.fuelPackage === true,
      premiumInsurance: raw.premiumInsurance === true,
      travelMonth: typeof raw.travelMonth === 'number' && raw.travelMonth >= 1 && raw.travelMonth <= 12 ? raw.travelMonth : undefined,
    };

    const pricing = getCarPricing(listing, originMarket || 'US', durationTier, options);
    return NextResponse.json(pricing);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error computing pricing' },
      { status: 500 }
    );
  }
}
