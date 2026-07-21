import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/adminAuth';
import { logAdminAction } from '@/lib/adminAudit';
import { generateClaimDisplayId } from '@/lib/displayId';

/** Claim-help records: we track and chase claims with the insurer on the
 * customer's behalf; the insurer adjudicates. Every status change appends to
 * the timeline so the customer-facing history stays complete. */

const STATUS = ['draft', 'submitted_to_insurer', 'in_review', 'info_requested', 'approved', 'paid', 'rejected', 'closed'] as const;
const CLAIM_TYPES = ['medical', 'trip_cancellation', 'trip_interruption', 'baggage', 'delay', 'passport_loss', 'other'] as const;

const createSchema = z.object({
  policyId: z.string().min(1),
  claimType: z.enum(CLAIM_TYPES),
  description: z.string().trim().max(2000).optional(),
  amountClaimed: z.number().min(0).max(10_000_000).optional(),
  currency: z.enum(['USD', 'INR']).optional(),
  insurerRef: z.string().trim().max(80).optional(),
});

const updateSchema = z.object({
  id: z.string().min(1),
  status: z.enum(STATUS).optional(),
  amountApproved: z.number().min(0).max(10_000_000).optional(),
  insurerRef: z.string().trim().max(80).optional(),
  note: z.string().trim().max(1000).optional(),
});

export async function POST(req: Request) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 });
  }
  const d = parsed.data;

  const policy = await prisma.insurancePolicy.findUnique({ where: { id: d.policyId } });
  if (!policy) return NextResponse.json({ error: 'Policy not found' }, { status: 404 });

  const claim = await prisma.insuranceClaim.create({
    data: {
      displayId: await generateClaimDisplayId(),
      policyId: d.policyId,
      claimType: d.claimType,
      description: d.description,
      amountClaimed: d.amountClaimed,
      currency: d.currency ?? policy.currency,
      insurerRef: d.insurerRef,
      timeline: [{ at: new Date().toISOString(), status: 'draft', note: 'Claim record opened' }],
    },
  });
  await logAdminAction('insurance_claim_create', 'InsuranceClaim', claim.id, { displayId: claim.displayId, policyId: d.policyId });

  return NextResponse.json(claim);
}

export async function PATCH(req: Request) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const parsed = updateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 });
  }
  const { id, status, amountApproved, insurerRef, note } = parsed.data;

  const existing = await prisma.insuranceClaim.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'Claim not found' }, { status: 404 });

  const timeline = Array.isArray(existing.timeline) ? (existing.timeline as unknown[]) : [];
  if (status || note) {
    timeline.push({ at: new Date().toISOString(), status: status ?? existing.status, note: note ?? null });
  }

  const claim = await prisma.insuranceClaim.update({
    where: { id },
    data: {
      ...(status ? { status } : {}),
      ...(amountApproved !== undefined ? { amountApproved } : {}),
      ...(insurerRef !== undefined ? { insurerRef } : {}),
      timeline: timeline as object[],
    },
  });
  await logAdminAction('insurance_claim_update', 'InsuranceClaim', id, { status, amountApproved });

  return NextResponse.json(claim);
}
