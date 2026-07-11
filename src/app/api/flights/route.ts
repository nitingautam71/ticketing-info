import { NextResponse } from 'next/server';
import { searchFlights, type CabinClass } from '@/lib/providers/flights';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get('from') || 'JFK';
  const to = searchParams.get('to') || 'LHR';
  const date = searchParams.get('date') || '';
  const cabinClass = (searchParams.get('class') as CabinClass) || 'Economy';

  const flights = await searchFlights({ from, to, date, cabinClass });
  return NextResponse.json(flights);
}
