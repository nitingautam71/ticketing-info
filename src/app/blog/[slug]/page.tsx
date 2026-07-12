import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import JsonLd from '@/components/seo/JsonLd';
import { articleJsonLd, breadcrumbJsonLd } from '@/lib/structuredData';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || !post.published) return {};

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt ?? undefined,
      publishedTime: (post.publishedAt ?? post.createdAt).toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });

  if (!post || !post.published) notFound();

  return (
    <article className="flex-1 max-w-3xl w-full mx-auto px-4 md:px-8 pt-28 lg:pt-24 pb-16">
      <JsonLd data={articleJsonLd(post)} />
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }, { name: post.title, path: `/blog/${post.slug}` }])} />
      <nav className="text-[11px] text-neutral-500 font-mono mb-4">
        <Link href="/" className="hover:text-neutral-300">Home</Link> / <Link href="/blog" className="hover:text-neutral-300">Blog</Link>
      </nav>
      {post.coverImage && (
        <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-8">
          <Image src={post.coverImage} alt={post.title} fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" priority />
        </div>
      )}
      <p className="text-[11px] text-neutral-500 font-mono mb-2">{(post.publishedAt ?? post.createdAt).toLocaleDateString()}</p>
      <h1 className="font-display text-3xl md:text-5xl text-white font-medium mb-6">{post.title}</h1>
      <div className="text-neutral-300 text-sm md:text-base leading-relaxed whitespace-pre-line">{post.content}</div>
    </article>
  );
}
