'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

export default function NewFaqForm() {
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, question, answer }),
      });
      if (!res.ok) throw new Error('Failed to create FAQ');
      setCategory('');
      setQuestion('');
      setAnswer('');
      router.refresh();
    } catch {
      setError('Failed to create FAQ.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
      <h2 className="text-sm font-bold text-white uppercase tracking-wider">Add FAQ</h2>
      <input
        type="text"
        placeholder="Category (optional)"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
      />
      <input
        type="text"
        required
        placeholder="Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
      />
      <textarea
        required
        rows={3}
        placeholder="Answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
      />
      {error && <p className="text-red-400 text-xs">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50"
      >
        <Plus className="w-4 h-4" /> {isSubmitting ? 'Adding...' : 'Add FAQ'}
      </button>
    </form>
  );
}
