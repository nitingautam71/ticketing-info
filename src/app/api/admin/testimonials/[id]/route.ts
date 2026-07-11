import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { published } = await req.json();

  if (typeof published !== 'boolean') {
    return NextResponse.json({ error: 'published must be a boolean' }, { status: 400 });
  }

  const testimonial = await prisma.testimonial.update({ where: { id }, data: { published } });
  return NextResponse.json({ success: true, testimonial });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.testimonial.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
