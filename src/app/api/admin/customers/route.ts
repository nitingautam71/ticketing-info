import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { prisma } from '@/lib/db';
import { customerSchema, toCustomerData } from '@/lib/customers';
import { requireAdmin } from '@/lib/adminAuth';
import { logAdminAction } from '@/lib/adminAudit';

export async function POST(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    const body = await req.json();
    const input = customerSchema.parse(body);
    const customer = await prisma.customer.create({ data: toCustomerData(input) });

    if (typeof body.fromLeadId === 'string' && body.fromLeadId) {
      await prisma.lead.update({ where: { id: body.fromLeadId }, data: { customerId: customer.id } });
    }

    await logAdminAction('customer.created', 'Customer', customer.id);
    return NextResponse.json({ success: true, customer });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: 'Invalid input', issues: err.issues }, { status: 400 });
    }
    if (err instanceof Error && 'code' in err && (err as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: 'A customer with this email already exists' }, { status: 409 });
    }
    console.error('Failed to create customer:', err);
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
  }
}
