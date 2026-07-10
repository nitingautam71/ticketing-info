import React, { useState } from 'react';
import { Search, Plane, Calendar, ArrowUpDown, Filter, ChevronRight, User, AlertCircle, Briefcase, RefreshCw } from 'lucide-react';
import { Flight } from '../../types';

interface FlightsTabProps {
  onSelectBookingItem: (item: {
    type: 'flight' | 'hotel' | 'cruise' | 'train' | 'rental' | 'transfer' | 'insurance' | 'visa' | 'package';
    title: string;
    subtitle: string;
    price: number;
    date: string;
    details: any;
  }) => void;
}

export default function FlightsTab({ onSelectBookingItem }: FlightsTabProps) {
  const [from, setFrom] = useState('JFK');
  const [to, setTo] = useState('LHR');
  const [date, setDate] = useState('2026-08-15');
  const [flightClass, setFlightClass] = useState<'Economy' | 'Premium Economy' | 'Business' | 'First'>('Economy');
  const [passengerCount, setPassengerCount] = useState(1);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Filters
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [stopsFilter, setStopsFilter] = useState<string>('all');
  const [airlineFilter, setAirlineFilter] = useState<string>('all');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch(`/api/flights?from=${from}&to=${to}&date=${date}&class=${flightClass}`);
      if (!res.ok) throw new Error('API Fail');
      const data = await res.json();
      setFlights(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const swapAirports = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  // Filter calculations
  const airlinesList = Array.from(new Set(flights.map(f => f.airline)));
  
  const filteredFlights = flights.filter(f => {
    if (f.price > maxPrice) return false;
    if (stopsFilter === 'direct' && f.stops !== 0) return false;
    if (stopsFilter === '1stop' && f.stops !== 1) return false;
    if (airlineFilter !== 'all' && f.airline !== airlineFilter) return false;
    return true;
  });

  const selectFlight = (flight: Flight) => {
    onSelectBookingItem({
      type: 'flight',
      title: `${flight.departureAirport} to ${flight.arrivalAirport} (${flight.airline})`,
      subtitle: `Flight ${flight.flightNumber} • ${flight.class}`,
      price: flight.price * passengerCount,
      date: date,
      details: {
        airline: flight.airline,
        flightNumber: flight.flightNumber,
        departureAirport: flight.departureAirport,
        arrivalAirport: flight.arrivalAirport,
        departureTime: flight.departureTime,
        arrivalTime: flight.arrivalTime,
        class: flight.class,
        passengerCount,
        baggage: flight.baggage
      }
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Flight Search Form */}
      <form onSubmit={handleSearch} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Departure Airport */}
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

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center pt-5">
            <button 
              type="button"
              onClick={swapAirports}
              className="p-3 bg-neutral-950 border border-neutral-800 rounded-full text-neutral-400 hover:text-white hover:border-emerald-500 transition-all cursor-pointer"
            >
              <ArrowUpDown className="w-4 h-4 md:rotate-90" />
            </button>
          </div>

          {/* Destination Airport */}
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

          {/* Departure Date */}
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-neutral-400 mb-1">Departure Date</label>
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

          {/* Passengers */}
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

        {/* Secondary parameters: Cabin class and trigger */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
          <div className="flex bg-neutral-950 p-1 border border-neutral-800 rounded-xl w-full sm:w-auto">
            {(['Economy', 'Premium Economy', 'Business', 'First'] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFlightClass(c)}
                className={`flex-1 sm:flex-none text-xs px-4 py-2.5 rounded-lg font-medium transition-all cursor-pointer ${flightClass === c ? 'bg-emerald-600 text-white shadow' : 'text-neutral-400 hover:text-white'}`}
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

      {/* Main Flights Search Results layout */}
      {hasSearched && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Side filter panel */}
          <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl h-fit space-y-6">
            <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
              <Filter className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Search Filters</h4>
            </div>

            {/* Price Filter */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-neutral-400">Max Ticket Price</span>
                <span className="text-white">${maxPrice.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min={200}
                max={5000}
                step={50}
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            {/* Stops Filter */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-neutral-400 uppercase">Stops</h5>
              <div className="space-y-2 text-xs">
                {['all', 'direct', '1stop'].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer text-neutral-350 hover:text-white">
                    <input 
                      type="radio" 
                      name="stops" 
                      checked={stopsFilter === opt}
                      onChange={() => setStopsFilter(opt)}
                      className="accent-emerald-500"
                    />
                    <span className="capitalize">{opt === 'all' ? 'Any Stops' : opt === 'direct' ? 'Non-Stop Only' : '1 Stop Only'}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Airlines filter */}
            {airlinesList.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-neutral-400 uppercase">Airlines</h5>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-neutral-350 hover:text-white">
                    <input 
                      type="radio" 
                      name="airlines" 
                      checked={airlineFilter === 'all'}
                      onChange={() => setAirlineFilter('all')}
                      className="accent-emerald-500"
                    />
                    <span>All Airlines</span>
                  </label>
                  {airlinesList.map((al) => (
                    <label key={al} className="flex items-center gap-2 cursor-pointer text-neutral-350 hover:text-white">
                      <input 
                        type="radio" 
                        name="airlines" 
                        checked={airlineFilter === al}
                        onChange={() => setAirlineFilter(al)}
                        className="accent-emerald-500"
                      />
                      <span>{al}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results grid */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex justify-between items-center text-xs text-neutral-400">
              <p>Showing {filteredFlights.length} of {flights.length} recommended flights</p>
            </div>

            {isLoading ? (
              <div className="text-center py-16 bg-neutral-900/40 border border-neutral-800 rounded-2xl">
                <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-neutral-400 text-sm">Querying active flight paths and seating availability...</p>
              </div>
            ) : filteredFlights.length === 0 ? (
              <div className="text-center py-16 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-2">
                <AlertCircle className="w-8 h-8 text-neutral-500 mx-auto" />
                <h5 className="text-sm font-bold text-white">No flights match the filter criteria</h5>
                <p className="text-neutral-400 text-xs">Try increasing the budget or adjusting stop preferences.</p>
              </div>
            ) : (
              filteredFlights.map((f) => (
                <div 
                  key={f.id} 
                  className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl overflow-hidden shadow-md transition-all group"
                >
                  <div className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    
                    {/* Flight Details block */}
                    <div className="flex-1 space-y-4">
                      
                      {/* Brand Info */}
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-neutral-950 rounded-xl flex items-center justify-center font-bold text-xs text-emerald-400 border border-neutral-800">
                          {f.airlineLogo}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white leading-none">{f.airline}</h4>
                          <span className="text-[10px] text-neutral-500 font-mono">Flight {f.flightNumber} • {f.class}</span>
                        </div>
                      </div>

                      {/* Flight Path layout */}
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
                          <span className="text-[9px] text-neutral-500">
                            {f.stops === 0 ? 'Nonstop' : `${f.stops} Stop (${f.stopoverAirports?.join(', ')})`}
                          </span>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-extrabold text-white leading-none tracking-tight">{f.arrivalTime}</p>
                          <p className="text-xs text-neutral-400 font-bold mt-1 uppercase">{f.arrivalAirport}</p>
                        </div>
                      </div>

                      {/* Baggage info row */}
                      <div className="flex gap-2 items-center text-[10px] text-neutral-400 font-medium">
                        <Briefcase className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Included Baggage: {f.baggage}</span>
                      </div>

                    </div>

                    {/* Pricing & select block */}
                    <div className="flex sm:flex-col justify-between items-end gap-3 w-full sm:w-auto border-t sm:border-t-0 border-neutral-800 pt-4 sm:pt-0 shrink-0">
                      <div className="sm:text-right">
                        <p className="text-[10px] text-neutral-500 font-semibold">Price per passenger</p>
                        <p className="text-2xl font-black text-white mt-0.5">${f.price.toLocaleString()}</p>
                        {passengerCount > 1 && (
                          <p className="text-[10px] text-emerald-400 font-mono mt-0.5">Total: ${(f.price * passengerCount).toLocaleString()}</p>
                        )}
                      </div>

                      <button 
                        onClick={() => selectFlight(f)}
                        className="bg-emerald-600 hover:bg-emerald-500 group-hover:scale-[1.02] text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        Select Flight <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      )}

    </div>
  );
}
