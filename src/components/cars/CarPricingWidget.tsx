'use client';

import { useState, useEffect } from 'react';
import { Globe, CalendarRange, Shield, Plus } from 'lucide-react';
import { useBookingEnquiry } from '@/components/leads/BookingEnquiryContext';
import type { CarListing, CarPricingBreakdown, RentalDurationTier } from '@/lib/cars/types';

const MARKETS = [
  { code: 'US', name: 'United States ($)' },
  { code: 'CA', name: 'Canada (C$)' },
  { code: 'GB', name: 'United Kingdom (£)' },
  { code: 'DE', name: 'Germany (€)' },
  { code: 'FR', name: 'France (€)' },
  { code: 'AU', name: 'Australia (A$)' },
  { code: 'IN', name: 'India (₹)' },
  { code: 'JP', name: 'Japan (¥)' },
  { code: 'SG', name: 'Singapore (S$)' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'CN', name: 'China (¥)' },
  { code: 'BR', name: 'Brazil (R$)' },
  { code: 'MX', name: 'Mexico' },
  { code: 'ZA', name: 'South Africa (R)' },
];

const TIERS: { code: RentalDurationTier; name: string; unitNote: string }[] = [
  { code: 'hourly', name: 'Hourly (4h block)', unitNote: '4 hours' },
  { code: 'halfDay', name: 'Half Day', unitNote: '1 day' },
  { code: 'daily', name: 'Daily', unitNote: '1 day' },
  { code: 'weekend', name: 'Weekend', unitNote: '3 days' },
  { code: 'weekly', name: 'Weekly', unitNote: '7 days' },
  { code: 'monthly', name: 'Monthly', unitNote: '30 days' },
  { code: 'longTerm', name: 'Long-Term Lease', unitNote: '90 days' },
];

const ADDONS: { key: keyof AddonState; label: string }[] = [
  { key: 'premiumInsurance', label: 'Premium insurance (CDW + roadside)' },
  { key: 'additionalDriver', label: 'Additional driver' },
  { key: 'oneWay', label: 'One-way (different drop-off)' },
  { key: 'gps', label: 'GPS unit' },
  { key: 'wifi', label: 'In-car Wi-Fi' },
  { key: 'childSeat', label: 'Child seat' },
  { key: 'fuelPackage', label: 'Prepaid fuel package' },
];

interface AddonState {
  premiumInsurance: boolean;
  additionalDriver: boolean;
  oneWay: boolean;
  gps: boolean;
  wifi: boolean;
  childSeat: boolean;
  fuelPackage: boolean;
}

const LINE_LABELS: { key: keyof CarPricingBreakdown['lineItems']; label: string; perDay?: boolean }[] = [
  { key: 'basePriceUSD', label: 'Base rental' },
  { key: 'airportFeeUSD', label: 'Airport concession fee' },
  { key: 'oneWayFeeUSD', label: 'One-way fee' },
  { key: 'basicInsuranceUSD', label: 'Basic insurance (included)' },
  { key: 'collisionDamageWaiverUSD', label: 'Collision damage waiver' },
  { key: 'roadsideAssistanceUSD', label: 'Roadside assistance' },
  { key: 'gpsAddonUSD', label: 'GPS unit' },
  { key: 'wifiAddonUSD', label: 'In-car Wi-Fi' },
  { key: 'childSeatAddonUSD', label: 'Child seat' },
  { key: 'fuelPackageUSD', label: 'Prepaid fuel' },
  { key: 'cleaningFeeUSD', label: 'Cleaning fee' },
  { key: 'taxesUSD', label: 'Taxes' },
  { key: 'otaServiceFeeUSD', label: 'Service fee' },
];

export default function CarPricingWidget({ listing, initialPricing }: { listing: CarListing; initialPricing: CarPricingBreakdown }) {
  const { open } = useBookingEnquiry();
  const [originMarket, setOriginMarket] = useState(initialPricing.originMarket);
  const [durationTier, setDurationTier] = useState<RentalDurationTier>(initialPricing.durationTier);
  const [addons, setAddons] = useState<AddonState>({
    premiumInsurance: false, additionalDriver: false, oneWay: false, gps: false, wifi: false, childSeat: false, fuelPackage: false,
  });
  const [pricing, setPricing] = useState<CarPricingBreakdown>(initialPricing);
  // Staleness is derived by comparing the inputs the current quote was computed for
  // against the current selections (no setState-in-effect): quoteKey is stamped in the
  // fetch callback when a fresh quote lands.
  const currentKey = JSON.stringify({ originMarket, durationTier, addons });
  const [quoteKey, setQuoteKey] = useState(JSON.stringify({ originMarket: initialPricing.originMarket, durationTier: initialPricing.durationTier, addons: { premiumInsurance: false, additionalDriver: false, oneWay: false, gps: false, wifi: false, childSeat: false, fuelPackage: false } }));
  const isStale = currentKey !== quoteKey;

  useEffect(() => {
    let cancelled = false;
    const key = JSON.stringify({ originMarket, durationTier, addons });
    fetch('/api/cars/pricing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: listing.slug, originMarket, durationTier, options: addons }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && !data.error) {
          setPricing(data);
          setQuoteKey(key);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [listing.slug, originMarket, durationTier, addons]);

  function toggleAddon(key: keyof AddonState) {
    setAddons((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function reserve() {
    const tier = TIERS.find((t) => t.code === durationTier)!;
    const selectedAddons = ADDONS.filter((a) => addons[a.key]).map((a) => a.label);
    open({
      vertical: 'car',
      title: `${listing.brand} ${listing.model} (${listing.companyName})`,
      subtitle: `${listing.category} • ${tier.name} • Pickup: ${listing.locationName}`,
      price: Math.round(pricing.discountedPriceUSD),
      date: 'Flexible',
      details: {
        listingSlug: listing.slug,
        company: listing.companyName,
        vehicle: `${listing.year} ${listing.brand} ${listing.model}`,
        category: listing.category,
        pickupLocation: listing.locationName,
        city: listing.city,
        country: listing.country,
        durationTier,
        billableUnits: `${pricing.units} ${durationTier === 'hourly' ? 'hours' : 'days'}`,
        originMarket,
        addons: selectedAddons,
        estimatedTotalUSD: pricing.discountedPriceUSD,
        estimatedTotalLocal: `${pricing.currency} ${pricing.discountedPriceLocal.toLocaleString()}`,
      },
    });
  }

  const nonZeroLines = LINE_LABELS.filter(({ key }) => pricing.lineItems[key] > 0);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-5">
      <div>
        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-50 flex items-center gap-2">
          <CalendarRange className="w-5 h-5 text-blue-600" />
          Build Your Rental Quote
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Pick a rental duration, your home market for currency, and any extras — the estimate updates instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <CalendarRange className="w-3.5 h-3.5 text-blue-500" /> Rental Duration
          </label>
          <select
            value={durationTier}
            onChange={(e) => setDurationTier(e.target.value as RentalDurationTier)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 py-2.5 px-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
          >
            {TIERS.map((t) => (
              <option key={t.code} value={t.code}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-blue-500" /> Your Home Market
          </label>
          <select
            value={originMarket}
            onChange={(e) => setOriginMarket(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 py-2.5 px-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
          >
            {MARKETS.map((m) => (
              <option key={m.code} value={m.code}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Add-ons */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Plus className="w-3.5 h-3.5 text-blue-500" /> Extras & Protection
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
          {ADDONS.map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={addons[key]}
                onChange={() => toggleAddon(key)}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-750 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-slate-600 dark:text-slate-350">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Quote breakdown */}
      <div className={`border-t border-slate-100 dark:border-slate-800 pt-4 space-y-1.5 transition-opacity ${isStale ? 'opacity-50' : ''}`}>
        <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
          {nonZeroLines.map(({ key, label }) => (
            <li key={key} className="flex justify-between">
              <span>{label}</span>
              <span>${pricing.lineItems[key].toLocaleString()}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between text-slate-400 text-xs line-through pt-2">
          <span>Suggested retail price</span>
          <span>${pricing.suggestedRetailPriceUSD.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-slate-900 dark:text-white text-2xl font-black">
          <span>Your price</span>
          <span>${pricing.discountedPriceUSD.toLocaleString()}</span>
        </div>
        <p className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          You save ${pricing.savingsUSD.toLocaleString()}
        </p>
        <p className="text-slate-400 text-[10px] leading-relaxed">
          Estimate for {pricing.units} {durationTier === 'hourly' ? 'hours' : 'days'} — approx. {pricing.currency}{' '}
          {pricing.discountedPriceLocal.toLocaleString()} in your currency. Final pricing confirmed by a consultant; all
          figures are estimates until a live rate source is connected.
        </p>
      </div>

      <button
        onClick={reserve}
        className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-sm transition-colors shadow-md cursor-pointer"
      >
        Reserve This Car
      </button>
      <p className="text-xs text-slate-500 flex items-start gap-2">
        <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
        No payment now — a consultant confirms availability, exact rates, and extras before anything is charged.
      </p>
    </div>
  );
}
