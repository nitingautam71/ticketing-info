'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

export default function NewTestimonialForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [quote, setQuote] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, location, quote, rating }),
      });
      if (!res.ok) throw new Error('Failed to create testimonial');
      setName('');
      setLocation('');
      setQuote('');
      setRating(5);
      router.refresh();
    } catch {
      setError('Failed to create testimonial.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
      <h2 className="text-sm font-bold text-white uppercase tracking-wider">Add Testimonial</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          required
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
        <input
          type="text"
          placeholder="Location (optional)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>
      <textarea
        required
        rows={3}
        placeholder="Quote"
        value={quote}
        onChange={(e) => setQuote(e.target.value)}
        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
      />
      <div className="flex items-center gap-3">
        <label className="text-xs font-semibold text-neutral-400">Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
          className="bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1.5 text-xs text-white"
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} star{r !== 1 ? 's' : ''}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50"
      >
        <Plus className="w-4 h-4" /> {isSubmitting ? 'Adding...' : 'Add Testimonial'}
      </button>
    </form>
  );
}
