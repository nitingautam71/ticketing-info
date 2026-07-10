import { NextResponse } from 'next/server';
import { searchCruises } from '@/lib/providers/cruises';

export async function GET() {
  const cruises = await searchCruises();
  return NextResponse.json(cruises);
}
