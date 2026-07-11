import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { published } = await req.json();

  if (typeof published !== 'boolean') {
    return NextResponse.json({ error: 'published must be a boolean' }, { status: 400 });
  }

  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      published,
      publishedAt: published ? (existing.publishedAt ?? new Date()) : existing.publishedAt,
    },
  });
  return NextResponse.json({ success: true, post });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
