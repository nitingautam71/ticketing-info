import { NextResponse } from 'next/server';
import { searchTrains } from '@/lib/providers/trains';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get('from') || 'Paris';
  const to = searchParams.get('to') || 'London';
  const trains = await searchTrains({ from, to });
  return NextResponse.json(trains);
}
