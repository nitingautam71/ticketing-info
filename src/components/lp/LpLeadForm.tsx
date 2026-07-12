'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';
import type { BookingVertical } from '@/lib/types';

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;

function captureUtm(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) utm[key] = value;
  }
  return utm;
}

export default function LpLeadForm({
  vertical,
  theme,
  ctaLabel = 'Get My Free Quote',
}: {
  vertical: BookingVertical;
  theme: string;
  ctaLabel?: string;
}) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setError('Please share a phone number so we can call or WhatsApp you back.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vertical,
          contactMethod: 'form',
          source: 'google_ads',
          name,
          email,
          phone,
          message: details,
          sourcePage: typeof window !== 'undefined' ? window.location.pathname : undefined,
          payload: { theme, ...captureUtm() },
        }),
      });
      if (!res.ok) throw new Error('Failed to submit');
      // generate_lead + the Ads conversion fire on /lp/thank-you (not here) so the pixel
      // fires exactly once per lead, on a dedicated page load, not on every retry/re-render.
      router.push(`/lp/thank-you?theme=${encodeURIComponent(theme)}&vertical=${encodeURIComponent(vertical)}`);
    } catch {
      setError('Something went wrong. Please call or WhatsApp us directly instead.');
      setIsSubmitting(false);
    }
  };

  return (
    <form id="lead-form" onSubmit={handleSubmit} className="space-y-3.5" aria-label="Get a free quote">
      <div>
        <label className="block text-xs font-medium text-neutral-400 mb-1">Full Name</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-neutral-400 mb-1">Phone (for a quick call or WhatsApp)</label>
        <input
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+91 98765 43210"
          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-neutral-400 mb-1">Email (optional)</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-neutral-400 mb-1">Travel details</label>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={2}
          placeholder="Destination, dates, passengers..."
          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
        />
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] transition-all text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {isSubmitting ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <Send className="w-4 h-4" /> {ctaLabel}
          </>
        )}
      </button>
      <p className="text-[10px] text-neutral-500 text-center">No online payment. A consultant calls you back to confirm.</p>
    </form>
  );
}
