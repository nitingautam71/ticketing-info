'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FilePlus2, Plus } from 'lucide-react';

const POLICY_STATUSES = ['quote_requested', 'awaiting_payment', 'active', 'expired', 'cancelled'] as const;
const CLAIM_STATUSES = ['draft', 'submitted_to_insurer', 'in_review', 'info_requested', 'approved', 'paid', 'rejected', 'closed'] as const;
const CLAIM_TYPES = ['medical', 'trip_cancellation', 'trip_interruption', 'baggage', 'delay', 'passport_loss', 'other'] as const;

export interface ClaimRow {
  id: string;
  displayId: string;
  status: string;
  claimType: string;
  amountClaimed: number | null;
  amountApproved: number | null;
  currency: string;
  insurerRef: string | null;
}

export interface PolicyRow {
  id: string;
  displayId: string;
  status: string;
  providerName: string;
  planName: string;
  policyNumber: string | null;
  premium: number | null;
  currency: string;
  startDate: string | null;
  endDate: string | null;
  travellers: number;
  customerName: string | null;
  claims: ClaimRow[];
}

/** Consultant-facing policy & claim tracker: record purchases, move statuses,
 * open claim files and log insurer progress. */
export default function PolicyManager({ policies, planOptions }: { policies: PolicyRow[]; planOptions: { id: string; label: string }[] }) {
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const [providerName, setProviderName] = useState('');
  const [planName, setPlanName] = useState('');
  const [premium, setPremium] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'INR'>('USD');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');

  const createPolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/insurance/policies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerName,
          planName,
          premium: premium ? Number(premium) : undefined,
          currency,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          policyNumber: policyNumber || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Create failed');
      setMessage(`Policy ${data.displayId} created.`);
      setShowCreate(false);
      setProviderName('');
      setPlanName('');
      setPremium('');
      setPolicyNumber('');
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Create failed');
    } finally {
      setBusy(false);
    }
  };

  const updatePolicyStatus = async (id: string, status: string) => {
    await fetch('/api/admin/insurance/policies', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    router.refresh();
  };

  const openClaim = async (policyId: string) => {
    const claimType = prompt(`Claim type (${CLAIM_TYPES.join(', ')}):`, 'medical');
    if (!claimType) return;
    const res = await fetch('/api/admin/insurance/claims', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ policyId, claimType }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      alert(data?.error ?? 'Failed to open claim');
      return;
    }
    router.refresh();
  };

  const updateClaimStatus = async (id: string, status: string) => {
    await fetch('/api/admin/insurance/claims', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-sm font-bold text-white">Policies &amp; claims ({policies.length})</h2>
        <div className="flex items-center gap-3">
          <p className="text-xs text-neutral-500">{message}</p>
          <button
            onClick={() => setShowCreate((s) => !s)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" /> Record policy
          </button>
        </div>
      </div>

      {showCreate && (
        <form onSubmit={createPolicy} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="pol-provider" className="block text-xs font-semibold text-neutral-400 mb-1">Insurer</label>
              <input id="pol-provider" value={providerName} onChange={(e) => setProviderName(e.target.value)} required maxLength={120}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
            </div>
            <div>
              <label htmlFor="pol-plan" className="block text-xs font-semibold text-neutral-400 mb-1">Plan name</label>
              <input id="pol-plan" value={planName} onChange={(e) => setPlanName(e.target.value)} required maxLength={160} list="pol-plan-options"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
              <datalist id="pol-plan-options">
                {planOptions.map((p) => (
                  <option key={p.id} value={p.label} />
                ))}
              </datalist>
            </div>
            <div>
              <label htmlFor="pol-number" className="block text-xs font-semibold text-neutral-400 mb-1">Policy number (optional)</label>
              <input id="pol-number" value={policyNumber} onChange={(e) => setPolicyNumber(e.target.value)} maxLength={80}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
            </div>
            <div>
              <label htmlFor="pol-premium" className="block text-xs font-semibold text-neutral-400 mb-1">Premium</label>
              <div className="flex gap-2">
                <input id="pol-premium" type="number" min={0} step="0.01" value={premium} onChange={(e) => setPremium(e.target.value)}
                  className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                <select aria-label="Currency" value={currency} onChange={(e) => setCurrency(e.target.value as 'USD' | 'INR')}
                  className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-3 text-white text-sm focus:outline-none">
                  <option value="USD">USD</option>
                  <option value="INR">INR</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="pol-start" className="block text-xs font-semibold text-neutral-400 mb-1">Start date</label>
              <input id="pol-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 [color-scheme:dark]" />
            </div>
            <div>
              <label htmlFor="pol-end" className="block text-xs font-semibold text-neutral-400 mb-1">End date</label>
              <input id="pol-end" type="date" value={endDate} min={startDate} onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 [color-scheme:dark]" />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={busy || !providerName || !planName}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs py-3 px-6 rounded-xl cursor-pointer transition-colors">
              Save Policy
            </button>
          </div>
        </form>
      )}

      {policies.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center text-neutral-500 text-sm">
          No policies recorded yet — record one when a customer buys through the desk.
        </div>
      ) : (
        policies.map((p) => (
          <div key={p.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="space-y-1 min-w-0">
                <p className="text-sm font-bold text-white">
                  <span className="font-mono text-emerald-400 text-xs mr-2">{p.displayId}</span>
                  {p.planName}
                </p>
                <p className="text-xs text-neutral-400">
                  {p.providerName}
                  {p.policyNumber ? ` · #${p.policyNumber}` : ''} · {p.travellers} traveller{p.travellers > 1 ? 's' : ''}
                  {p.premium ? ` · ${p.currency === 'INR' ? '₹' : '$'}${p.premium.toLocaleString()}` : ''}
                  {p.startDate ? ` · ${p.startDate.slice(0, 10)} → ${p.endDate?.slice(0, 10) ?? '—'}` : ''}
                  {p.customerName ? ` · ${p.customerName}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  aria-label={`Status for ${p.displayId}`}
                  value={p.status}
                  onChange={(e) => updatePolicyStatus(p.id, e.target.value)}
                  className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                >
                  {POLICY_STATUSES.map((s) => (
                    <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                  ))}
                </select>
                <button
                  onClick={() => openClaim(p.id)}
                  className="text-[11px] font-bold text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded-xl px-3 py-2 cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <FilePlus2 className="w-3.5 h-3.5" /> Open claim
                </button>
              </div>
            </div>

            {p.claims.length > 0 && (
              <div className="border-t border-neutral-850 pt-3 space-y-2">
                {p.claims.map((c) => (
                  <div key={c.id} className="flex items-center justify-between gap-3 flex-wrap bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-2.5">
                    <p className="text-xs text-neutral-300">
                      <span className="font-mono text-emerald-400 mr-2">{c.displayId}</span>
                      {c.claimType.replace(/_/g, ' ')}
                      {c.amountClaimed ? ` · claimed ${c.currency === 'INR' ? '₹' : '$'}${c.amountClaimed.toLocaleString()}` : ''}
                      {c.amountApproved ? ` · approved ${c.currency === 'INR' ? '₹' : '$'}${c.amountApproved.toLocaleString()}` : ''}
                      {c.insurerRef ? ` · insurer ref ${c.insurerRef}` : ''}
                    </p>
                    <select
                      aria-label={`Status for claim ${c.displayId}`}
                      value={c.status}
                      onChange={(e) => updateClaimStatus(c.id, e.target.value)}
                      className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-white text-[11px] focus:outline-none"
                    >
                      {CLAIM_STATUSES.map((s) => (
                        <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
