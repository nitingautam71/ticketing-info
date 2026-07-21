import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { prisma } from '@/lib/db';
import { blogPostSchema } from '@/lib/cms';
import { requireAdmin } from '@/lib/adminAuth';
import { logAdminAction } from '@/lib/adminAudit';

export async function POST(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    const body = await req.json();
    const input = blogPostSchema.parse(body);

    const existing = await prisma.blogPost.findUnique({ where: { slug: input.slug } });
    if (existing) {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 409 });
    }

    const post = await prisma.blogPost.create({
      data: {
        slug: input.slug,
        title: input.title,
        excerpt: input.excerpt || undefined,
        content: input.content,
        coverImage: input.coverImage || undefined,
        published: input.published ?? false,
        publishedAt: input.published ? new Date() : undefined,
      },
    });
    await logAdminAction('blog.created', 'BlogPost', post.id, { slug: post.slug });
    return NextResponse.json({ success: true, post });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: 'Invalid input', issues: err.issues }, { status: 400 });
    }
    console.error('Failed to create blog post:', err);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}
