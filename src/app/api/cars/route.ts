import { NextResponse } from 'next/server';
import { searchCars } from '@/lib/providers/cars';

function parseList(value: string | null): string[] | undefined {
  if (!value) return undefined;
  const list = value.split(',').map((v) => v.trim()).filter(Boolean);
  return list.length > 0 ? list : undefined;
}

function parseBool(value: string | null): boolean | undefined {
  return value === 'true' ? true : undefined;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const response = await searchCars({
      q: searchParams.get('q') || '',
      companies: parseList(searchParams.get('company')),
      countries: parseList(searchParams.get('country')),
      cities: parseList(searchParams.get('city')),
      categories: parseList(searchParams.get('category')),
      brands: parseList(searchParams.get('brand')),
      transmission: searchParams.get('transmission') === 'Automatic' ? 'Automatic' : searchParams.get('transmission') === 'Manual' ? 'Manual' : undefined,
      evOnly: parseBool(searchParams.get('ev')),
      hybridOnly: parseBool(searchParams.get('hybrid')),
      luxuryOnly: parseBool(searchParams.get('luxury')),
      minSeats: searchParams.get('minSeats') ? Number(searchParams.get('minSeats')) : undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      airportPickup: parseBool(searchParams.get('airportPickup')),
      unlimitedMileage: parseBool(searchParams.get('unlimitedMileage')),
      freeCancellation: parseBool(searchParams.get('freeCancellation')),
      petFriendly: parseBool(searchParams.get('petFriendly')),
      oneWay: parseBool(searchParams.get('oneWay')),
      page: searchParams.get('page') ? Number(searchParams.get('page')) : undefined,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined,
    });

    return NextResponse.json(response);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to search cars' },
      { status: 500 }
    );
  }
}
