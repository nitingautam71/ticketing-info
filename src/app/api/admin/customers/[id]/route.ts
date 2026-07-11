import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { prisma } from '@/lib/db';
import { customerSchema, toCustomerData } from '@/lib/customers';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const input = customerSchema.parse(body);
    const customer = await prisma.customer.update({ where: { id }, data: toCustomerData(input) });
    return NextResponse.json({ success: true, customer });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: 'Invalid input', issues: err.issues }, { status: 400 });
    }
    console.error('Failed to update customer:', err);
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
  }
}
