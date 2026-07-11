import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { TASK_STATUSES } from '@/lib/tasks';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { status } = await req.json();

  if (!TASK_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const task = await prisma.task.update({ where: { id }, data: { status } });
  return NextResponse.json({ success: true, task });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.task.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
