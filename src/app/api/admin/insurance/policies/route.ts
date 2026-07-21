import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/adminAuth';
import { logAdminAction } from '@/lib/adminAudit';
import { generatePolicyDisplayId } from '@/lib/displayId';

/** Policy records managed by consultants: create when a customer buys through
 * us, update as the insurer binds/renews/cancels. The insurer owns the actual
 * contract; this is our CRM-side tracking (renewals, documents, claims help). */

const STATUS = ['quote_requested', 'awaiting_payment', 'active', 'expired', 'cancelled'] as const;

const createSchema = z.object({
  providerName: z.string().trim().min(1).max(120),
  planName: z.string().trim().min(1).max(160),
  planId: z.string().trim().max(80).optional(),
  policyNumber: z.string().trim().max(80).optional(),
  status: z.enum(STATUS).optional(),
  premium: z.number().min(0).max(10_000_000).optional(),
  currency: z.enum(['USD', 'INR']).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  travellers: z.number().int().min(1).max(50).optional(),
  customerId: z.string().optional(),
  leadId: z.string().optional(),
  notes: z.string().trim().max(2000).optional(),
});

const updateSchema = createSchema.partial().extend({ id: z.string().min(1) });

export async function POST(req: Request) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 });
  }
  const d = parsed.data;

  const policy = await prisma.insurancePolicy.create({
    data: {
      displayId: await generatePolicyDisplayId(),
      providerName: d.providerName,
      planName: d.planName,
      planId: d.planId,
      policyNumber: d.policyNumber,
      status: d.status ?? 'quote_requested',
      premium: d.premium,
      currency: d.currency ?? 'USD',
      startDate: d.startDate ? new Date(`${d.startDate}T00:00:00Z`) : undefined,
      endDate: d.endDate ? new Date(`${d.endDate}T00:00:00Z`) : undefined,
      travellers: d.travellers ?? 1,
      customerId: d.customerId,
      leadId: d.leadId,
      notes: d.notes,
    },
  });
  await logAdminAction('insurance_policy_create', 'InsurancePolicy', policy.id, { displayId: policy.displayId, provider: d.providerName });

  return NextResponse.json(policy);
}

export async function PATCH(req: Request) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const parsed = updateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 });
  }
  const { id, startDate, endDate, ...rest } = parsed.data;

  const policy = await prisma.insurancePolicy
    .update({
      where: { id },
      data: {
        ...rest,
        ...(startDate ? { startDate: new Date(`${startDate}T00:00:00Z`) } : {}),
        ...(endDate ? { endDate: new Date(`${endDate}T00:00:00Z`) } : {}),
      },
    })
    .catch(() => null);
  if (!policy) return NextResponse.json({ error: 'Policy not found' }, { status: 404 });
  await logAdminAction('insurance_policy_update', 'InsurancePolicy', id, rest);

  return NextResponse.json(policy);
}
