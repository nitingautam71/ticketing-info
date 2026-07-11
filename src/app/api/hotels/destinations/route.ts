import { NextResponse } from 'next/server';
import { searchHotelDestinations } from '@/lib/providers/hotels';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query') || '';

  try {
    const destinations = await searchHotelDestinations(query);
    return NextResponse.json(destinations);
  } catch (err) {
    console.error('Hotel destination search failed', err);
    return NextResponse.json([]);
  }
}
