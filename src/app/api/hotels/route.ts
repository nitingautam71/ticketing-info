import { NextResponse } from 'next/server';
import { searchHotels } from '@/lib/providers/hotels';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const location = searchParams.get('location') || 'London';
  const hotels = await searchHotels({ location });
  return NextResponse.json(hotels);
}
