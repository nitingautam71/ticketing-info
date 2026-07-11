import { NextResponse } from 'next/server';
import { searchCars } from '@/lib/providers/cars';

export async function GET() {
  const cars = await searchCars();
  return NextResponse.json(cars);
}
