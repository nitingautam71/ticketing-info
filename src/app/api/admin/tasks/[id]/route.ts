import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { TASK_STATUSES } from '@/lib/tasks';
import { requireAdmin } from '@/lib/adminAuth';
import { logAdminAction } from '@/lib/adminAudit';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { id } = await params;
  const { status } = await req.json();

  if (!TASK_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const task = await prisma.task.update({ where: { id }, data: { status } });
  await logAdminAction('task.updated', 'Task', id, { status });
  return NextResponse.json({ success: true, task });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { id } = await params;
  await prisma.task.delete({ where: { id } });
  await logAdminAction('task.deleted', 'Task', id);
  return NextResponse.json({ success: true });
}
