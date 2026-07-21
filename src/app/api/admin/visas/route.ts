import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/adminAuth';
import { logAdminAction } from '@/lib/adminAudit';
import { invalidateOverrideCache } from '@/lib/visas/engine';
import { countryByCode } from '@/lib/visas/countries';

const upsertSchema = z.object({
  passportCode: z.string().length(2).transform((s) => s.toUpperCase()),
  destinationCode: z.string().length(2).transform((s) => s.toUpperCase()),
  category: z.enum(['visa_free', 'visa_on_arrival', 'e_visa', 'eta', 'visa_required', 'no_admission']),
  allowedStayDays: z.number().int().min(1).max(3650).nullable().optional(),
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
  const { passportCode, destinationCode, category, allowedStayDays, notes } = parsed.data;

  if (!countryByCode(passportCode) || !countryByCode(destinationCode) || passportCode === destinationCode) {
    return NextResponse.json({ error: 'Invalid country pair' }, { status: 400 });
  }

  const override = await prisma.visaRuleOverride.upsert({
    where: { passportCode_destinationCode: { passportCode, destinationCode } },
    create: { passportCode, destinationCode, category, allowedStayDays: allowedStayDays ?? null, notes: notes || null, updatedBy: 'admin' },
    update: { category, allowedStayDays: allowedStayDays ?? null, notes: notes || null, updatedBy: 'admin' },
  });
  invalidateOverrideCache();
  await logAdminAction('visa_rule_override', 'VisaRuleOverride', override.id, { passportCode, destinationCode, category, allowedStayDays, notes });

  return NextResponse.json(override);
}

export async function DELETE(req: Request) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const parsed = deleteSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  const removed = await prisma.visaRuleOverride.delete({ where: { id: parsed.data.id } }).catch(() => null);
  if (!removed) return NextResponse.json({ error: 'Override not found' }, { status: 404 });
  invalidateOverrideCache();
  await logAdminAction('visa_rule_override_delete', 'VisaRuleOverride', parsed.data.id, {
    passportCode: removed.passportCode,
    destinationCode: removed.destinationCode,
  });

  return NextResponse.json({ ok: true });
}
