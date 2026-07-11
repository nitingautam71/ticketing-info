import { NextResponse } from 'next/server';
import { popularHotelDestinations } from '@/lib/providers/hotels';

export async function GET() {
  const destinations = await popularHotelDestinations();
  return NextResponse.json(destinations);
}
