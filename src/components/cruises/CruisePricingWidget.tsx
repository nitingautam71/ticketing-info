'use client';

import { useState, useEffect } from 'react';
import { Globe, Users, Coins } from 'lucide-react';
import { useBookingEnquiry } from '@/components/leads/BookingEnquiryContext';
import CabinPricingTable from './CabinPricingTable';
import type { CruisePackage, CruisePricingBreakdown, CruiseTravelerType, CruisePricingTier, CabinType } from '@/lib/cruises/types';

const MARKETS = [
  { code: 'US', name: 'United States ($)' },
  { code: 'CA', name: 'Canada (C$)' },
  { code: 'GB', name: 'United Kingdom (£)' },
  { code: 'AU', name: 'Australia (A$)' },
  { code: 'IN', name: 'India (₹)' },
  { code: 'JP', name: 'Japan (¥)' },
  { code: 'SG', name: 'Singapore (S$)' },
  { code: 'KR', name: 'South Korea (₩)' },
  { code: 'CN', name: 'China (¥)' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'ZA', name: 'South Africa (R)' }
];

const TRAVELERS: { code: CruiseTravelerType; name: string }[] = [
  { code: 'solo', name: 'Solo' },
  { code: 'couple', name: 'Couple' },
  { code: 'family4', name: 'Family of 4' },
  { code: 'largeFamily', name: 'Large Family' },
  { code: 'group', name: 'Group Travel' },
  { code: 'senior', name: 'Senior Travelers' },
  { code: 'honeymoon', name: 'Honeymooners' },
  { code: 'luxuryTraveler', name: 'Luxury Connoisseurs' }
];

const TIERS: { code: CruisePricingTier; name: string }[] = [
  { code: 'budget', name: 'Budget Tier' },
  { code: 'midRange', name: 'Mid-range Tier' },
  { code: 'premium', name: 'Premium Tier' },
  { code: 'luxury', name: 'Luxury Tier' }
];

export default function CruisePricingWidget({ pkg, initialPricing }: { pkg: CruisePackage; initialPricing: CruisePricingBreakdown }) {
  const { open } = useBookingEnquiry();
  const [originMarket, setOriginMarket] = useState(initialPricing.originMarket);
  const [travelerType, setTravelerType] = useState<CruiseTravelerType>(initialPricing.travelerType);
  const [tier, setTier] = useState<CruisePricingTier>(initialPricing.tier);
  const [pricing, setPricing] = useState<CruisePricingBreakdown>(initialPricing);
  const [selectedCabin, setSelectedCabin] = useState<CabinType | undefined>(undefined);
  // Derived rather than a separate setState call: pricing is "stale" whenever it doesn't
  // match the currently selected origin/traveler/tier, covering both mount and every change.
  const loading = pricing.originMarket !== originMarket || pricing.travelerType !== travelerType || pricing.tier !== tier;

  useEffect(() => {
    let cancelled = false;
    fetch('/api/cruises/pricing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: pkg.slug, originMarket, travelerType, tier })
    })
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && !data.error) setPricing(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [pkg.slug, originMarket, travelerType, tier]);

  function handleSelectCabin(cabinType: CabinType, priceUSD: number) {
    setSelectedCabin(cabinType);
    open({
      vertical: 'cruise',
      title: `${pkg.title} - ${cabinType}`,
      subtitle: `${pkg.cruiseLineName} • ${pkg.shipName} • ${pkg.durationNights} Nights`,
      price: priceUSD,
      date: 'Flexible',
      details: {
        cruiseName: pkg.cruiseName,
        cruiseLine: pkg.cruiseLineName,
        shipName: pkg.shipName,
        departurePort: pkg.departurePortName,
        arrivalPort: pkg.arrivalPortName,
        durationNights: pkg.durationNights,
        cabinType,
        originMarket,
        travelerType,
        tier
      }
    });
  }

  return (
    <div className="space-y-8">
      {/* Pricing parameters modifier box */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 shadow-md space-y-6">
        <div>
          <h3 className="font-bold text-lg text-white flex items-center gap-2">
            <Coins className="w-5 h-5 text-blue-500" />
            Customize Estimate & Fares
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Configure origin markets, travelers, and dining tiers to dynamically recalculate stateroom fares.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Origin Market */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-blue-500" /> Departure Origin Market
            </label>
            <select
              value={originMarket}
              onChange={(e) => setOriginMarket(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 py-2.5 px-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-200"
            >
              {MARKETS.map((m) => (
                <option key={m.code} value={m.code}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Traveler Type */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-blue-500" /> Traveler Composition
            </label>
            <select
              value={travelerType}
              onChange={(e) => setTravelerType(e.target.value as CruiseTravelerType)}
              className="w-full bg-slate-950 border border-slate-800 py-2.5 px-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-200"
            >
              {TRAVELERS.map((t) => (
                <option key={t.code} value={t.code}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Pricing Tier */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-blue-500" /> Cruise Package Class
            </label>
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value as CruisePricingTier)}
              className="w-full bg-slate-950 border border-slate-800 py-2.5 px-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-200"
            >
              {TIERS.map((t) => (
                <option key={t.code} value={t.code}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Cabin Pricing Table */}
      {loading ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-24 shadow-sm text-center">
          <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm">Recalculating rates and tax breakdowns...</p>
        </div>
      ) : (
        <CabinPricingTable
          cabinPricing={pricing.cabinPricing}
          currency={pricing.currency}
          usdRate={pricing.usdRate}
          selectedCabin={selectedCabin}
          onSelectCabin={handleSelectCabin}
        />
      )}
    </div>
  );
}
