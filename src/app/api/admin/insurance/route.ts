import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/adminAuth';
import { logAdminAction } from '@/lib/adminAudit';
import { invalidateInsuranceOverrideCache } from '@/lib/insurance/engine';
import { planById } from '@/lib/insurance/plans';

/** Admin console: plan overrides (deactivate a plan, adjust the estimate
 * multiplier, attach a public note). Mirrors /api/admin/visas. */

const upsertSchema = z.object({
  planId: z.string().min(1).max(80),
  active: z.boolean(),
  premiumMultiplier: z.number().min(0.2).max(5).nullable().optional(),
  notes: z.string().trim().max(1000).nullable().optional(),
});

const deleteSchema = z.object({ id: z.string().min(1) });

export async function PUT(req: Request) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const parsed = upsertSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 });
  }
  const { planId, active, premiumMultiplier, notes } = parsed.data;
  if (!planById(planId)) {
    return NextResponse.json({ error: 'Unknown plan id' }, { status: 400 });
  }

  const override = await prisma.insurancePlanOverride.upsert({
    where: { planId },
    create: { planId, active, premiumMultiplier: premiumMultiplier ?? null, notes: notes || null, updatedBy: 'admin' },
    update: { active, premiumMultiplier: premiumMultiplier ?? null, notes: notes || null, updatedBy: 'admin' },
  });
  invalidateInsuranceOverrideCache();
  await logAdminAction('insurance_plan_override', 'InsurancePlanOverride', override.id, { planId, active, premiumMultiplier, notes });

  return NextResponse.json(override);
}

export async function DELETE(req: Request) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const parsed = deleteSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  const removed = await prisma.insurancePlanOverride.delete({ where: { id: parsed.data.id } }).catch(() => null);
  if (!removed) return NextResponse.json({ error: 'Override not found' }, { status: 404 });
  invalidateInsuranceOverrideCache();
  await logAdminAction('insurance_plan_override_delete', 'InsurancePlanOverride', parsed.data.id, { planId: removed.planId });

  return NextResponse.json({ ok: true });
}
