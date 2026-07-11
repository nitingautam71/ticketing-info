import { prisma } from '@/lib/db';
import NewBlogPostForm from '@/components/admin/NewBlogPostForm';
import BlogPostActions from '@/components/admin/BlogPostActions';

export const dynamic = 'force-dynamic';

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Blog</h1>
        <p className="text-sm text-neutral-400 mt-1">Published posts appear at /blog.</p>
      </div>

      <NewBlogPostForm />

      <div className="space-y-3">
        {posts.length === 0 ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center text-neutral-500 text-sm">No posts yet.</div>
        ) : (
          posts.map((p) => (
            <div key={p.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
              <div className="flex justify-between items-start gap-4 flex-wrap">
                <div>
                  <p className="text-sm font-bold text-white">{p.title}</p>
                  <p className="text-[11px] text-neutral-500 font-mono mt-0.5">/blog/{p.slug}</p>
                  {p.excerpt && <p className="text-xs text-neutral-400 mt-1.5">{p.excerpt}</p>}
                </div>
                <BlogPostActions id={p.id} published={p.published} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
