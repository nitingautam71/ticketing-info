import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/adminAuth';
import { logAdminAction } from '@/lib/adminAudit';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { id } = await params;
  const { active } = await req.json();

  if (typeof active !== 'boolean') {
    return NextResponse.json({ error: 'active must be a boolean' }, { status: 400 });
  }

  const agent = await prisma.agent.update({ where: { id }, data: { active } });
  await logAdminAction('agent.updated', 'Agent', id, { active });
  return NextResponse.json({ success: true, agent });
}
