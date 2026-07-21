'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Trash2 } from 'lucide-react';
import CountrySelect from '@/components/visas/CountrySelect';

const CATEGORIES = [
  { value: 'visa_free', label: 'Visa Free' },
  { value: 'visa_on_arrival', label: 'Visa on Arrival' },
  { value: 'e_visa', label: 'e-Visa' },
  { value: 'eta', label: 'ETA' },
  { value: 'visa_required', label: 'Visa Required' },
  { value: 'no_admission', label: 'No Admission' },
];

export interface OverrideRow {
  id: string;
  passportCode: string;
  destinationCode: string;
  category: string;
  allowedStayDays: number | null;
  notes: string | null;
  updatedAt: string;
}

export default function VisaOverrideEditor({ overrides }: { overrides: OverrideRow[] }) {
  const router = useRouter();
  const [passport, setPassport] = useState('');
  const [destination, setDestination] = useState('');
  const [category, setCategory] = useState('visa_required');
  const [stayDays, setStayDays] = useState('');
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/visas', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passportCode: passport,
          destinationCode: destination,
          category,
          allowedStayDays: stayDays ? Number(stayDays) : null,
          notes: notes || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Save failed');
      setMessage('Override saved — live within a minute.');
      setNotes('');
      setStayDays('');
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Remove this override and revert to the bundled rule?')) return;
    await fetch('/api/admin/visas', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={save} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white">Add / update a rule correction</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CountrySelect label="Passport" value={passport} onChange={setPassport} />
          <CountrySelect label="Destination" value={destination} onChange={setDestination} />
          <div>
            <label htmlFor="ov-category" className="block text-xs font-semibold text-neutral-400 mb-1">Category</label>
            <select
              id="ov-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="ov-stay" className="block text-xs font-semibold text-neutral-400 mb-1">Allowed stay (days, optional)</label>
            <input
              id="ov-stay"
              type="number"
              min={1}
              max={3650}
              value={stayDays}
              onChange={(e) => setStayDays(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>
        <div>
          <label htmlFor="ov-notes" className="block text-xs font-semibold text-neutral-400 mb-1">Public note (optional — shown on the result page)</label>
          <textarea
            id="ov-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={1000}
            rows={2}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <p className="text-xs text-neutral-500">{message}</p>
          <button
            type="submit"
            disabled={busy || !passport || !destination}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs py-3 px-6 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Save className="w-4 h-4" /> Save Override
          </button>
        </div>
      </form>

      <div className="space-y-3">
        <h2 className="text-sm font-bold text-white">Active overrides ({overrides.length})</h2>
        {overrides.length === 0 ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center text-neutral-500 text-sm">
            No corrections yet — the bundled dataset is serving all answers.
          </div>
        ) : (
          overrides.map((o) => (
            <div key={o.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex items-start justify-between gap-4 flex-wrap">
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">
                  {o.passportCode} → {o.destinationCode}{' '}
                  <span className="text-[10px] bg-neutral-950 text-emerald-400 border border-emerald-900/60 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ml-1">
                    {o.category.replace(/_/g, ' ')}
                  </span>
                  {o.allowedStayDays ? <span className="text-neutral-400 font-medium text-xs ml-2">{o.allowedStayDays} days</span> : null}
                </p>
                {o.notes && <p className="text-xs text-neutral-400 leading-relaxed max-w-xl">{o.notes}</p>}
                <p className="text-[10px] text-neutral-600">Updated {new Date(o.updatedAt).toLocaleString()}</p>
              </div>
              <button
                onClick={() => remove(o.id)}
                aria-label={`Delete override ${o.passportCode} to ${o.destinationCode}`}
                className="text-neutral-500 hover:text-red-400 transition-colors cursor-pointer p-2"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
