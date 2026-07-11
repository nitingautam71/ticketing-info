import { NextResponse } from 'next/server';
import { searchInsurancePlans } from '@/lib/providers/insurance';

export async function GET() {
  const plans = await searchInsurancePlans();
  return NextResponse.json(plans);
}
