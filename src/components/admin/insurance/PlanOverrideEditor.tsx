'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Trash2 } from 'lucide-react';

export interface PlanOption {
  id: string;
  label: string;
}

export interface InsuranceOverrideRow {
  id: string;
  planId: string;
  active: boolean;
  premiumMultiplier: number | null;
  notes: string | null;
  updatedAt: string;
}

/** Adjust a catalog plan: pull it from quotes, scale its estimate, or attach a
 * public note. Changes go live on the quote engine within a minute. */
export default function PlanOverrideEditor({ plans, overrides }: { plans: PlanOption[]; overrides: InsuranceOverrideRow[] }) {
  const router = useRouter();
  const [planId, setPlanId] = useState(plans[0]?.id ?? '');
  const [active, setActive] = useState(true);
  const [multiplier, setMultiplier] = useState('');
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const planLabel = (id: string) => plans.find((p) => p.id === id)?.label ?? id;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/insurance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          active,
          premiumMultiplier: multiplier ? Number(multiplier) : null,
          notes: notes || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Save failed');
      setMessage('Override saved — live within a minute.');
      setNotes('');
      setMultiplier('');
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Remove this override and revert to catalog defaults?')) return;
    await fetch('/api/admin/insurance', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={save} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white">Adjust a catalog plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="ins-ov-plan" className="block text-xs font-semibold text-neutral-400 mb-1">Plan</label>
            <select
              id="ins-ov-plan"
              value={planId}
              onChange={(e) => setPlanId(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {plans.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="ins-ov-mult" className="block text-xs font-semibold text-neutral-400 mb-1">Premium multiplier (optional)</label>
            <input
              id="ins-ov-mult"
              type="number"
              step="0.05"
              min={0.2}
              max={5}
              placeholder="e.g. 1.15"
              value={multiplier}
              onChange={(e) => setMultiplier(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>
        <div>
          <label htmlFor="ins-ov-notes" className="block text-xs font-semibold text-neutral-400 mb-1">Public note (optional — shown on quote cards)</label>
          <textarea
            id="ins-ov-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={1000}
            rows={2}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="accent-emerald-500 w-4 h-4" />
            Plan is active (uncheck to hide from all quotes)
          </label>
          <div className="flex items-center gap-3">
            <p className="text-xs text-neutral-500">{message}</p>
            <button
              type="submit"
              disabled={busy || !planId}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs py-3 px-6 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Save className="w-4 h-4" /> Save Override
            </button>
          </div>
        </div>
      </form>

      <div className="space-y-3">
        <h2 className="text-sm font-bold text-white">Active overrides ({overrides.length})</h2>
        {overrides.length === 0 ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center text-neutral-500 text-sm">
            No adjustments yet — the bundled catalog is serving all quotes.
          </div>
        ) : (
          overrides.map((o) => (
            <div key={o.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex items-start justify-between gap-4 flex-wrap">
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">
                  {planLabel(o.planId)}{' '}
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ml-1 border ${
                      o.active ? 'bg-neutral-950 text-emerald-400 border-emerald-900/60' : 'bg-red-950/40 text-red-400 border-red-900/60'
                    }`}
                  >
                    {o.active ? 'active' : 'hidden'}
                  </span>
                  {o.premiumMultiplier ? <span className="text-neutral-400 font-medium text-xs ml-2">× {o.premiumMultiplier}</span> : null}
                </p>
                {o.notes && <p className="text-xs text-neutral-400 leading-relaxed max-w-xl">{o.notes}</p>}
                <p className="text-[10px] text-neutral-600">Updated {new Date(o.updatedAt).toLocaleString()}</p>
              </div>
              <button
                onClick={() => remove(o.id)}
                aria-label={`Delete override for ${planLabel(o.planId)}`}
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
