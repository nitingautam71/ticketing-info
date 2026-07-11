'use client';

import { useState } from 'react';
import { Search, Plane, Calendar, ArrowUpDown, Filter, ChevronRight, User, AlertCircle, Briefcase, Plus, X, CheckCircle2 } from 'lucide-react';
import type { Flight, CabinClass } from '@/lib/providers/flights';
import { useBookingEnquiry } from '@/components/leads/BookingEnquiryContext';

const CABIN_CLASSES: CabinClass[] = ['Economy', 'Premium Economy', 'Business', 'First'];
const TRIP_TYPES = [
  { value: 'oneway', label: 'One Way' },
  { value: 'roundtrip', label: 'Round Trip' },
  { value: 'multicity', label: 'Multi-City' },
] as const;
type TripType = (typeof TRIP_TYPES)[number]['value'];

interface Leg {
  from: string;
  to: string;
  date: string;
}

interface LegResult {
  leg: Leg;
  label: string;
  flights: Flight[];
}

export default function FlightSearch() {
  const { open } = useBookingEnquiry();
  const [tripType, setTripType] = useState<TripType>('oneway');
  const [from, setFrom] = useState('JFK');
  const [to, setTo] = useState('LHR');
  const [date, setDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [extraLegs, setExtraLegs] = useState<Leg[]>([{ from: 'LHR', to: 'CDG', date: '' }]);
  const [cabinClass, setCabinClass] = useState<CabinClass>('Economy');
  const [passengerCount, setPassengerCount] = useState(1);

  const [legResults, setLegResults] = useState<LegResult[]>([]);
  const [selections, setSelections] = useState<(Flight | null)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [maxPrice, setMaxPrice] = useState(3000);
  const [stopsFilter, setStopsFilter] = useState('all');
  const [airlineFilter, setAirlineFilter] = useState('all');

  const swapAirports = () => {
    setFrom(to);
    setTo(from);
  };

  const addLeg = () => {
    setExtraLegs((prev) => [...prev, { from: prev[prev.length - 1]?.to || '', to: '', date: '' }]);
  };

  const removeLeg = (idx: number) => {
    setExtraLegs((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateLeg = (idx: number, patch: Partial<Leg>) => {
    setExtraLegs((prev) => prev.map((l, i) => (i === idx ? { ...l, ...patch } : l)));
  };

  const buildLegs = (): { leg: Leg; label: string }[] => {
    if (tripType === 'oneway') {
      return [{ leg: { from, to, date }, label: `${from} → ${to}` }];
    }
    if (tripType === 'roundtrip') {
      return [
        { leg: { from, to, date }, label: `Outbound: ${from} → ${to}` },
        { leg: { from: to, to: from, date: returnDate }, label: `Return: ${to} → ${from}` },
      ];
    }
    return [
      { leg: { from, to, date }, label: `Flight 1: ${from} → ${to}` },
      ...extraLegs.map((l, i) => ({ leg: l, label: `Flight ${i + 2}: ${l.from} → ${l.to}` })),
    ];
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setHasSearched(true);
    setSelections([]);
    try {
      const legs = buildLegs();
      const results = await Promise.all(
        legs.map(async ({ leg, label }) => {
          const res = await fetch(`/api/flights?from=${leg.from}&to=${leg.to}&date=${leg.date}&class=${cabinClass}`);
          if (!res.ok) throw new Error('API Fail');
          const flights: Flight[] = await res.json();
          return { leg, label, flights };
        }),
      );
      setLegResults(results);
      setSelections(new Array(results.length).fill(null));
    } catch (err) {
      console.error(err);
      setLegResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const selectFlightForLeg = (legIdx: number, flight: Flight) => {
    setSelections((prev) => prev.map((f, i) => (i === legIdx ? flight : f)));
  };

  const applyFilters = (flights: Flight[]) =>
    flights.filter((f) => {
      if (f.price > maxPrice) return false;
      if (stopsFilter === 'direct' && f.stops !== 0) return false;
      if (stopsFilter === '1stop' && f.stops !== 1) return false;
      if (airlineFilter !== 'all' && f.airline !== airlineFilter) return false;
      return true;
    });

  const airlinesList = Array.from(new Set(legResults.flatMap((r) => r.flights.map((f) => f.airline))));
  const allSelected = legResults.length > 0 && selections.length === legResults.length && selections.every(Boolean);
  const totalPrice = (selections.filter(Boolean) as Flight[]).reduce((sum, f) => sum + f.price, 0) * passengerCount;

  const proceedToBooking = () => {
    const chosen = selections as Flight[];
    if (chosen.some((f) => !f)) return;

    const routeSummary = legResults.map((r) => `${r.leg.from}→${r.leg.to}`).join(', ');
    const first = chosen[0];

    open({
      vertical: 'flight',
      title: legResults.length > 1 ? `Multi-leg trip: ${routeSummary}` : `${first.departureAirport} to ${first.arrivalAirport} (${first.airline})`,
      subtitle: legResults.length > 1 ? `${legResults.length} flights • ${first.class}` : `Flight ${first.flightNumber} • ${first.class}`,
      price: totalPrice,
      date: date || 'Flexible',
      details: {
        tripType,
        passengerCount,
        legs: legResults.map((r, i) => ({
          route: `${r.leg.from} to ${r.leg.to}`,
          date: r.leg.date || 'Flexible',
          airline: chosen[i].airline,
          flightNumber: chosen[i].flightNumber,
          departureTime: chosen[i].departureTime,
          arrivalTime: chosen[i].arrivalTime,
          price: chosen[i].price,
        })),
      },
    });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl space-y-4">
        <div className="flex bg-neutral-950 p-1 border border-neutral-800 rounded-xl w-full sm:w-fit">
          {TRIP_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTripType(t.value)}
              className={`flex-1 sm:flex-none text-xs px-4 py-2.5 rounded-lg font-medium transition-all cursor-pointer ${
                tripType === t.value ? 'bg-emerald-600 text-white shadow' : 'text-neutral-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-3 relative">
            <label className="block text-xs font-semibold text-neutral-400 mb-1">Departure City / Airport</label>
            <div className="relative">
              <input
                type="text"
                value={from}
                onChange={(e) => setFrom(e.target.value.toUpperCase())}
                placeholder="e.g. JFK"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-11 pr-4 py-3 text-white text-sm font-bold tracking-wider uppercase focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <Plane className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 rotate-45" />
            </div>
          </div>

          <div className="md:col-span-1 flex justify-center pt-5">
            <button
              type="button"
              onClick={swapAirports}
              className="p-3 bg-neutral-950 border border-neutral-800 rounded-full text-neutral-400 hover:text-white hover:border-emerald-500 transition-all cursor-pointer"
            >
              <ArrowUpDown className="w-4 h-4 md:rotate-90" />
            </button>
          </div>

          <div className="md:col-span-3 relative">
            <label className="block text-xs font-semibold text-neutral-400 mb-1">Arrival City / Airport</label>
            <div className="relative">
              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value.toUpperCase())}
                placeholder="e.g. LHR"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-11 pr-4 py-3 text-white text-sm font-bold tracking-wider uppercase focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <Plane className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 shrink-0" />
            </div>
          </div>

          <div className={tripType === 'roundtrip' ? 'md:col-span-2' : 'md:col-span-3'}>
            <label className="block text-xs font-semibold text-neutral-400 mb-1">{tripType === 'roundtrip' ? 'Depart' : 'Departure Date'}</label>
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            </div>
          </div>

          {tripType === 'roundtrip' && (
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-neutral-400 mb-1">Return</label>
              <div className="relative">
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              </div>
            </div>
          )}

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-neutral-400 mb-1">Passengers</label>
            <div className="relative">
              <input
                type="number"
                min={1}
                max={9}
                value={passengerCount}
                onChange={(e) => setPassengerCount(parseInt(e.target.value) || 1)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            </div>
          </div>
        </div>

        {tripType === 'multicity' && (
          <div className="space-y-3 pt-2 border-t border-neutral-800">
            <label className="block text-xs font-semibold text-neutral-400">Additional Flights</label>
            {extraLegs.map((leg, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <input
                  type="text"
                  value={leg.from}
                  onChange={(e) => updateLeg(idx, { from: e.target.value.toUpperCase() })}
                  placeholder="From"
                  className="md:col-span-3 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-sm font-bold tracking-wider uppercase focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <input
                  type="text"
                  value={leg.to}
                  onChange={(e) => updateLeg(idx, { to: e.target.value.toUpperCase() })}
                  placeholder="To"
                  className="md:col-span-3 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-sm font-bold tracking-wider uppercase focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <input
                  type="date"
                  value={leg.date}
                  onChange={(e) => updateLeg(idx, { date: e.target.value })}
                  className="md:col-span-4 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => removeLeg(idx)}
                  className="md:col-span-2 p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-400 hover:text-red-400 hover:border-red-500/40 transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold"
                >
                  <X className="w-4 h-4" /> Remove
                </button>
              </div>
            ))}
            {extraLegs.length < 4 && (
              <button
                type="button"
                onClick={addLeg}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Another Flight
              </button>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
          <div className="flex bg-neutral-950 p-1 border border-neutral-800 rounded-xl w-full sm:w-auto">
            {CABIN_CLASSES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCabinClass(c)}
                className={`flex-1 sm:flex-none text-xs px-4 py-2.5 rounded-lg font-medium transition-all cursor-pointer ${
                  cabinClass === c ? 'bg-emerald-600 text-white shadow' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold text-xs py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
          >
            <Search className="w-4 h-4" /> Search Flight Itineraries
          </button>
        </div>
      </form>

      {hasSearched && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl h-fit space-y-6">
            <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
              <Filter className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Search Filters</h4>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-neutral-400">Max Ticket Price</span>
                <span className="text-white">${maxPrice.toLocaleString()}</span>
              </div>
              <input type="range" min={200} max={5000} step={50} value={maxPrice} onChange={(e) => setMaxPrice(parseInt(e.target.value))} className="w-full accent-emerald-500" />
            </div>

            <div className="space-y-2">
              <h5 className="text-xs font-bold text-neutral-400 uppercase">Stops</h5>
              <div className="space-y-2 text-xs">
                {['all', 'direct', '1stop'].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer text-neutral-350 hover:text-white">
                    <input type="radio" name="stops" checked={stopsFilter === opt} onChange={() => setStopsFilter(opt)} className="accent-emerald-500" />
                    <span className="capitalize">{opt === 'all' ? 'Any Stops' : opt === 'direct' ? 'Non-Stop Only' : '1 Stop Only'}</span>
                  </label>
                ))}
              </div>
            </div>

            {airlinesList.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-neutral-400 uppercase">Airlines</h5>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-neutral-350 hover:text-white">
                    <input type="radio" name="airlines" checked={airlineFilter === 'all'} onChange={() => setAirlineFilter('all')} className="accent-emerald-500" />
                    <span>All Airlines</span>
                  </label>
                  {airlinesList.map((al) => (
                    <label key={al} className="flex items-center gap-2 cursor-pointer text-neutral-350 hover:text-white">
                      <input type="radio" name="airlines" checked={airlineFilter === al} onChange={() => setAirlineFilter(al)} className="accent-emerald-500" />
                      <span>{al}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-3 space-y-8">
            {isLoading ? (
              <div className="text-center py-16 bg-neutral-900/40 border border-neutral-800 rounded-2xl">
                <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-neutral-400 text-sm">Querying active flight paths and seating availability...</p>
              </div>
            ) : legResults.length === 0 ? (
              <div className="text-center py-16 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-2">
                <AlertCircle className="w-8 h-8 text-neutral-500 mx-auto" />
                <h5 className="text-sm font-bold text-white">No flights found</h5>
                <p className="text-neutral-400 text-xs">Try adjusting your route or dates.</p>
              </div>
            ) : (
              legResults.map((result, legIdx) => {
                const filtered = applyFilters(result.flights);
                const selected = selections[legIdx];
                return (
                  <div key={legIdx} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">{result.label}</h4>
                      {selected && (
                        <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                        </span>
                      )}
                    </div>

                    {filtered.length === 0 ? (
                      <div className="text-center py-10 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-1">
                        <p className="text-sm font-bold text-white">No flights match the filter criteria</p>
                        <p className="text-neutral-400 text-xs">Try increasing the budget or adjusting stop preferences.</p>
                      </div>
                    ) : (
                      filtered.map((f) => (
                        <div
                          key={f.id}
                          className={`bg-neutral-900 border rounded-2xl overflow-hidden shadow-md transition-all group ${
                            selected?.id === f.id ? 'border-emerald-500' : 'border-neutral-800 hover:border-neutral-700'
                          }`}
                        >
                          <div className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                            <div className="flex-1 space-y-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-neutral-950 rounded-xl flex items-center justify-center font-bold text-xs text-emerald-400 border border-neutral-800">
                                  {f.airlineLogo}
                                </div>
                                <div>
                                  <h4 className="text-sm font-bold text-white leading-none">{f.airline}</h4>
                                  <span className="text-[10px] text-neutral-500 font-mono">Flight {f.flightNumber} • {f.class}</span>
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-2 text-center max-w-md">
                                <div className="text-left">
                                  <p className="text-lg font-extrabold text-white leading-none tracking-tight">{f.departureTime}</p>
                                  <p className="text-xs text-neutral-400 font-bold mt-1 uppercase">{f.departureAirport}</p>
                                </div>
                                <div className="relative flex flex-col justify-center items-center">
                                  <span className="text-[10px] text-neutral-400 font-semibold">{f.duration}</span>
                                  <div className="w-full h-[2px] bg-neutral-800 relative my-1.5">
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-500" />
                                    {f.stops > 0 && <div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-orange-400" />}
                                  </div>
                                  <span className="text-[9px] text-neutral-500">{f.stops === 0 ? 'Nonstop' : `${f.stops} Stop (${f.stopoverAirports?.join(', ')})`}</span>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-extrabold text-white leading-none tracking-tight">{f.arrivalTime}</p>
                                  <p className="text-xs text-neutral-400 font-bold mt-1 uppercase">{f.arrivalAirport}</p>
                                </div>
                              </div>

                              <div className="flex gap-2 items-center text-[10px] text-neutral-400 font-medium">
                                <Briefcase className="w-3.5 h-3.5 text-neutral-500" />
                                <span>Included Baggage: {f.baggage}</span>
                              </div>
                            </div>

                            <div className="flex sm:flex-col justify-between items-end gap-3 w-full sm:w-auto border-t sm:border-t-0 border-neutral-800 pt-4 sm:pt-0 shrink-0">
                              <div className="sm:text-right">
                                <p className="text-[10px] text-neutral-500 font-semibold">Price per passenger</p>
                                <p className="text-2xl font-black text-white mt-0.5">${f.price.toLocaleString()}</p>
                              </div>
                              <button
                                onClick={() => selectFlightForLeg(legIdx, f)}
                                className={`font-bold text-xs px-5 py-3 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all ${
                                  selected?.id === f.id ? 'bg-emerald-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 group-hover:scale-[1.02] text-white'
                                }`}
                              >
                                {selected?.id === f.id ? 'Selected' : 'Select Flight'} <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                );
              })
            )}

            {allSelected && (
              <div className="sticky bottom-4 bg-neutral-900 border border-emerald-500/40 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
                <div>
                  <p className="text-xs text-neutral-400 font-semibold">
                    {legResults.length > 1 ? `${legResults.length} flights selected` : 'Flight selected'} • {passengerCount} passenger{passengerCount > 1 ? 's' : ''}
                  </p>
                  <p className="text-xl font-black text-white">Total: ${totalPrice.toLocaleString()}</p>
                </div>
                <button
                  onClick={proceedToBooking}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  Continue Booking <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
