import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const data: { published?: boolean; sortOrder?: number } = {};

  if (typeof body.published === 'boolean') data.published = body.published;
  if (typeof body.sortOrder === 'number') data.sortOrder = body.sortOrder;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  const faq = await prisma.faqEntry.update({ where: { id }, data });
  return NextResponse.json({ success: true, faq });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.faqEntry.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
