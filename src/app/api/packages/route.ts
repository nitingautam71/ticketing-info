import { NextResponse } from 'next/server';
import { searchPackages } from '@/lib/providers/packages';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const destination = searchParams.get('destination') || '';
  const category = searchParams.get('category') || undefined;
  const minDuration = searchParams.get('minDuration');
  const maxDuration = searchParams.get('maxDuration');
  const packages = await searchPackages({
    destination,
    category,
    minDuration: minDuration ? Number(minDuration) : undefined,
    maxDuration: maxDuration ? Number(maxDuration) : undefined,
  });
  return NextResponse.json(packages);
}
