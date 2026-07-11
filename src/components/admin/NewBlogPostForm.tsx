'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function NewBlogPostForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, slug, excerpt, coverImage, content }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || 'Failed to create post');
      }
      setTitle('');
      setSlug('');
      setSlugTouched(false);
      setExcerpt('');
      setCoverImage('');
      setContent('');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
      <h2 className="text-sm font-bold text-white uppercase tracking-wider">New Blog Post</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          required
          placeholder="Title"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
        <input
          type="text"
          required
          placeholder="slug-in-kebab-case"
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugTouched(true);
          }}
          className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>
      <input
        type="text"
        placeholder="Excerpt (optional)"
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
      />
      <input
        type="text"
        placeholder="Cover image URL (optional)"
        value={coverImage}
        onChange={(e) => setCoverImage(e.target.value)}
        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
      />
      <textarea
        required
        rows={8}
        placeholder="Content (plain text, paragraph breaks are preserved)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-y"
      />
      {error && <p className="text-red-400 text-xs">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50"
      >
        <Plus className="w-4 h-4" /> {isSubmitting ? 'Saving...' : 'Save as Draft'}
      </button>
    </form>
  );
}
