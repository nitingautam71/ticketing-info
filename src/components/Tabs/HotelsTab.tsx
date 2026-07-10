import React, { useState } from 'react';
import { Search, MapPin, Calendar, Star, Filter, Coffee, Wifi, Shield, ChevronRight, Info, AlertCircle } from 'lucide-react';
import { Hotel } from '../../types';

interface HotelsTabProps {
  onSelectBookingItem: (item: {
    type: 'flight' | 'hotel' | 'cruise' | 'train' | 'rental' | 'transfer' | 'insurance' | 'visa' | 'package';
    title: string;
    subtitle: string;
    price: number;
    date: string;
    details: any;
  }) => void;
}

export default function HotelsTab({ onSelectBookingItem }: HotelsTabProps) {
  const [location, setLocation] = useState('London');
  const [dates, setDates] = useState('2026-08-15');
  const [guests, setGuests] = useState(2);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Selected hotel for Room view
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  // Filters
  const [maxPrice, setMaxPrice] = useState<number>(600);
  const [starsFilter, setStarsFilter] = useState<string>('all');
  const [selectedAmenity, setSelectedAmenity] = useState<string>('all');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setHasSearched(true);
    setSelectedHotel(null);
    try {
      const res = await fetch(`/api/hotels?location=${location}`);
      if (!res.ok) throw new Error('API Fail');
      const data = await res.json();
      setHotels(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredHotels = hotels.filter(h => {
    if (h.pricePerNight > maxPrice) return false;
    if (starsFilter !== 'all' && h.stars.toString() !== starsFilter) return false;
    if (selectedAmenity !== 'all' && !h.amenities.includes(selectedAmenity)) return false;
    return true;
  });

  const triggerCheckout = (hotel: Hotel, room: any) => {
    onSelectBookingItem({
      type: 'hotel',
      title: `${hotel.name} - ${room.name}`,
      subtitle: `${room.description} • ${hotel.location}`,
      price: room.price * 3, // Simulate 3 nights stay
      date: dates,
      details: {
        hotelName: hotel.name,
        location: hotel.location,
        roomType: room.name,
        checkIn: dates,
        checkOut: new Date(new Date(dates).getTime() + 3*24*60*60*1000).toISOString().split('T')[0],
        guests
      }
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Search form */}
      <form onSubmit={handleSearch} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Destination */}
          <div className="md:col-span-5 relative">
            <label className="block text-xs font-semibold text-neutral-400 mb-1">Where are you staying?</label>
            <div className="relative">
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Paris, France"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            </div>
          </div>

          {/* Date */}
          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-neutral-400 mb-1">Check-In Date (3 Nights)</label>
            <div className="relative">
              <input 
                type="date" 
                value={dates}
                onChange={(e) => setDates(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            </div>
          </div>

          {/* Guests */}
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-neutral-400 mb-1">Guests</label>
            <div className="relative">
              <select 
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-4 pr-10 py-3.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value={1}>1 Guest</option>
                <option value={2}>2 Guests</option>
                <option value={3}>3 Guests</option>
                <option value={4}>4+ Guests</option>
              </select>
            </div>
          </div>

        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Search className="w-4 h-4" /> Search Lodging & Hotels
          </button>
        </div>
      </form>

      {/* Main Grid */}
      {hasSearched && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left Filters */}
          {!selectedHotel && (
            <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl h-fit space-y-6">
              <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
                <Filter className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Lodging Filters</h4>
              </div>

              {/* Price filter */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-neutral-400">Max Budget/Night</span>
                  <span className="text-white">${maxPrice}</span>
                </div>
                <input 
                  type="range" 
                  min={100}
                  max={1000}
                  step={20}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              {/* Stars rating filter */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-neutral-400 uppercase">Star Rating</h5>
                <div className="space-y-2 text-xs">
                  {['all', '5', '4', '3'].map((opt) => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer text-neutral-350 hover:text-white">
                      <input 
                        type="radio" 
                        name="stars" 
                        checked={starsFilter === opt}
                        onChange={() => setStarsFilter(opt)}
                        className="accent-emerald-500"
                      />
                      <span>{opt === 'all' ? 'Any Rating' : `${opt} Stars`}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amenities filter */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-neutral-400 uppercase">Key Amenity</h5>
                <select 
                  value={selectedAmenity}
                  onChange={(e) => setSelectedAmenity(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-white"
                >
                  <option value="all">Any Amenity</option>
                  <option value="Free WiFi">Free WiFi</option>
                  <option value="Infinity Pool">Infinity Pool</option>
                  <option value="Spa Center">Spa Center</option>
                  <option value="Free Breakfast">Free Breakfast</option>
                </select>
              </div>
            </div>
          )}

          {/* Right Listings or Details */}
          <div className={`${selectedHotel ? 'lg:col-span-4' : 'lg:col-span-3'} space-y-4`}>
            
            {/* BACK TO LISTING link if hotel is selected */}
            {selectedHotel && (
              <button 
                onClick={() => setSelectedHotel(null)}
                className="text-emerald-400 hover:text-emerald-350 text-xs font-medium flex items-center gap-1 cursor-pointer mb-2"
              >
                ← Back to Lodging Listings
              </button>
            )}

            {isLoading ? (
              <div className="text-center py-16 bg-neutral-900/40 border border-neutral-800 rounded-2xl">
                <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-neutral-400 text-sm">Querying local hotel room matrices and check-in windows...</p>
              </div>
            ) : selectedHotel ? (
              
              /* HOTEL DETAIL & ROOM CHOICES VIEW */
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="h-64 relative bg-neutral-950">
                  <img 
                    src={selectedHotel.image} 
                    alt={selectedHotel.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-1 text-xs text-emerald-400 font-mono mb-1 bg-emerald-950/60 border border-emerald-900 px-2.5 py-0.5 rounded-full inline-block">
                      ★ {selectedHotel.stars}-Star Rated
                    </div>
                    <h3 className="text-2xl font-black text-white tracking-tight leading-none mt-1">{selectedHotel.name}</h3>
                    <p className="text-xs text-neutral-300 mt-1.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {selectedHotel.location}
                    </p>
                  </div>
                </div>

                <div className="p-6 md:p-8 space-y-6">
                  {/* Amenities */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Property Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedHotel.amenities.map((am) => (
                        <span key={am} className="text-xs bg-neutral-950 border border-neutral-850 px-3 py-1.5 rounded-xl text-neutral-300 flex items-center gap-1.5 font-medium">
                          <Coffee className="w-3.5 h-3.5 text-emerald-400" /> {am}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Room Selection Grid */}
                  <div className="space-y-4 pt-2">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Available Room Types (3-Night Rates)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {selectedHotel.roomTypes.map((room) => (
                        <div key={room.name} className="bg-neutral-950 border border-neutral-850 rounded-xl p-5 flex flex-col justify-between space-y-4 shadow hover:border-emerald-500/35 transition-colors">
                          <div className="space-y-2">
                            <h5 className="text-sm font-bold text-white">{room.name}</h5>
                            <p className="text-[11px] text-neutral-400 leading-relaxed">{room.description}</p>
                            <p className="text-[10px] text-neutral-500 font-medium">Accommodates up to {room.capacity} adults</p>
                          </div>
                          
                          <div className="border-t border-neutral-850 pt-3 flex justify-between items-end">
                            <div>
                              <p className="text-[10px] text-neutral-500 font-semibold">3-Night Total</p>
                              <p className="text-lg font-extrabold text-emerald-400">${(room.price * 3).toLocaleString()}</p>
                            </div>
                            <button 
                              onClick={() => triggerCheckout(selectedHotel, room)}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3.5 py-2 rounded-lg font-bold flex items-center cursor-pointer transition-colors"
                            >
                              Book Room <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            ) : filteredHotels.length === 0 ? (
              <div className="text-center py-16 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-2">
                <AlertCircle className="w-8 h-8 text-neutral-500 mx-auto" />
                <h5 className="text-sm font-bold text-white">No lodgings match the filter criteria</h5>
                <p className="text-neutral-400 text-xs">Try increasing the budget or adjusting star options.</p>
              </div>
            ) : (
              
              /* HOTELS LIST */
              filteredHotels.map((h) => (
                <div 
                  key={h.id}
                  className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl overflow-hidden shadow-md flex flex-col sm:flex-row transition-all group"
                >
                  {/* Photo Left */}
                  <div className="w-full sm:w-[220px] h-[160px] sm:h-auto relative bg-neutral-950 shrink-0">
                    <img 
                      src={h.image} 
                      alt={h.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-80"
                    />
                  </div>

                  {/* Content middle */}
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                        {Array.from({ length: h.stars }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-emerald-400 stroke-none" />
                        ))}
                        <span className="ml-1 text-neutral-500 font-bold">{h.stars}-Star</span>
                      </div>
                      <h4 className="text-base font-bold text-white tracking-tight leading-snug group-hover:text-emerald-400 transition-colors">{h.name}</h4>
                      <p className="text-xs text-neutral-400 flex items-center gap-0.5"><MapPin className="w-3.5 h-3.5" /> {h.location}</p>
                      
                      {/* Amenities snippet */}
                      <div className="flex gap-2 flex-wrap pt-2">
                        {h.amenities.slice(0, 3).map((am) => (
                          <span key={am} className="text-[10px] bg-neutral-950 text-neutral-400 border border-neutral-850 px-2.5 py-1 rounded-lg">
                            {am}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Pricing Right */}
                    <div className="flex sm:flex-row justify-between items-end border-t border-neutral-800/60 pt-4 mt-2">
                      <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                        <span className="font-bold text-white">★ {h.rating}</span>
                        <span>({h.reviewsCount} reviews)</span>
                      </div>

                      <div className="text-right flex items-center gap-4">
                        <div>
                          <p className="text-[10px] text-neutral-500 font-semibold">From per night</p>
                          <p className="text-lg font-black text-white">${h.pricePerNight}</p>
                        </div>
                        <button 
                          onClick={() => setSelectedHotel(h)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          View Rooms <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
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
