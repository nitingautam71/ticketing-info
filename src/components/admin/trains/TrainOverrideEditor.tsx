'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Trash2 } from 'lucide-react';

const STATUSES = [
  { value: 'running', label: 'Running (clears the notice)' },
  { value: 'disrupted', label: 'Disrupted (amber banner)' },
  { value: 'suspended', label: 'Suspended (red banner, drops from “fastest/cheapest”)' },
];

export interface TrainOverrideRow {
  id: string;
  trainSlug: string;
  status: string;
  notes: string | null;
  updatedAt: string;
}

export default function TrainOverrideEditor({
  overrides,
  trains,
}: {
  overrides: TrainOverrideRow[];
  trains: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const [trainSlug, setTrainSlug] = useState(trains[0]?.slug ?? '');
  const [status, setStatus] = useState('disrupted');
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/trains', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trainSlug, status, notes: notes || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Save failed');
      setMessage('Status saved — live on search within a minute, on cached pages at next revalidation.');
      setNotes('');
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Remove this status notice and revert to the bundled timetable?')) return;
    await fetch('/api/admin/trains', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    router.refresh();
  };

  const nameFor = (slug: string) => trains.find((t) => t.slug === slug)?.name ?? slug;

  return (
    <div className="space-y-6">
      <form onSubmit={save} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white">Post a service status notice</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="tr-train" className="block text-xs font-semibold text-neutral-400 mb-1">Train</label>
            <select
              id="tr-train"
              value={trainSlug}
              onChange={(e) => setTrainSlug(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {trains.map((t) => (
                <option key={t.slug} value={t.slug}>{t.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="tr-status" className="block text-xs font-semibold text-neutral-400 mb-1">Status</label>
            <select
              id="tr-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="tr-notes" className="block text-xs font-semibold text-neutral-400 mb-1">
            Public note (shown on route and train pages — keep it factual)
          </label>
          <textarea
            id="tr-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={1000}
            rows={2}
            placeholder="e.g. Cancelled 12–18 Aug for track work between Albany and Buffalo; bus bridge in place."
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <p className="text-xs text-neutral-500">{message}</p>
          <button
            type="submit"
            disabled={busy || !trainSlug}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs py-3 px-6 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Save className="w-4 h-4" aria-hidden /> Save Status
          </button>
        </div>
      </form>

      <div className="space-y-3">
        <h2 className="text-sm font-bold text-white">Active notices ({overrides.length})</h2>
        {overrides.length === 0 ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center text-neutral-500 text-sm">
            No notices — every train is showing its bundled timetable as running.
          </div>
        ) : (
          overrides.map((o) => (
            <div key={o.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex items-start justify-between gap-4 flex-wrap">
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">
                  {nameFor(o.trainSlug)}{' '}
                  <span
                    className={`text-[10px] border px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ml-1 ${
                      o.status === 'suspended'
                        ? 'bg-red-950/60 text-red-300 border-red-900'
                        : o.status === 'disrupted'
                          ? 'bg-amber-950/60 text-amber-300 border-amber-900'
                          : 'bg-emerald-950/60 text-emerald-400 border-emerald-900'
                    }`}
                  >
                    {o.status}
                  </span>
                </p>
                {o.notes && <p className="text-xs text-neutral-400 leading-relaxed max-w-xl">{o.notes}</p>}
                <p className="text-[10px] text-neutral-600">Updated {new Date(o.updatedAt).toLocaleString()}</p>
              </div>
              <button
                onClick={() => remove(o.id)}
                aria-label={`Delete status notice for ${nameFor(o.trainSlug)}`}
                className="text-neutral-500 hover:text-red-400 transition-colors cursor-pointer p-2"
              >
                <Trash2 className="w-4 h-4" aria-hidden />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
