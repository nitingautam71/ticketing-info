'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

export default function NewSettingForm() {
  const router = useRouter();
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || 'Failed to save setting');
      }
      setKey('');
      setValue('');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save setting.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
      <h2 className="text-sm font-bold text-white uppercase tracking-wider">Add / Update Setting</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          required
          placeholder="Key (e.g. homepage_banner_text)"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
        <input
          type="text"
          required
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50"
      >
        <Plus className="w-4 h-4" /> {isSubmitting ? 'Saving...' : 'Save Setting'}
      </button>
    </form>
  );
}
