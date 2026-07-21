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

  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      published,
      publishedAt: published ? (existing.publishedAt ?? new Date()) : existing.publishedAt,
    },
  });
  await logAdminAction('blog.updated', 'BlogPost', id, { published });
  return NextResponse.json({ success: true, post });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { id } = await params;
  await prisma.blogPost.delete({ where: { id } });
  await logAdminAction('blog.deleted', 'BlogPost', id);
  return NextResponse.json({ success: true });
}
