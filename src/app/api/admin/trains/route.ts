import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/adminAuth';
import { logAdminAction } from '@/lib/adminAudit';
import { invalidateTrainOverrideCache, trainBySlug } from '@/lib/trains/engine';

const upsertSchema = z.object({
  trainSlug: z.string().trim().min(1).max(120).toLowerCase(),
  status: z.enum(['running', 'disrupted', 'suspended']),
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
  const { trainSlug, status, notes } = parsed.data;

  if (!trainBySlug(trainSlug)) {
    return NextResponse.json({ error: 'Unknown train slug' }, { status: 400 });
  }

  const override = await prisma.trainServiceOverride.upsert({
    where: { trainSlug },
    create: { trainSlug, status, notes: notes || null, updatedBy: 'admin' },
    update: { status, notes: notes || null, updatedBy: 'admin' },
  });
  invalidateTrainOverrideCache();
  await logAdminAction('train_service_override', 'TrainServiceOverride', override.id, { trainSlug, status, notes });

  return NextResponse.json(override);
}

export async function DELETE(req: Request) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const parsed = deleteSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  const removed = await prisma.trainServiceOverride.delete({ where: { id: parsed.data.id } }).catch(() => null);
  if (!removed) return NextResponse.json({ error: 'Override not found' }, { status: 404 });
  invalidateTrainOverrideCache();
  await logAdminAction('train_service_override_delete', 'TrainServiceOverride', parsed.data.id, { trainSlug: removed.trainSlug });

  return NextResponse.json({ ok: true });
}
