'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { Search, MapPin, ChevronRight, AlertCircle, ArrowLeft, ExternalLink, TrendingUp, Heart, Clock, BedDouble, Utensils, CheckCircle2, X } from 'lucide-react';
import type { Hotel, HotelDestination, HotelRoomType } from '@/lib/providers/hotels';
import { useBookingEnquiry } from '@/components/leads/BookingEnquiryContext';
import { useHotelFavorites, type SavedHotel } from '@/lib/useHotelFavorites';
import { sortHotels, toggleSetValue, HOTEL_SORT_LABELS, formatDistance, type HotelSortMode } from '@/lib/hotelDisplay';
import DestinationAutocomplete from './DestinationAutocomplete';
import DateRangePicker from './DateRangePicker';
import GuestRoomSelector from './GuestRoomSelector';
import HotelFilters from './HotelFilters';
import HotelResultCard from './HotelResultCard';
import HotelSkeleton from './HotelSkeleton';
import HotelCompareTray from './HotelCompareTray';

const MAX_COMPARE = 4;
const SORT_MODES: HotelSortMode[] = ['recommended', 'rating', 'price_low', 'price_high', 'stars', 'discount'];

interface Bounds {
  min: number;
  max: number;
}

function defaultCheckIn(): string {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().slice(0, 10);
}

function defaultCheckOut(): string {
  const d = new Date();
  d.setDate(d.getDate() + 17);
  return d.toISOString().slice(0, 10);
}

function computeBounds(hotels: Hotel[]): Bounds {
  if (hotels.length === 0) return { min: 0, max: 1000 };
  const prices = hotels.map((h) => h.pricePerNight);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

function mapUrlFor(hotel: Hotel): string {
  if (hotel.latitude != null && hotel.longitude != null) {
    return `https://www.google.com/maps/search/?api=1&query=${hotel.latitude},${hotel.longitude}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel.name}, ${hotel.location}`)}`;
}

export default function HotelSearch() {
  const { open } = useBookingEnquiry();
  const reducedMotion = useReducedMotion();
  const { favorites, recentlyViewed, isFavorite, toggleFavorite, removeFavorite, recordView } = useHotelFavorites();

  const [destination, setDestination] = useState<HotelDestination | null>(null);
  const [checkIn, setCheckIn] = useState(defaultCheckIn());
  const [checkOut, setCheckOut] = useState(defaultCheckOut());
  const [adults, setAdults] = useState(2);
  const [childAges, setChildAges] = useState<number[]>([]);
  const [rooms, setRooms] = useState(1);
  const [trending, setTrending] = useState<HotelDestination[]>([]);

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  const [sortMode, setSortMode] = useState<HotelSortMode>('recommended');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selectedStars, setSelectedStars] = useState<Set<number>>(new Set());
  const [minRating, setMinRating] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState<Set<string>>(new Set());
  const [freeCancellationOnly, setFreeCancellationOnly] = useState(false);
  const [payAtPropertyOnly, setPayAtPropertyOnly] = useState(false);
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch('/api/hotels/trending')
      .then((res) => (res.ok ? res.json() : []))
      .then((data: HotelDestination[]) => setTrending(data.slice(0, 6)))
      .catch(() => {});
  }, []);

  const handleGuestRoomChange = (patch: { adults?: number; childAges?: number[]; rooms?: number }) => {
    if (patch.adults !== undefined) setAdults(patch.adults);
    if (patch.childAges !== undefined) setChildAges(patch.childAges);
    if (patch.rooms !== undefined) setRooms(patch.rooms);
  };

  const performSearch = async (dest: HotelDestination) => {
    setDestination(dest);
    setIsLoading(true);
    setHasSearched(true);
    setSelectedHotel(null);
    setCompareIds(new Set());
    try {
      const params = new URLSearchParams({
        destId: dest.destId,
        searchType: dest.searchType,
        location: dest.label,
        checkIn,
        checkOut,
        adults: String(adults),
        rooms: String(rooms),
        childAges: childAges.join(','),
      });
      if (dest.latitude != null) params.set('destLat', String(dest.latitude));
      if (dest.longitude != null) params.set('destLng', String(dest.longitude));

      const res = await fetch(`/api/hotels?${params}`);
      if (!res.ok) throw new Error('API Fail');
      const data: Hotel[] = await res.json();
      setHotels(data);

      const bounds = computeBounds(data);
      setSortMode('recommended');
      setMaxPrice(bounds.max);
      setSelectedStars(new Set());
      setMinRating(0);
      setSelectedAmenities(new Set());
      setFreeCancellationOnly(false);
      setPayAtPropertyOnly(false);
    } catch (err) {
      console.error(err);
      setHotels([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination) return;
    performSearch(destination);
  };

  const bounds = computeBounds(hotels);
  const availableAmenities = Array.from(new Set(hotels.flatMap((h) => h.amenities))).sort();

  const applyFilters = (list: Hotel[]) =>
    list.filter((h) => {
      if (h.pricePerNight > maxPrice) return false;
      if (selectedStars.size > 0 && !selectedStars.has(h.stars)) return false;
      if (minRating > 0 && h.rating < minRating) return false;
      if (selectedAmenities.size > 0 && !Array.from(selectedAmenities).every((a) => h.amenities.includes(a))) return false;
      if (freeCancellationOnly && !h.freeCancellation) return false;
      if (payAtPropertyOnly && !h.payAtProperty) return false;
      return true;
    });

  const filteredSorted = sortHotels(applyFilters(hotels), sortMode);

  const resetFilters = () => {
    setMaxPrice(bounds.max);
    setSelectedStars(new Set());
    setMinRating(0);
    setSelectedAmenities(new Set());
    setFreeCancellationOnly(false);
    setPayAtPropertyOnly(false);
  };

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < MAX_COMPARE) {
        next.add(id);
      }
      return next;
    });
  };

  const comparedHotels = hotels.filter((h) => compareIds.has(h.id));

  const viewDetails = (h: Hotel) => {
    setSelectedHotel(h);
    recordView(h);
  };

  const enquireRoom = (hotel: Hotel, room: HotelRoomType) => {
    open({
      vertical: 'hotel',
      title: `${hotel.name} — ${room.name}`,
      subtitle: `${room.description} • ${hotel.location}`,
      price: room.price * hotel.nights,
      date: checkIn,
      details: {
        hotelName: hotel.name,
        location: hotel.location,
        roomType: room.name,
        checkIn,
        checkOut,
        adults,
        childAges,
        rooms,
      },
    });
  };

  const enquireSaved = (h: SavedHotel) => {
    open({
      vertical: 'hotel',
      title: h.name,
      subtitle: h.location,
      price: h.pricePerNight,
      date: defaultCheckIn(),
      details: { hotelName: h.name, location: h.location, note: 'Re-enquiry from a saved/recently viewed hotel — please reconfirm live pricing.' },
    });
  };

  const fadeIn = reducedMotion ? {} : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2 } };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
          <div className="md:col-span-4">
            <DestinationAutocomplete label="Where are you staying?" value={destination?.label ?? ''} onSelect={setDestination} placeholder="City, hotel, region, or landmark" />
          </div>
          <div className="md:col-span-4">
            <DateRangePicker checkIn={checkIn} checkOut={checkOut} onChangeCheckIn={setCheckIn} onChangeCheckOut={setCheckOut} />
          </div>
          <div className="md:col-span-4">
            <GuestRoomSelector adults={adults} childAges={childAges} rooms={rooms} onChange={handleGuestRoomChange} />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
          {!destination && <p className="text-[11px] text-amber-400/90 flex items-center gap-1.5">Select a destination from the list to search.</p>}
          <div className="sm:ml-auto">
            <button
              type="submit"
              disabled={!destination || !checkOut}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed active:scale-[0.99] text-white font-bold text-xs py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Search className="w-4 h-4" /> Search Hotels
            </button>
          </div>
        </div>
      </form>

      {!hasSearched && (
        <div className="space-y-6">
          {trending.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Trending destinations
              </h4>
              <div className="flex flex-wrap gap-2">
                {trending.map((d) => (
                  <button
                    key={d.destId}
                    type="button"
                    onClick={() => performSearch(d)}
                    className="text-xs font-semibold bg-neutral-900 border border-neutral-800 hover:border-emerald-500/50 text-neutral-300 hover:text-white px-3.5 py-2 rounded-xl cursor-pointer transition-colors"
                  >
                    {d.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {favorites.length > 0 && <SavedHotelRow title="Saved hotels" icon={Heart} hotels={favorites} onEnquire={enquireSaved} onRemove={removeFavorite} />}
          {recentlyViewed.length > 0 && <SavedHotelRow title="Recently viewed" icon={Clock} hotels={recentlyViewed} onEnquire={enquireSaved} />}
        </div>
      )}

      {hasSearched && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {!selectedHotel && (
            <HotelFilters
              maxPrice={maxPrice}
              onMaxPriceChange={setMaxPrice}
              priceBounds={bounds}
              selectedStars={selectedStars}
              onToggleStar={(star) => setSelectedStars((prev) => toggleSetValue(prev, star))}
              minRating={minRating}
              onMinRatingChange={setMinRating}
              availableAmenities={availableAmenities}
              selectedAmenities={selectedAmenities}
              onToggleAmenity={(a) => setSelectedAmenities((prev) => toggleSetValue(prev, a))}
              freeCancellationOnly={freeCancellationOnly}
              onToggleFreeCancellation={() => setFreeCancellationOnly((v) => !v)}
              payAtPropertyOnly={payAtPropertyOnly}
              onTogglePayAtProperty={() => setPayAtPropertyOnly((v) => !v)}
              onReset={resetFilters}
            />
          )}

          <div className={`${selectedHotel ? 'lg:col-span-4' : 'lg:col-span-3'} space-y-4`}>
            {selectedHotel && (
              <button onClick={() => setSelectedHotel(null)} className="text-emerald-400 hover:text-emerald-350 text-xs font-medium flex items-center gap-1 cursor-pointer mb-2">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to results
              </button>
            )}

            {isLoading ? (
              <div className="space-y-4" aria-live="polite" aria-busy="true">
                <p className="sr-only">Searching for hotels…</p>
                {Array.from({ length: 4 }).map((_, i) => (
                  <HotelSkeleton key={i} />
                ))}
              </div>
            ) : selectedHotel ? (
              <motion.div {...fadeIn}>
                <HotelDetail hotel={selectedHotel} onEnquire={(room) => enquireRoom(selectedHotel, room)} isFavorite={isFavorite(selectedHotel.id)} onToggleFavorite={() => toggleFavorite(selectedHotel)} />
              </motion.div>
            ) : hotels.length === 0 ? (
              <div className="text-center py-16 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-2">
                <AlertCircle className="w-8 h-8 text-neutral-500 mx-auto" />
                <h5 className="text-sm font-bold text-white">No hotels found</h5>
                <p className="text-neutral-400 text-xs">Try a different destination or dates.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 flex-wrap justify-between">
                  <p className="text-xs text-neutral-400 font-semibold" aria-live="polite">
                    {filteredSorted.length} hotel{filteredSorted.length !== 1 ? 's' : ''} found
                  </p>
                  <label className="flex items-center gap-2 text-xs">
                    <span className="text-neutral-400 font-semibold">Sort:</span>
                    <select
                      value={sortMode}
                      onChange={(e) => setSortMode(e.target.value as HotelSortMode)}
                      className="bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-white font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      {SORT_MODES.map((mode) => (
                        <option key={mode} value={mode}>
                          {HOTEL_SORT_LABELS[mode]}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {filteredSorted.length === 0 ? (
                  <div className="text-center py-10 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-1">
                    <p className="text-sm font-bold text-white">No hotels match the filter criteria</p>
                    <p className="text-neutral-400 text-xs">Try relaxing a filter or increasing the budget.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredSorted.map((h) => (
                      <motion.div key={h.id} {...fadeIn}>
                        <HotelResultCard
                          hotel={h}
                          isFavorite={isFavorite(h.id)}
                          onToggleFavorite={() => toggleFavorite(h)}
                          isCompared={compareIds.has(h.id)}
                          compareDisabled={compareIds.size >= MAX_COMPARE}
                          onToggleCompare={() => toggleCompare(h.id)}
                          onViewDetails={() => viewDetails(h)}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}

                <HotelCompareTray hotels={comparedHotels} onRemove={toggleCompare} onClear={() => setCompareIds(new Set())} />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SavedHotelRow({ title, icon: Icon, hotels, onEnquire, onRemove }: { title: string; icon: typeof Heart; hotels: SavedHotel[]; onEnquire: (h: SavedHotel) => void; onRemove?: (id: string) => void }) {
  return (
    <div className="space-y-2.5">
      <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5 text-emerald-400" /> {title}
      </h4>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {hotels.map((h) => (
          <div key={h.id} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shrink-0 w-56 group">
            <div className="relative h-28 bg-neutral-950">
              <Image src={h.image} alt={h.name} fill sizes="224px" className="object-cover" />
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(h.id)}
                  aria-label={`Remove ${h.name} from saved hotels`}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-neutral-950/70 text-white flex items-center justify-center cursor-pointer hover:bg-neutral-950"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="p-3 space-y-2">
              <p className="text-xs font-bold text-white truncate">{h.name}</p>
              <p className="text-[11px] text-neutral-400 truncate">{h.location}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-white">${h.pricePerNight.toLocaleString()}</span>
                <button type="button" onClick={() => onEnquire(h)} className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer">
                  Enquire
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HotelDetail({ hotel: h, onEnquire, isFavorite, onToggleFavorite }: { hotel: Hotel; onEnquire: (room: HotelRoomType) => void; isFavorite: boolean; onToggleFavorite: () => void }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="relative grid grid-cols-4 grid-rows-2 gap-1 h-72 sm:h-96 bg-neutral-950">
        {h.images.slice(0, 4).map((img, i) => (
          <div key={i} className={`relative ${i === 0 ? 'col-span-4 row-span-2 sm:col-span-2 sm:row-span-2' : 'col-span-2 row-span-1 hidden sm:block'}`}>
            <Image src={img} alt={`${h.name} photo ${i + 1}`} fill sizes="50vw" className="object-cover" />
          </div>
        ))}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            type="button"
            onClick={onToggleFavorite}
            aria-pressed={isFavorite}
            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm cursor-pointer transition-colors ${isFavorite ? 'bg-red-500 text-white' : 'bg-neutral-950/70 text-white hover:bg-neutral-950'}`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1 text-xs text-emerald-400 font-mono">
            {h.stars > 0 && '★'.repeat(h.stars)}
            {h.rating > 0 && (
              <span className="ml-1 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                {h.rating.toFixed(1)} {h.reviewScoreWord}
              </span>
            )}
            <span className="text-neutral-500">({h.reviewsCount.toLocaleString()} reviews)</span>
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight leading-none mt-1">{h.name}</h3>
          <p className="text-xs text-neutral-400 mt-1.5 flex items-center gap-1 flex-wrap">
            <MapPin className="w-3.5 h-3.5" /> {h.address || h.location}
            {h.distanceFromCenterKm != null && <span>• {formatDistance(h.distanceFromCenterKm)} from {h.location}</span>}
            <a href={mapUrlFor(h)} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold">
              View on map <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-xs text-neutral-300">
          {h.checkInTime && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-neutral-500" /> Check-in from {h.checkInTime}
            </span>
          )}
          {h.checkOutTime && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-neutral-500" /> Check-out by {h.checkOutTime}
            </span>
          )}
          {h.freeCancellation && (
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> Free cancellation available
            </span>
          )}
        </div>

        {h.amenities.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Property Amenities</h4>
            <div className="flex flex-wrap gap-2">
              {h.amenities.map((am) => (
                <span key={am} className="text-xs bg-neutral-950 border border-neutral-850 px-3 py-1.5 rounded-xl text-neutral-300 flex items-center gap-1.5 font-medium">
                  <Utensils className="w-3.5 h-3.5 text-emerald-400" /> {am}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4 pt-2">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
            Available Rooms ({h.nights} night{h.nights > 1 ? 's' : ''})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {h.roomTypes.map((room) => (
              <div key={room.name} className="bg-neutral-950 border border-neutral-850 rounded-xl p-5 flex flex-col justify-between space-y-4 shadow hover:border-emerald-500/35 transition-colors">
                <div className="space-y-2">
                  <h5 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <BedDouble className="w-4 h-4 text-emerald-400" /> {room.name}
                  </h5>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">{room.description}</p>
                  <p className="text-[10px] text-neutral-500 font-medium">
                    Up to {room.capacity} guests • {room.bedType} bed • {room.mealPlan}
                  </p>
                </div>
                <div className="border-t border-neutral-850 pt-3 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-neutral-500 font-semibold">{h.nights}-night total</p>
                    <p className="text-lg font-extrabold text-emerald-400">${(room.price * h.nights).toLocaleString()}</p>
                  </div>
                  <button onClick={() => onEnquire(room)} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3.5 py-2 rounded-lg font-bold flex items-center cursor-pointer transition-colors">
                    Enquire <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-neutral-500">Prices exclude taxes and fees where applicable — a consultant will confirm the final total before you book.</p>
        </div>
      </div>
    </div>
  );
}
