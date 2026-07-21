import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/adminAuth';
import { logAdminAction } from '@/lib/adminAudit';

export async function DELETE(req: Request, { params }: { params: Promise<{ key: string }> }) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { key } = await params;
  const decodedKey = decodeURIComponent(key);
  await prisma.siteSetting.delete({ where: { key: decodedKey } });
  await logAdminAction('setting.deleted', 'SiteSetting', decodedKey);
  return NextResponse.json({ success: true });
}
