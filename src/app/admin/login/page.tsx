'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError('Incorrect password.');
        return;
      }
      router.push('/admin');
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-24 min-h-[70vh]">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl p-8 space-y-5 shadow-2xl">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-emerald-400" />
          <h1 className="text-lg font-bold text-white">Admin Access</h1>
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1">Password</label>
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        {error && <p className="text-red-400 text-xs">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl cursor-pointer transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Checking...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
