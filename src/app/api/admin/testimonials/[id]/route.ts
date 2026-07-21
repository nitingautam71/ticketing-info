import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/adminAuth';
import { logAdminAction } from '@/lib/adminAudit';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { id } = await params;
  const { published } = await req.json();

  if (typeof published !== 'boolean') {
    return NextResponse.json({ error: 'published must be a boolean' }, { status: 400 });
  }

  const testimonial = await prisma.testimonial.update({ where: { id }, data: { published } });
  await logAdminAction('testimonial.updated', 'Testimonial', id, { published });
  return NextResponse.json({ success: true, testimonial });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { id } = await params;
  await prisma.testimonial.delete({ where: { id } });
  await logAdminAction('testimonial.deleted', 'Testimonial', id);
  return NextResponse.json({ success: true });
}
