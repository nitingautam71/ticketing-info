import { NextResponse } from 'next/server';
import { searchPackages } from '@/lib/providers/packages';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const destination = searchParams.get('destination') || '';
  const packages = await searchPackages({ destination });
  return NextResponse.json(packages);
}
