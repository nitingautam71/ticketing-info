import { NextResponse } from 'next/server';
import { searchAirports } from '@/lib/providers/flights';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query') || '';

  try {
    const airports = await searchAirports(query);
    return NextResponse.json(airports);
  } catch (err) {
    console.error('Airport search failed', err);
    return NextResponse.json([]);
  }
}
