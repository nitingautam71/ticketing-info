import { NextResponse } from 'next/server';
import { searchTransfers } from '@/lib/providers/transfers';

export async function GET() {
  const transfers = await searchTransfers();
  return NextResponse.json(transfers);
}
