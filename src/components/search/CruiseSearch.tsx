'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Anchor, ChevronRight } from 'lucide-react';
import type { Cruise, CruiseCabin } from '@/lib/providers/cruises';
import { useBookingEnquiry } from '@/components/leads/BookingEnquiryContext';

export default function CruiseSearch() {
  const { open } = useBookingEnquiry();
  const [cruises, setCruises] = useState<Cruise[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedCruise, setSelectedCruise] = useState<Cruise | null>(null);

  const handleSearch = async () => {
    setIsLoading(true);
    setHasSearched(true);
    setSelectedCruise(null);
    try {
      const res = await fetch('/api/cruises');
      setCruises(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const selectCabin = (cruise: Cruise, cabin: CruiseCabin) => {
    open({
      vertical: 'cruise',
      title: `${cruise.name} - ${cabin.type}`,
      subtitle: `${cruise.cruiseLine} • ${cruise.durationDays} Days Sailing`,
      price: cabin.price,
      date: 'Flexible',
      details: {
        cruiseName: cruise.name,
        cruiseLine: cruise.cruiseLine,
        departurePort: cruise.departurePort,
        durationDays: cruise.durationDays,
        cabinType: cabin.type,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Anchor className="w-5 h-5 text-emerald-400" /> Explore Royal Cruise Expeditions
          </h3>
          <p className="text-xs text-neutral-400 max-w-xl">
            Settle in for world-class luxury at sea. Discover exotic routes across the Mediterranean, Bahamas, Alaska, and the Caribbean.
          </p>
        </div>
        <button onClick={handleSearch} className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3.5 px-8 rounded-xl cursor-pointer transition-colors shrink-0">
          View Luxury Cruise Routes
        </button>
      </div>

      {hasSearched && (
        <div className="space-y-6">
          {selectedCruise && (
            <button onClick={() => setSelectedCruise(null)} className="text-emerald-400 hover:text-emerald-350 text-xs font-medium flex items-center gap-1 cursor-pointer">
              ← Back to Cruise Packages
            </button>
          )}

          {isLoading ? (
            <div className="text-center py-16 bg-neutral-900/40 border border-neutral-800 rounded-2xl">
              <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-neutral-400 text-sm">Mapping ocean routes and cabin deck availability...</p>
            </div>
          ) : selectedCruise ? (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-5 p-6 md:p-8 space-y-6 border-r border-neutral-800">
                <div>
                  <span className="text-[10px] bg-emerald-950/40 text-emerald-400 border border-emerald-900 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                    {selectedCruise.durationDays} Days Sailing
                  </span>
                  <h3 className="text-xl font-bold text-white mt-3">{selectedCruise.name}</h3>
                  <p className="text-xs text-neutral-400 mt-1">{selectedCruise.cruiseLine} Line • Departs {selectedCruise.departurePort}</p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-neutral-800 pb-2">Day-by-Day Itinerary</h4>
                  <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                    {selectedCruise.itinerary.map((it) => (
                      <div key={it.day} className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center text-[10px] font-mono text-emerald-400 shrink-0 font-bold mt-0.5">
                          {it.day}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{it.port}</p>
                          <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">{it.activities}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 p-6 md:p-8 space-y-6">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Select Cabin & Deck Level</h4>
                <div className="space-y-4">
                  {selectedCruise.cabins.map((cabin) => (
                    <div key={cabin.type} className="bg-neutral-950 border border-neutral-850 p-5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-emerald-500/30 transition-colors">
                      <div className="space-y-1 flex-1">
                        <h5 className="text-xs font-bold text-white uppercase tracking-wider">{cabin.type}</h5>
                        <p className="text-xs text-neutral-400 leading-relaxed">{cabin.description}</p>
                      </div>
                      <div className="flex items-center gap-5 w-full sm:w-auto border-t sm:border-t-0 border-neutral-850 pt-3 sm:pt-0 shrink-0 justify-between sm:justify-start">
                        <div className="text-right">
                          <p className="text-[10px] text-neutral-500 font-semibold">All-inclusive Rate</p>
                          <p className="text-base font-extrabold text-white">${cabin.price.toLocaleString()}</p>
                        </div>
                        <button onClick={() => selectCabin(selectedCruise, cabin)} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2.5 rounded-lg font-bold flex items-center cursor-pointer transition-colors">
                          Reserve <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cruises.map((c) => (
                <div key={c.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-lg hover:border-neutral-700 transition-colors flex flex-col justify-between">
                  <div className="h-48 relative bg-neutral-950">
                    <Image src={c.image} alt={c.name} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover opacity-85" />
                    <div className="absolute top-4 left-4 bg-emerald-950/60 border border-emerald-900 px-2.5 py-0.5 rounded-full text-[10px] text-emerald-400 font-bold font-mono uppercase tracking-wider">
                      {c.durationDays} Days Sailing
                    </div>
                  </div>
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <h4 className="text-base font-bold text-white tracking-tight leading-snug">{c.name}</h4>
                      <p className="text-xs text-neutral-400">{c.cruiseLine} Cruises • Departs {c.departurePort}</p>
                      <div className="flex gap-2 pt-2 text-[11px] text-neutral-500 items-center font-medium">
                        <span>★ {c.rating} Rated</span>
                        <span>•</span>
                        <span>{c.itinerary.length} ports of call</span>
                      </div>
                    </div>
                    <div className="border-t border-neutral-800/60 pt-4 flex justify-between items-center mt-4">
                      <div>
                        <p className="text-[10px] text-neutral-500 font-semibold">Cabins starting from</p>
                        <p className="text-lg font-black text-white">${c.price.toLocaleString()}</p>
                      </div>
                      <button onClick={() => setSelectedCruise(c)} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1 cursor-pointer transition-colors">
                        Explore Cabins & Plan <ChevronRight className="w-4 h-4" />
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
