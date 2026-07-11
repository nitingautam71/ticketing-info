'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

export default function TestimonialActions({ id, published }: { id: string; published: boolean }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const togglePublished = async () => {
    setIsSaving(true);
    try {
      await fetch(`/api/admin/testimonials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !published }),
      });
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async () => {
    if (!confirm('Delete this testimonial?')) return;
    setIsSaving(true);
    try {
      await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={togglePublished}
        disabled={isSaving}
        className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase cursor-pointer disabled:opacity-50 ${
          published ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900' : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
        }`}
      >
        {published ? 'Published' : 'Draft'}
      </button>
      <button onClick={remove} disabled={isSaving} className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-950/20 transition-colors cursor-pointer disabled:opacity-50">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
