'use client';

import { useState } from 'react';
import { Search, ArrowUpDown, ChevronRight, AlertCircle, Plus, X, CheckCircle2, Info, RefreshCw } from 'lucide-react';
import type { Flight, CabinClass } from '@/lib/providers/flights';
import { useBookingEnquiry } from '@/components/leads/BookingEnquiryContext';
import { trackEvent } from '@/lib/analytics';
import AirportAutocomplete from './AirportAutocomplete';
import TravelerClassPicker, { totalTravelers, type TravelerCounts } from './TravelerClassPicker';
import DatePicker from './DatePicker';
import FlightFilters from './FlightFilters';
import FlightResultCard from './FlightResultCard';
import { sortFlights, toggleSetValue, computeBadges, parseDurationMinutes, getDepartureBucket, type SortMode, type DepartureBucket } from '@/lib/flightDisplay';

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

interface FilterSnapshot {
  sortMode: SortMode;
  maxPrice: number;
  maxDurationMinutes: number;
  selectedStops: Set<number>;
  selectedAirlines: Set<string>;
  selectedBuckets: Set<DepartureBucket>;
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

function freshFilters(flights: Flight[]): FilterSnapshot {
  const bounds = computeBounds(flights);
  return {
    sortMode: 'best',
    maxPrice: bounds.price.max,
    maxDurationMinutes: bounds.duration.max,
    selectedStops: new Set(),
    selectedAirlines: new Set(),
    selectedBuckets: new Set(),
  };
}

function ResultSkeleton() {
  return (
    <div className="space-y-4" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 animate-pulse">
          <div className="flex justify-between items-center gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-neutral-800" />
                <div className="space-y-2">
                  <div className="h-3 w-28 bg-neutral-800 rounded" />
                  <div className="h-2 w-20 bg-neutral-800 rounded" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 max-w-md">
                <div className="h-5 bg-neutral-800 rounded" />
                <div className="h-5 bg-neutral-800 rounded" />
                <div className="h-5 bg-neutral-800 rounded" />
              </div>
            </div>
            <div className="hidden sm:flex flex-col items-end gap-3">
              <div className="h-6 w-20 bg-neutral-800 rounded" />
              <div className="h-9 w-28 bg-neutral-800 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface FlightSearchProps {
  /** Pre-fill the origin/destination — used by the programmatic route pages. */
  initialFrom?: string;
  initialTo?: string;
}

export default function FlightSearch({ initialFrom = 'JFK', initialTo = 'LHR' }: FlightSearchProps = {}) {
  const { open } = useBookingEnquiry();
  const [tripType, setTripType] = useState<TripType>('oneway');
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [date, setDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [extraLegs, setExtraLegs] = useState<Leg[]>([{ from: 'LHR', to: 'CDG', date: '' }]);
  const [cabinClass, setCabinClass] = useState<CabinClass>('Economy');
  const [counts, setCounts] = useState<TravelerCounts>({ adults: 1, children: 0, infants: 0 });

  const [legResults, setLegResults] = useState<LegResult[]>([]);
  const [selections, setSelections] = useState<(Flight | null)[]>([]);
  const [activeLegIndex, setActiveLegIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [sortMode, setSortMode] = useState<SortMode>('best');
  const [maxPrice, setMaxPrice] = useState(5000);
  const [maxDurationMinutes, setMaxDurationMinutes] = useState(24 * 60);
  const [selectedStops, setSelectedStops] = useState<Set<number>>(new Set());
  const [selectedAirlines, setSelectedAirlines] = useState<Set<string>>(new Set());
  const [selectedBuckets, setSelectedBuckets] = useState<Set<DepartureBucket>>(new Set());

  const travelers = totalTravelers(counts);

  const applyFilterSnapshot = (snapshot: FilterSnapshot) => {
    setSortMode(snapshot.sortMode);
    setMaxPrice(snapshot.maxPrice);
    setMaxDurationMinutes(snapshot.maxDurationMinutes);
    setSelectedStops(snapshot.selectedStops);
    setSelectedAirlines(snapshot.selectedAirlines);
    setSelectedBuckets(snapshot.selectedBuckets);
  };

  const stepLabel = (idx: number): string => {
    if (tripType === 'roundtrip') return idx === 0 ? 'Departing flight' : 'Returning flight';
    if (tripType === 'multicity') return `Flight ${idx + 1}`;
    return '';
  };

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
        { leg: { from, to, date }, label: `${from} → ${to}` },
        { leg: { from: to, to: from, date: returnDate }, label: `${to} → ${from}` },
      ];
    }
    return [
      { leg: { from, to, date }, label: `${from} → ${to}` },
      ...extraLegs.map((l) => ({ leg: l, label: `${l.from} → ${l.to}` })),
    ];
  };

  const runSearch = async () => {
    const legs = buildLegs();

    // Guardrail: every leg needs a distinct, non-empty origin and destination.
    const invalid = legs.some(
      ({ leg }) => !leg.from.trim() || !leg.to.trim() || leg.from.trim().toUpperCase() === leg.to.trim().toUpperCase(),
    );
    if (invalid) {
      setValidationError('Each flight needs a different departure and arrival airport.');
      return;
    }
    setValidationError(null);

    setIsLoading(true);
    setHasSearched(true);
    setSearchError(null);
    setSelections([]);
    setActiveLegIndex(0);

    trackEvent('flight_search', {
      trip_type: tripType,
      from,
      to,
      cabin: cabinClass,
      adults: counts.adults,
      children: counts.children,
      infants: counts.infants,
      legs: legs.length,
    });

    try {
      const results = await Promise.all(
        legs.map(async ({ leg, label }) => {
          const params = new URLSearchParams({
            from: leg.from,
            to: leg.to,
            date: leg.date,
            class: cabinClass,
            adults: String(counts.adults),
            children: String(counts.children),
            infants: String(counts.infants),
          });
          const res = await fetch(`/api/flights?${params.toString()}`);
          if (res.status === 429) throw new Error('RATE_LIMIT');
          if (!res.ok) throw new Error('PROVIDER_ERROR');
          const flights: Flight[] = await res.json();
          return { leg, label, flights: Array.isArray(flights) ? flights : [] };
        }),
      );
      setLegResults(results);
      setSelections(new Array(results.length).fill(null));
      applyFilterSnapshot(freshFilters(results[0]?.flights ?? []));
      trackEvent('view_search_results', {
        trip_type: tripType,
        from,
        to,
        results: results.reduce((n, r) => n + r.flights.length, 0),
      });
    } catch (err) {
      console.error(err);
      setLegResults([]);
      setSearchError(
        err instanceof Error && err.message === 'RATE_LIMIT'
          ? 'You’ve run a lot of searches in a short time. Please wait a moment and try again.'
          : 'We couldn’t reach the fare service just now. Please try again — or call/WhatsApp us and a consultant will quote you directly.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    void runSearch();
  };

  const selectFlightForLeg = (legIdx: number, flight: Flight) => {
    trackEvent('select_flight', {
      leg: legIdx,
      airline: flight.airline,
      price: flight.price,
      stops: flight.stops,
      trip_type: tripType,
    });
    setSelections((prev) => prev.map((f, i) => (i === legIdx ? flight : f)));
    const nextIdx = legIdx + 1;
    setActiveLegIndex((prev) => Math.max(prev, nextIdx));
    if (legResults[nextIdx]) applyFilterSnapshot(freshFilters(legResults[nextIdx].flights));
  };

  const reopenLeg = (idx: number) => {
    setSelections((prev) => prev.map((f, i) => (i >= idx ? null : f)));
    setActiveLegIndex(idx);
    if (legResults[idx]) applyFilterSnapshot(freshFilters(legResults[idx].flights));
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

  const activeResult = legResults[activeLegIndex];
  const activeFlights = activeResult?.flights ?? [];
  const airlinesList = Array.from(new Set(activeFlights.map((f) => f.airline))).sort();
  const bounds = computeBounds(activeFlights);
  const badgeMap = computeBadges(activeFlights);
  const allSelected = legResults.length > 0 && selections.length === legResults.length && selections.every(Boolean);
  const totalPrice = (selections.filter(Boolean) as Flight[]).reduce((sum, f) => sum + f.price, 0);
  const isMultiLeg = legResults.length > 1;

  const resetFilters = () => applyFilterSnapshot(freshFilters(activeFlights));

  const proceedToBooking = () => {
    const chosen = selections as Flight[];
    if (chosen.some((f) => !f)) return;

    const routeSummary = legResults.map((r) => `${r.leg.from}→${r.leg.to}`).join(', ');
    const first = chosen[0];

    trackEvent('flight_proceed_booking', { trip_type: tripType, legs: legResults.length, total_price: totalPrice, travelers });

    open({
      vertical: 'flight',
      title: legResults.length > 1 ? `Multi-leg trip: ${routeSummary}` : `${first.departureAirport} to ${first.arrivalAirport} (${first.airline})`,
      subtitle: legResults.length > 1 ? `${legResults.length} flights • ${first.class}` : `Flight ${first.flightNumber} • ${first.class}`,
      price: totalPrice,
      date: date || 'Flexible',
      details: {
        tripType,
        travelers,
        adults: counts.adults,
        children: counts.children,
        infants: counts.infants,
        cabinClass,
        ...(legResults.length > 1 ? { pricingNote: 'Per-direction estimates; consultant confirms combined fare.' } : {}),
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
              aria-label="Swap departure and arrival airports"
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
            <TravelerClassPicker counts={counts} onCountsChange={setCounts} cabinClass={cabinClass} onCabinClassChange={setCabinClass} />
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

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
          {validationError ? (
            <p className="text-red-400 text-xs flex items-center gap-1.5 order-2 sm:order-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {validationError}
            </p>
          ) : (
            <span className="order-2 sm:order-1" />
          )}
          <button
            type="submit"
            className="order-1 sm:order-2 w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold text-xs py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
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

          <div className="lg:col-span-3 space-y-6">
            {isLoading ? (
              <ResultSkeleton />
            ) : searchError ? (
              <div className="text-center py-14 bg-neutral-900 border border-red-500/30 rounded-2xl space-y-3">
                <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
                <h5 className="text-sm font-bold text-white">Search couldn’t complete</h5>
                <p className="text-neutral-400 text-xs max-w-md mx-auto">{searchError}</p>
                <button
                  type="button"
                  onClick={() => void runSearch()}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Try again
                </button>
              </div>
            ) : legResults.length === 0 ? (
              <div className="text-center py-16 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-2">
                <AlertCircle className="w-8 h-8 text-neutral-500 mx-auto" />
                <h5 className="text-sm font-bold text-white">No flights found</h5>
                <p className="text-neutral-400 text-xs">Try adjusting your route or dates.</p>
              </div>
            ) : (
              <>
                {isMultiLeg && (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wide shrink-0">
                      Step {Math.min(activeLegIndex + 1, legResults.length)} of {legResults.length}
                    </span>
                    <div className="flex gap-1.5">
                      {legResults.map((_, i) => (
                        <div key={i} className={`h-1.5 w-8 rounded-full ${i < activeLegIndex ? 'bg-emerald-500' : i === activeLegIndex ? 'bg-emerald-500/40' : 'bg-neutral-800'}`} />
                      ))}
                    </div>
                  </div>
                )}

                {legResults.slice(0, activeLegIndex).map((result, i) => {
                  const sel = selections[i];
                  if (!sel) return null;
                  return (
                    <div key={i} className="flex items-center justify-between gap-3 bg-neutral-900 border border-emerald-500/30 rounded-2xl px-5 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">
                            {stepLabel(i) && `${stepLabel(i)} • `}
                            {result.label}
                          </p>
                          <p className="text-xs text-neutral-300 truncate">
                            {sel.airline} • {sel.departureTime} – {sel.arrivalTime} • ${sel.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <button type="button" onClick={() => reopenLeg(i)} className="text-xs font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer shrink-0">
                        Change
                      </button>
                    </div>
                  );
                })}

                {activeResult && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                      {stepLabel(activeLegIndex) && `${stepLabel(activeLegIndex)} • `}
                      {activeResult.label}
                    </h4>

                    {activeFlights.length > 0 && (
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
                        <span className="text-[11px] text-neutral-500 ml-auto">
                          {activeFlights.length} option{activeFlights.length !== 1 ? 's' : ''} • ${bounds.price.min.toLocaleString()}–${bounds.price.max.toLocaleString()}
                        </span>
                      </div>
                    )}

                    {(() => {
                      const filtered = sortFlights(applyFilters(activeFlights), sortMode);
                      if (filtered.length === 0) {
                        return (
                          <div className="text-center py-10 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-1">
                            <p className="text-sm font-bold text-white">No flights match the filter criteria</p>
                            <p className="text-neutral-400 text-xs">Try increasing the budget or adjusting stop preferences.</p>
                          </div>
                        );
                      }
                      const showGrouping = sortMode === 'best' && filtered.length > 3;
                      const topPicks = showGrouping ? filtered.slice(0, 3) : filtered;
                      const rest = showGrouping ? filtered.slice(3) : [];
                      return (
                        <>
                          {showGrouping && <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wide">Top picks</p>}
                          <div className="space-y-4">
                            {topPicks.map((f) => (
                              <FlightResultCard key={f.id} flight={f} isSelected={false} badges={badgeMap.get(f.id)} onSelect={() => selectFlightForLeg(activeLegIndex, f)} />
                            ))}
                          </div>
                          {showGrouping && rest.length > 0 && (
                            <>
                              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wide pt-2 border-t border-neutral-800">More flights</p>
                              <div className="space-y-4">
                                {rest.map((f) => (
                                  <FlightResultCard key={f.id} flight={f} isSelected={false} badges={badgeMap.get(f.id)} onSelect={() => selectFlightForLeg(activeLegIndex, f)} />
                                ))}
                              </div>
                            </>
                          )}
                        </>
                      );
                    })()}
                  </div>
                )}
              </>
            )}

            {allSelected && (
              <div className="sticky bottom-4 bg-neutral-900 border border-emerald-500/40 rounded-2xl p-5 shadow-2xl space-y-4">
                <div className="space-y-1.5">
                  {legResults.map((result, i) => {
                    const sel = selections[i] as Flight;
                    return (
                      <div key={i} className="flex items-center justify-between gap-3 text-xs">
                        <span className="text-neutral-400 truncate">
                          {stepLabel(i) && `${stepLabel(i)} • `}
                          {result.label} <span className="text-neutral-500">({sel.airline} {sel.flightNumber})</span>
                        </span>
                        <span className="text-white font-bold shrink-0">${sel.price.toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
                {isMultiLeg && (
                  <p className="text-[11px] text-neutral-500 flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 shrink-0 mt-px text-neutral-400" />
                    Prices are per-direction estimates. Your consultant confirms the combined round-trip fare, which is often lower than the sum shown.
                  </p>
                )}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-neutral-800">
                  <div>
                    <p className="text-xs text-neutral-400 font-semibold">
                      {travelers} traveler{travelers > 1 ? 's' : ''}
                      {(counts.children > 0 || counts.infants > 0) &&
                        ` (${counts.adults} adult${counts.adults > 1 ? 's' : ''}${counts.children ? `, ${counts.children} child${counts.children > 1 ? 'ren' : ''}` : ''}${counts.infants ? `, ${counts.infants} infant${counts.infants > 1 ? 's' : ''}` : ''})`}
                    </p>
                    <p className="text-xl font-black text-white">
                      {isMultiLeg ? 'Est. total: ' : 'Total: '}${totalPrice.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={proceedToBooking}
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    Continue Booking <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
