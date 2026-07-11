import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || !post.published) return {};

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: post.coverImage ? { images: [{ url: post.coverImage }] } : undefined,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });

  if (!post || !post.published) notFound();

  return (
    <article className="flex-1 max-w-3xl w-full mx-auto px-4 md:px-8 pt-28 lg:pt-24 pb-16">
      {post.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.coverImage} alt={post.title} className="w-full h-64 object-cover rounded-2xl mb-8" />
      )}
      <p className="text-[11px] text-neutral-500 font-mono mb-2">{(post.publishedAt ?? post.createdAt).toLocaleDateString()}</p>
      <h1 className="font-display text-3xl md:text-5xl text-white font-medium mb-6">{post.title}</h1>
      <div className="text-neutral-300 text-sm md:text-base leading-relaxed whitespace-pre-line">{post.content}</div>
    </article>
  );
}
