'use client';

import { Filter, RotateCcw } from 'lucide-react';

interface Bounds {
  min: number;
  max: number;
}

interface HotelFiltersProps {
  maxPrice: number;
  onMaxPriceChange: (v: number) => void;
  priceBounds: Bounds;

  selectedStars: Set<number>;
  onToggleStar: (star: number) => void;

  minRating: number;
  onMinRatingChange: (v: number) => void;

  availableAmenities: string[];
  selectedAmenities: Set<string>;
  onToggleAmenity: (amenity: string) => void;

  freeCancellationOnly: boolean;
  onToggleFreeCancellation: () => void;

  payAtPropertyOnly: boolean;
  onTogglePayAtProperty: () => void;

  onReset: () => void;
}

const STAR_OPTIONS = [5, 4, 3, 2, 1];
const RATING_OPTIONS: { value: number; label: string }[] = [
  { value: 0, label: 'Any rating' },
  { value: 9, label: '9+ Exceptional' },
  { value: 8, label: '8+ Excellent' },
  { value: 7, label: '7+ Very Good' },
  { value: 6, label: '6+ Good' },
];

export default function HotelFilters({
  maxPrice,
  onMaxPriceChange,
  priceBounds,
  selectedStars,
  onToggleStar,
  minRating,
  onMinRatingChange,
  availableAmenities,
  selectedAmenities,
  onToggleAmenity,
  freeCancellationOnly,
  onToggleFreeCancellation,
  payAtPropertyOnly,
  onTogglePayAtProperty,
  onReset,
}: HotelFiltersProps) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl h-fit space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-400" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Filters</h4>
        </div>
        <button type="button" onClick={onReset} className="flex items-center gap-1 text-[11px] font-bold text-neutral-400 hover:text-white cursor-pointer transition-colors">
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-neutral-400">Max Price / Night</span>
          <span className="text-white">${maxPrice.toLocaleString()}</span>
        </div>
        <input
          type="range"
          min={priceBounds.min}
          max={priceBounds.max}
          step={5}
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(parseInt(e.target.value, 10))}
          aria-label="Maximum price per night"
          className="w-full accent-emerald-500"
        />
      </div>

      <div className="space-y-2">
        <h5 className="text-xs font-bold text-neutral-400 uppercase">Star Rating</h5>
        <div className="space-y-2 text-xs">
          {STAR_OPTIONS.map((star) => (
            <label key={star} className="flex items-center gap-2 cursor-pointer text-neutral-350 hover:text-white">
              <input type="checkbox" checked={selectedStars.has(star)} onChange={() => onToggleStar(star)} className="accent-emerald-500" />
              <span>
                {'★'.repeat(star)} {star} Star{star > 1 ? 's' : ''}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h5 className="text-xs font-bold text-neutral-400 uppercase">Guest Rating</h5>
        <div className="space-y-2 text-xs">
          {RATING_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer text-neutral-350 hover:text-white">
              <input type="radio" name="hotel-min-rating" checked={minRating === opt.value} onChange={() => onMinRatingChange(opt.value)} className="accent-emerald-500" />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h5 className="text-xs font-bold text-neutral-400 uppercase">Booking Options</h5>
        <div className="space-y-2 text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-neutral-350 hover:text-white">
            <input type="checkbox" checked={freeCancellationOnly} onChange={onToggleFreeCancellation} className="accent-emerald-500" />
            <span>Free cancellation</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-neutral-350 hover:text-white">
            <input type="checkbox" checked={payAtPropertyOnly} onChange={onTogglePayAtProperty} className="accent-emerald-500" />
            <span>Pay at property</span>
          </label>
        </div>
      </div>

      {availableAmenities.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-xs font-bold text-neutral-400 uppercase">Amenities</h5>
          <div className="space-y-2 text-xs max-h-56 overflow-y-auto pr-1">
            {availableAmenities.map((amenity) => (
              <label key={amenity} className="flex items-center gap-2 cursor-pointer text-neutral-350 hover:text-white">
                <input type="checkbox" checked={selectedAmenities.has(amenity)} onChange={() => onToggleAmenity(amenity)} className="accent-emerald-500" />
                <span>{amenity}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
