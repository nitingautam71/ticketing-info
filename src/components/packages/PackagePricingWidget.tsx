'use client';

import { useEffect, useState } from 'react';
import { useBookingEnquiry } from '@/components/leads/BookingEnquiryContext';
import { ORIGIN_MARKETS } from '@/lib/packages/markets';
import { TIER_LABELS, TRAVELER_LABELS } from '@/lib/packages/types';
import type { PricingBreakdown, PricingTier, TravelerType, TravelPackage } from '@/lib/packages/types';

const TRAVELER_TYPES: TravelerType[] = ['solo', 'couple', 'family4', 'group8'];
const TIERS: PricingTier[] = ['budget', 'midRange', 'premium', 'luxury'];

const LINE_ITEMS: { key: keyof PricingBreakdown['costUSD']; label: string }[] = [
  { key: 'airfare', label: 'Round-trip airfare' },
  { key: 'hotel', label: 'Hotel' },
  { key: 'transfers', label: 'Airport transfers' },
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'dailyTransport', label: 'Daily transport' },
  { key: 'tours', label: 'Tours' },
  { key: 'activities', label: 'Activities' },
];

export default function PackagePricingWidget({ pkg }: { pkg: TravelPackage }) {
  const { open } = useBookingEnquiry();
  const [origin, setOrigin] = useState('US');
  const [travelerType, setTravelerType] = useState<TravelerType>('couple');
  const [tier, setTier] = useState<PricingTier>('midRange');
  const [pricing, setPricing] = useState<PricingBreakdown | null>(null);
  // Derived rather than a separate setState call at the top of the effect: pricing is
  // "stale" whenever it doesn't match the currently selected origin/traveler/tier, which
  // covers both the initial load and every subsequent selection change.
  const loading = !pricing || pricing.originMarket !== origin || pricing.travelerType !== travelerType || pricing.tier !== tier;

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/packages/${pkg.slug}?origin=${origin}&travelerType=${travelerType}&tier=${tier}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setPricing(data.pricing ?? null);
      })
      .catch(() => {
        if (!cancelled) setPricing(null);
      });
    return () => {
      cancelled = true;
    };
  }, [pkg.slug, origin, travelerType, tier]);

  const enquire = () => {
    if (!pricing) return;
    open({
      vertical: 'package',
      title: pkg.title,
      subtitle: `${pkg.destinationName} • ${pkg.durationDays} Days • ${TRAVELER_LABELS[travelerType]} • ${TIER_LABELS[tier]}`,
      price: pricing.discountedPriceUSD,
      date: 'Flexible',
      details: { destinationSlug: pkg.destinationSlug, durationDays: pkg.durationDays, origin, travelerType, tier, pricing },
    });
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-5">
      <div className="grid grid-cols-1 gap-3">
        <label className="text-xs text-neutral-400 space-y-1 block">
          <span className="font-semibold">Flying from</span>
          <select value={origin} onChange={(e) => setOrigin(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm">
            {ORIGIN_MARKETS.map((m) => (
              <option key={m.code} value={m.code}>
                {m.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-neutral-400 space-y-1 block">
          <span className="font-semibold">Travelers</span>
          <select value={travelerType} onChange={(e) => setTravelerType(e.target.value as TravelerType)} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm">
            {TRAVELER_TYPES.map((t) => (
              <option key={t} value={t}>
                {TRAVELER_LABELS[t]}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-neutral-400 space-y-1 block">
          <span className="font-semibold">Package tier</span>
          <select value={tier} onChange={(e) => setTier(e.target.value as PricingTier)} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm">
            {TIERS.map((t) => (
              <option key={t} value={t}>
                {TIER_LABELS[t]}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading || !pricing ? (
        <div className="h-24 flex items-center justify-center text-neutral-500 text-xs">Calculating estimated pricing...</div>
      ) : (
        <div className="space-y-4">
          <ul className="text-xs text-neutral-400 space-y-1.5">
            {LINE_ITEMS.map(({ key, label }) => (
              <li key={key} className="flex justify-between">
                <span>{label}</span>
                <span>${pricing.costUSD[key].toLocaleString()}</span>
              </li>
            ))}
            <li className="flex justify-between">
              <span>Taxes & fees</span>
              <span>${pricing.taxesAndFeesUSD.toLocaleString()}</span>
            </li>
            <li className="flex justify-between">
              <span>OTA service fee</span>
              <span>${pricing.otaServiceFeeUSD.toLocaleString()}</span>
            </li>
          </ul>

          <div className="border-t border-neutral-800 pt-4 space-y-1">
            <div className="flex justify-between text-neutral-500 text-xs line-through">
              <span>Suggested retail price</span>
              <span>${pricing.suggestedRetailPriceUSD.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-white text-2xl font-black">
              <span>Your price</span>
              <span>${pricing.discountedPriceUSD.toLocaleString()}</span>
            </div>
            <p className="text-emerald-400 text-xs font-semibold">
              You save ${pricing.savingsUSD.toLocaleString()} ({Math.round(pricing.discountPct * 100)}%)
            </p>
            <p className="text-neutral-600 text-[10px] leading-relaxed">
              Estimate — {pricing.distanceKm.toLocaleString()} km, ~{pricing.flightHoursEstimate}h flight, {pricing.partySize} traveler{pricing.partySize > 1 ? 's' : ''}. Approx. {pricing.currency}{' '}
              {pricing.discountedPriceLocal.toLocaleString()}. Final pricing confirmed by a consultant.
            </p>
          </div>

          <button onClick={enquire} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm py-3.5 rounded-xl transition-colors cursor-pointer">
            Enquire About This Package
          </button>
        </div>
      )}
    </div>
  );
}
