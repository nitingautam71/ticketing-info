import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Travel Guides & Stories',
  description: 'Destination guides, travel tips, and stories from the Ticketing-Info team.',
  alternates: { canonical: '/blog' },
};

export default async function BlogIndexPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <div className="flex-1 max-w-5xl w-full mx-auto px-4 md:px-8 pt-28 lg:pt-24 pb-16">
      <div className="mb-10">
        <p className="text-emerald-400 text-[10px] font-black tracking-[0.3em] uppercase mb-2">Travel Guides</p>
        <h1 className="font-display text-4xl md:text-5xl text-white font-medium">Stories from the road</h1>
      </div>

      {posts.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center text-neutral-400 text-sm">
          No posts published yet — check back soon.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {posts.map((p) => (
            <Link
              key={p.id}
              href={`/blog/${p.slug}`}
              className="bg-neutral-900 border border-neutral-800 hover:border-emerald-500/40 rounded-2xl p-6 transition-colors block"
            >
              <h2 className="text-lg font-bold text-white leading-snug">{p.title}</h2>
              {p.excerpt && <p className="text-sm text-neutral-400 mt-2 line-clamp-3">{p.excerpt}</p>}
              <p className="text-[11px] text-neutral-500 font-mono mt-3">
                {(p.publishedAt ?? p.createdAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
