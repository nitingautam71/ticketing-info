'use client';

import { useState } from 'react';
import { Search, User, ChevronRight } from 'lucide-react';
import type { Transfer } from '@/lib/providers/transfers';
import { useBookingEnquiry } from '@/components/leads/BookingEnquiryContext';

export default function TransferSearch() {
  const { open } = useBookingEnquiry();
  const [pickup, setPickup] = useState('London Heathrow (LHR)');
  const [dropoff, setDropoff] = useState('The Ritz-Carlton, London');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00 AM');
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch('/api/transfers');
      setTransfers(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const selectTransfer = (tf: Transfer) => {
    open({
      vertical: 'transfer',
      title: `${tf.type} Transfer Service`,
      subtitle: `${pickup} → ${dropoff}`,
      price: tf.price,
      date: date || 'Flexible',
      details: { type: tf.type, pickupLocation: pickup, dropoffLocation: dropoff, pickupDate: date, pickupTime: time },
    });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1">Pick-Up Airport/Station</label>
            <input type="text" value={pickup} onChange={(e) => setPickup(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1">Drop-Off Destination</label>
            <input type="text" value={dropoff} onChange={(e) => setDropoff(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1">Pick-Up Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1">Flight Arrival Time</label>
            <input type="text" value={time} onChange={(e) => setTime(e.target.value)} placeholder="e.g. 10:00 AM" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors">
            <Search className="w-4 h-4" /> Find Transfers
          </button>
        </div>
      </form>

      {hasSearched && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-16 bg-neutral-900/40 border border-neutral-800 rounded-2xl">
              <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-neutral-400 text-sm">Mapping city navigation corridors and driver assignments...</p>
            </div>
          ) : transfers.length === 0 ? (
            <div className="text-center py-12 bg-neutral-900 border border-neutral-800 rounded-2xl">
              <p className="text-neutral-400 text-sm">No transfer services found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transfers.map((tf) => (
                <div key={tf.id} className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] bg-neutral-950 text-neutral-400 border border-neutral-850 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">{tf.type}</span>
                      <span className="text-xs text-neutral-500 font-mono">ID: {tf.id}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white leading-tight">Private Transfer to Central Lodging</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed max-w-2xl">{tf.description}</p>
                    <div className="flex gap-4 text-[10px] text-neutral-500 font-medium">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" /> Accommodates {tf.capacity} guests
                      </span>
                      <span>• Estimated Duration: {tf.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 w-full md:w-auto border-t md:border-t-0 border-neutral-800 pt-4 md:pt-0 shrink-0 justify-between md:justify-start">
                    <div className="md:text-right">
                      <p className="text-[10px] text-neutral-500 font-semibold">Flat service fee</p>
                      <p className="text-lg font-black text-white">${tf.price}</p>
                    </div>
                    <button onClick={() => selectTransfer(tf)} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1 cursor-pointer transition-colors">
                      Book Ride <ChevronRight className="w-4 h-4" />
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
