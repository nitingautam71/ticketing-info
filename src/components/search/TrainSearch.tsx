'use client';

import { useState } from 'react';
import { Search, Calendar, Clock, ChevronRight } from 'lucide-react';
import type { Train, TrainClass } from '@/lib/providers/trains';
import { useBookingEnquiry } from '@/components/leads/BookingEnquiryContext';

export default function TrainSearch() {
  const { open } = useBookingEnquiry();
  const [from, setFrom] = useState('Paris');
  const [to, setTo] = useState('London');
  const [date, setDate] = useState('');
  const [trains, setTrains] = useState<Train[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch(`/api/trains?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
      setTrains(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const selectClass = (train: Train, tClass: TrainClass) => {
    open({
      vertical: 'train',
      title: `${train.operator} High-Speed Train (${train.trainNumber})`,
      subtitle: `${train.departureStation} → ${train.arrivalStation} • ${tClass.name}`,
      price: tClass.price,
      date: date || 'Flexible',
      details: {
        operator: train.operator,
        trainNumber: train.trainNumber,
        departureStation: train.departureStation,
        arrivalStation: train.arrivalStation,
        departureTime: train.departureTime,
        arrivalTime: train.arrivalTime,
        class: tClass.name,
      },
    });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1">Departure Station</label>
            <input type="text" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="e.g. Paris" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1">Arrival Station</label>
            <input type="text" value={to} onChange={(e) => setTo(e.target.value)} placeholder="e.g. London" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1">Travel Date</label>
            <div className="relative">
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            </div>
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors">
            <Search className="w-4 h-4" /> Search Train Routes
          </button>
        </div>
      </form>

      {hasSearched && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-16 bg-neutral-900/40 border border-neutral-800 rounded-2xl">
              <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-neutral-400 text-sm">Synchronizing high-speed rail timetables and seat maps...</p>
            </div>
          ) : trains.length === 0 ? (
            <div className="text-center py-12 bg-neutral-900 border border-neutral-800 rounded-2xl">
              <p className="text-neutral-400 text-sm">No trains found for this route on the selected date.</p>
            </div>
          ) : (
            trains.map((train) => (
              <div key={train.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 md:p-6 space-y-4 shadow">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-neutral-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-neutral-950 border border-neutral-850 rounded-lg text-emerald-400 font-bold text-xs">TRAIN</div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{train.operator} • Train {train.trainNumber}</h4>
                      <p className="text-[10px] text-neutral-500 font-mono">ID: {train.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-450">
                    <Clock className="w-4 h-4" /> Transit Time: {train.duration}
                  </div>
                </div>

                <div className="flex justify-between items-center max-w-xl text-center py-2">
                  <div className="text-left space-y-1">
                    <p className="text-lg font-black text-white">{train.departureTime}</p>
                    <p className="text-xs text-neutral-400 leading-snug font-medium">{train.departureStation}</p>
                  </div>
                  <div className="relative flex flex-col justify-center items-center flex-1 mx-6">
                    <div className="w-full h-[1px] bg-neutral-800 relative">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-neutral-500" />
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-lg font-black text-white">{train.arrivalTime}</p>
                    <p className="text-xs text-neutral-400 leading-snug font-medium">{train.arrivalStation}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2.5">Choose Ticket Class</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {train.classes.map((cls) => (
                      <div key={cls.name} className="bg-neutral-950 border border-neutral-850 hover:border-emerald-500/20 p-4 rounded-xl flex justify-between items-center">
                        <div>
                          <p className="text-xs font-bold text-white">{cls.name}</p>
                          <p className="text-[10px] text-neutral-500 mt-0.5">Seat selection included</p>
                        </div>
                        <div className="text-right flex items-center gap-3">
                          <span className="text-sm font-black text-emerald-400">${cls.price}</span>
                          <button onClick={() => selectClass(train, cls)} className="p-1.5 bg-neutral-900 hover:bg-emerald-600 hover:text-white text-neutral-400 border border-neutral-800 rounded-lg cursor-pointer transition-colors">
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
