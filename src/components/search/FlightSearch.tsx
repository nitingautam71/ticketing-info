'use client';

import { useState } from 'react';
import { Search, ArrowUpDown, ChevronRight, AlertCircle, Plus, X, CheckCircle2 } from 'lucide-react';
import type { Flight, CabinClass } from '@/lib/providers/flights';
import { useBookingEnquiry } from '@/components/leads/BookingEnquiryContext';
import AirportAutocomplete from './AirportAutocomplete';
import TravelerClassPicker from './TravelerClassPicker';
import DatePicker from './DatePicker';
import FlightFilters from './FlightFilters';
import FlightResultCard from './FlightResultCard';
import { sortFlights, toggleSetValue, parseDurationMinutes, getDepartureBucket, type SortMode, type DepartureBucket } from '@/lib/flightDisplay';

const TRIP_TYPES = [
  { value: 'oneway', label: 'One Way' },
  { value: 'roundtrip', label: 'Round Trip' },
  { value: 'multicity', label: 'Multi-City' },
] as const;
type TripType = (typeof TRIP_TYPES)[number]['value'];

const SORT_TABS: { value: SortMode; label: string; hint: string }[] = [
  { value: 'best', label: 'Best', hint: 'Ranked on price and convenience' },
  { value: 'cheapest', label: 'Cheapest', hint: 'Lowest price first' },
  { value: 'fastest', label: 'Fastest', hint: 'Shortest duration first' },
];

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

interface Bounds {
  min: number;
  max: number;
}

function computeBounds(flights: Flight[]): { price: Bounds; duration: Bounds } {
  if (flights.length === 0) return { price: { min: 0, max: 5000 }, duration: { min: 0, max: 24 * 60 } };
  const prices = flights.map((f) => f.price);
  const durations = flights.map((f) => parseDurationMinutes(f.duration));
  return {
    price: { min: Math.min(...prices), max: Math.max(...prices) },
    duration: { min: Math.min(...durations), max: Math.max(...durations) },
  };
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

  const [sortMode, setSortMode] = useState<SortMode>('best');
  const [maxPrice, setMaxPrice] = useState(5000);
  const [maxDurationMinutes, setMaxDurationMinutes] = useState(24 * 60);
  const [selectedStops, setSelectedStops] = useState<Set<number>>(new Set());
  const [selectedAirlines, setSelectedAirlines] = useState<Set<string>>(new Set());
  const [selectedBuckets, setSelectedBuckets] = useState<Set<DepartureBucket>>(new Set());

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
          const res = await fetch(`/api/flights?from=${leg.from}&to=${leg.to}&date=${leg.date}&class=${cabinClass}&adults=${passengerCount}`);
          if (!res.ok) throw new Error('API Fail');
          const flights: Flight[] = await res.json();
          return { leg, label, flights };
        }),
      );
      setLegResults(results);
      setSelections(new Array(results.length).fill(null));

      const bounds = computeBounds(results.flatMap((r) => r.flights));
      setSortMode('best');
      setMaxPrice(bounds.price.max);
      setMaxDurationMinutes(bounds.duration.max);
      setSelectedStops(new Set());
      setSelectedAirlines(new Set());
      setSelectedBuckets(new Set());
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
      if (parseDurationMinutes(f.duration) > maxDurationMinutes) return false;
      if (selectedStops.size > 0 && !selectedStops.has(Math.min(f.stops, 2))) return false;
      if (selectedAirlines.size > 0 && !selectedAirlines.has(f.airline)) return false;
      if (selectedBuckets.size > 0 && !selectedBuckets.has(getDepartureBucket(f.departureTime))) return false;
      return true;
    });

  const allFlights = legResults.flatMap((r) => r.flights);
  const airlinesList = Array.from(new Set(allFlights.map((f) => f.airline))).sort();
  const bounds = computeBounds(allFlights);
  const allSelected = legResults.length > 0 && selections.length === legResults.length && selections.every(Boolean);
  const totalPrice = (selections.filter(Boolean) as Flight[]).reduce((sum, f) => sum + f.price, 0) * passengerCount;

  const resetFilters = () => {
    setMaxPrice(bounds.price.max);
    setMaxDurationMinutes(bounds.duration.max);
    setSelectedStops(new Set());
    setSelectedAirlines(new Set());
    setSelectedBuckets(new Set());
  };

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
          <div className="md:col-span-3">
            <AirportAutocomplete label="Departure City / Airport" value={from} onChange={setFrom} placeholder="e.g. JFK or London" />
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

          <div className="md:col-span-3">
            <AirportAutocomplete label="Arrival City / Airport" value={to} onChange={setTo} placeholder="e.g. LHR or Tokyo" rotateIcon={false} />
          </div>

          <div className="md:col-span-2">
            {tripType === 'roundtrip' ? (
              <DatePicker range label="Dates" startValue={date} endValue={returnDate} onChangeStart={setDate} onChangeEnd={setReturnDate} />
            ) : (
              <DatePicker label="Departure Date" startValue={date} onChangeStart={setDate} />
            )}
          </div>

          <div className="md:col-span-3">
            <TravelerClassPicker travelers={passengerCount} onTravelersChange={setPassengerCount} cabinClass={cabinClass} onCabinClassChange={setCabinClass} />
          </div>
        </div>

        {tripType === 'multicity' && (
          <div className="space-y-3 pt-2 border-t border-neutral-800">
            <label className="block text-xs font-semibold text-neutral-400">Additional Flights</label>
            {extraLegs.map((leg, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <AirportAutocomplete compact containerClassName="md:col-span-3" value={leg.from} onChange={(code) => updateLeg(idx, { from: code })} placeholder="From" />
                <AirportAutocomplete compact containerClassName="md:col-span-3" value={leg.to} onChange={(code) => updateLeg(idx, { to: code })} placeholder="To" />
                <DatePicker
                  compact
                  containerClassName="md:col-span-4"
                  startValue={leg.date}
                  onChangeStart={(d) => updateLeg(idx, { date: d })}
                  minDate={idx === 0 ? date : extraLegs[idx - 1]?.date}
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

        <div className="flex justify-end pt-2">
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
          <FlightFilters
            maxPrice={maxPrice}
            onMaxPriceChange={setMaxPrice}
            priceBounds={bounds.price}
            selectedStops={selectedStops}
            onToggleStop={(stop) => setSelectedStops((prev) => toggleSetValue(prev, stop))}
            airlines={airlinesList}
            selectedAirlines={selectedAirlines}
            onToggleAirline={(airline) => setSelectedAirlines((prev) => toggleSetValue(prev, airline))}
            selectedBuckets={selectedBuckets}
            onToggleBucket={(bucket) => setSelectedBuckets((prev) => toggleSetValue(prev, bucket))}
            maxDurationMinutes={maxDurationMinutes}
            onMaxDurationChange={setMaxDurationMinutes}
            durationBounds={bounds.duration}
            onReset={resetFilters}
          />

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
              <>
                {allFlights.length > 0 && (
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex bg-neutral-950 p-1 border border-neutral-800 rounded-xl">
                      {SORT_TABS.map((tab) => (
                        <button
                          key={tab.value}
                          type="button"
                          onClick={() => setSortMode(tab.value)}
                          className={`text-xs px-4 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                            sortMode === tab.value ? 'bg-emerald-600 text-white shadow' : 'text-neutral-400 hover:text-white'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                    <span className="text-[11px] text-neutral-500 italic">{SORT_TABS.find((t) => t.value === sortMode)?.hint}</span>
                  </div>
                )}

                {legResults.map((result, legIdx) => {
                  const filtered = sortFlights(applyFilters(result.flights), sortMode);
                  const selected = selections[legIdx];
                  const showGrouping = sortMode === 'best' && filtered.length > 3;
                  const topPicks = showGrouping ? filtered.slice(0, 3) : filtered;
                  const rest = showGrouping ? filtered.slice(3) : [];

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
                        <>
                          {showGrouping && <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wide">Top picks</p>}
                          <div className="space-y-4">
                            {topPicks.map((f) => (
                              <FlightResultCard key={f.id} flight={f} isSelected={selected?.id === f.id} onSelect={() => selectFlightForLeg(legIdx, f)} />
                            ))}
                          </div>
                          {showGrouping && rest.length > 0 && (
                            <>
                              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wide pt-2 border-t border-neutral-800">More flights</p>
                              <div className="space-y-4">
                                {rest.map((f) => (
                                  <FlightResultCard key={f.id} flight={f} isSelected={selected?.id === f.id} onSelect={() => selectFlightForLeg(legIdx, f)} />
                                ))}
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </>
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
