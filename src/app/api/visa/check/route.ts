import { NextResponse } from 'next/server';
import { checkVisa } from '@/lib/providers/visas';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const nationality = searchParams.get('nationality') || 'United States';
  const destination = searchParams.get('destination') || 'United Kingdom';
  const info = await checkVisa({ nationality, destination });
  return NextResponse.json(info);
}
