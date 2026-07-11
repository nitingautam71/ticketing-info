'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Search, Car, Calendar, User, Settings, ChevronRight } from 'lucide-react';
import type { RentalCar } from '@/lib/providers/cars';
import { useBookingEnquiry } from '@/components/leads/BookingEnquiryContext';

export default function CarSearch() {
  const { open } = useBookingEnquiry();
  const [pickup, setPickup] = useState('London Heathrow Airport');
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [cars, setCars] = useState<RentalCar[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch('/api/cars');
      setCars(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const selectCar = (car: RentalCar) => {
    const days = 4;
    open({
      vertical: 'car',
      title: `${car.model} (${car.provider})`,
      subtitle: `${car.category} Car • Pick-Up: ${pickup}`,
      price: car.pricePerDay * days,
      date: pickupDate || 'Flexible',
      details: {
        provider: car.provider,
        model: car.model,
        category: car.category,
        pickupLocation: pickup,
        pickupDate,
        dropoffDate,
        pricePerDay: car.pricePerDay,
        days,
      },
    });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5 relative">
            <label className="block text-xs font-semibold text-neutral-400 mb-1">Pick-Up Station</label>
            <div className="relative">
              <input type="text" value={pickup} onChange={(e) => setPickup(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
              <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            </div>
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-neutral-400 mb-1">Pick-Up Date</label>
            <div className="relative">
              <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            </div>
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-neutral-400 mb-1">Drop-Off Date</label>
            <div className="relative">
              <input type="date" value={dropoffDate} onChange={(e) => setDropoffDate(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            </div>
          </div>
          <div className="md:col-span-1">
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-3.5 flex items-center justify-center cursor-pointer transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>

      {hasSearched && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-16 bg-neutral-900/40 border border-neutral-800 rounded-2xl">
              <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-neutral-400 text-sm">Querying rental car pools and vehicle fleet status...</p>
            </div>
          ) : cars.length === 0 ? (
            <div className="text-center py-12 bg-neutral-900 border border-neutral-800 rounded-2xl">
              <p className="text-neutral-400 text-sm">No vehicles found at this location.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cars.map((car) => (
                <div key={car.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-lg hover:border-neutral-700 transition-all flex flex-col justify-between">
                  <div className="h-44 relative bg-neutral-950">
                    <Image src={car.image} alt={car.model} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover opacity-85" />
                  </div>
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] bg-neutral-950 text-neutral-400 border border-neutral-850 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          {car.provider} Official Fleet
                        </span>
                        <div className="flex items-center gap-1 text-xs text-neutral-400 font-bold">★ {car.rating}</div>
                      </div>
                      <h4 className="text-base font-bold text-white leading-snug">{car.model}</h4>
                      <div className="flex gap-4 text-xs text-neutral-500">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" /> {car.seats} Seats
                        </span>
                        <span className="flex items-center gap-1">
                          <Settings className="w-3.5 h-3.5" /> {car.transmission}
                        </span>
                        <span>• {car.category}</span>
                      </div>
                    </div>
                    <div className="border-t border-neutral-800/60 pt-4 flex justify-between items-center mt-4">
                      <div>
                        <p className="text-[10px] text-neutral-500 font-semibold">Price per day</p>
                        <p className="text-lg font-black text-white">${car.pricePerDay}</p>
                      </div>
                      <button onClick={() => selectCar(car)} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1 cursor-pointer transition-colors">
                        Reserve Car <ChevronRight className="w-4 h-4" />
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
