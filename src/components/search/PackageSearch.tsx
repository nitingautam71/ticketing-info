'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Search, MapPin, ChevronRight, Check, AlertCircle } from 'lucide-react';
import type { VacationPackage } from '@/lib/providers/packages';
import { useBookingEnquiry } from '@/components/leads/BookingEnquiryContext';

export default function PackageSearch() {
  const { open } = useBookingEnquiry();
  const [destination, setDestination] = useState('');
  const [packages, setPackages] = useState<VacationPackage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch(`/api/packages?destination=${encodeURIComponent(destination)}`);
      setPackages(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const selectPackage = (pkg: VacationPackage) => {
    open({
      vertical: 'package',
      title: pkg.name,
      subtitle: `${pkg.destination} • ${pkg.durationDays} Days, All-Inclusive`,
      price: pkg.price,
      date: 'Flexible',
      details: { destination: pkg.destination, durationDays: pkg.durationDays, includes: pkg.includes, highlights: pkg.highlights },
    });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-10 relative">
            <label className="block text-xs font-semibold text-neutral-400 mb-1">Where do you want an all-inclusive package?</label>
            <div className="relative">
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Santorini, Japan, Dubai — or leave blank to browse all"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            </div>
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-3.5 flex items-center justify-center gap-2 font-bold text-xs cursor-pointer transition-colors">
              <Search className="w-4 h-4" /> Search
            </button>
          </div>
        </div>
      </form>

      {hasSearched && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-16 bg-neutral-900/40 border border-neutral-800 rounded-2xl">
              <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-neutral-400 text-sm">Assembling flights, hotels, transfers, and tours into one package...</p>
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-16 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-2">
              <AlertCircle className="w-8 h-8 text-neutral-500 mx-auto" />
              <h5 className="text-sm font-bold text-white">No packages match that destination yet</h5>
              <p className="text-neutral-400 text-xs">Ask our AI planner or a consultant to build a custom package instead.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {packages.map((pkg) => (
                <div key={pkg.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-lg hover:border-neutral-700 transition-colors flex flex-col justify-between">
                  <div className="h-48 relative bg-neutral-950">
                    <Image src={pkg.image} alt={pkg.name} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover opacity-85" />
                    <div className="absolute top-4 left-4 bg-emerald-950/60 border border-emerald-900 px-2.5 py-0.5 rounded-full text-[10px] text-emerald-400 font-bold font-mono uppercase tracking-wider">
                      {pkg.durationDays} Days All-Inclusive
                    </div>
                  </div>
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h4 className="text-base font-bold text-white tracking-tight leading-snug">{pkg.name}</h4>
                      <p className="text-xs text-neutral-400 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {pkg.destination} • ★ {pkg.rating}
                      </p>
                      <ul className="space-y-1 pt-2">
                        {pkg.includes.slice(0, 4).map((inc) => (
                          <li key={inc} className="flex items-center gap-1.5 text-[11px] text-neutral-300 font-medium">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> {inc}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="border-t border-neutral-800/60 pt-4 flex justify-between items-center mt-4">
                      <div>
                        <p className="text-[10px] text-neutral-500 font-semibold">Per person, all-inclusive</p>
                        <p className="text-lg font-black text-white">${pkg.price.toLocaleString()}</p>
                      </div>
                      <button onClick={() => selectPackage(pkg)} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1 cursor-pointer transition-colors">
                        Enquire <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
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
