'use client';

import { useState } from 'react';
import { ShieldCheck, Check, ChevronRight } from 'lucide-react';
import type { InsurancePlan } from '@/lib/providers/insurance';
import { useBookingEnquiry } from '@/components/leads/BookingEnquiryContext';

export default function InsuranceSearch() {
  const { open } = useBookingEnquiry();
  const [plans, setPlans] = useState<InsurancePlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch('/api/insurance');
      setPlans(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const selectPlan = (plan: InsurancePlan) => {
    open({
      vertical: 'insurance',
      title: plan.name,
      subtitle: `${plan.tier} Travel Protection Scheme`,
      price: plan.price,
      date: 'Flexible',
      details: { planName: plan.name, tier: plan.tier, medicalCoverage: plan.medicalCoverage, tripCancellation: plan.tripCancellation, luggageCoverage: plan.luggageCoverage },
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" /> Calculate Secure Travel Protection
          </h3>
          <p className="text-xs text-neutral-400 max-w-xl">
            Aviation delays, medical issues, or baggage transfers can introduce risks to any itinerary. Protect your investment with our standard global protection tiers.
          </p>
        </div>
        <button onClick={handleSearch} className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3.5 px-8 rounded-xl cursor-pointer transition-colors shrink-0">
          View Protection Plans
        </button>
      </div>

      {hasSearched && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-16 bg-neutral-900/40 border border-neutral-800 rounded-2xl">
              <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-neutral-400 text-sm">Accessing insurance coverage underwriters...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((p) => (
                <div key={p.id} className="bg-neutral-900 border border-neutral-800 hover:border-emerald-500/30 rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow transition-colors">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] bg-neutral-950 text-neutral-400 border border-neutral-850 px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider">{p.tier} Tier</span>
                        <h4 className="text-base font-bold text-white mt-1.5">{p.name}</h4>
                      </div>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">{p.description}</p>
                    <ul className="space-y-2 text-xs pt-2">
                      <li className="flex items-center gap-2 text-neutral-300 font-medium">
                        <Check className="w-4 h-4 text-emerald-400" /> Medical Coverage: {p.medicalCoverage}
                      </li>
                      <li className="flex items-center gap-2 text-neutral-300 font-medium">
                        <Check className="w-4 h-4 text-emerald-400" /> Trip Delay / Interruption: {p.tripCancellation}
                      </li>
                      <li className="flex items-center gap-2 text-neutral-300 font-medium">
                        <Check className="w-4 h-4 text-emerald-400" /> Lost or Stolen Luggage: {p.luggageCoverage}
                      </li>
                    </ul>
                  </div>
                  <div className="border-t border-neutral-850 pt-4 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-neutral-500 font-semibold">Total Premium Cost</p>
                      <p className="text-xl font-extrabold text-white">${p.price}</p>
                    </div>
                    <button onClick={() => selectPlan(p)} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2.5 rounded-xl font-bold flex items-center gap-1 cursor-pointer transition-colors">
                      Enquire Now <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
