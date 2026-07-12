'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

const TRAVEL_TYPES: { value: string; label: string }[] = [
  { value: 'flight', label: 'Flight Tickets' },
  { value: 'train', label: 'Train Tickets' },
  { value: 'hotel', label: 'Hotel Booking' },
  { value: 'package', label: 'Tour Package' },
  { value: 'visa', label: 'Visa Assistance' },
  { value: 'cruise', label: 'Cruise' },
  { value: 'car', label: 'Car Rental' },
  { value: 'transfer', label: 'Airport Transfer' },
  { value: 'insurance', label: 'Travel Insurance' },
];

export default function QuoteForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [vertical, setVertical] = useState('flight');
  const [destination, setDestination] = useState('');
  const [travelDates, setTravelDates] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() && !email.trim()) {
      setError('Please provide a phone number or email so we can reach you.');
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
          source: 'website',
          name,
          email,
          phone,
          message,
          sourcePage: typeof window !== 'undefined' ? window.location.pathname : undefined,
          payload: { destination, travelDates },
        }),
      });
      if (!res.ok) throw new Error('Failed to submit quote request');
      trackEvent('generate_lead', { method: 'quote_form', vertical });
      router.push('/thank-you?type=quote');
    } catch {
      setError('Something went wrong submitting your request. Please call or WhatsApp us directly instead.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1">Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 555 000 0000"
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@example.com"
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1">Travel Type</label>
          <select
            value={vertical}
            onChange={(e) => setVertical(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {TRAVEL_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1">Destination</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g. Delhi to Dubai"
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1">Travel Dates</label>
          <input
            type="text"
            value={travelDates}
            onChange={(e) => setTravelDates(e.target.value)}
            placeholder="e.g. 12 Aug – 20 Aug 2026"
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-neutral-400 mb-1">Anything else we should know?</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          placeholder="Passenger count, budget, preferred airline, special requests..."
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
            <Send className="w-4 h-4" /> Get My Free Quote
          </>
        )}
      </button>
      <p className="text-[10px] text-neutral-500 text-center">No payment is taken online. A travel consultant will contact you shortly.</p>
    </form>
  );
}
