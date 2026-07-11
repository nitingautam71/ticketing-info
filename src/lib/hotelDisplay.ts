import type { Hotel } from './providers/hotels';

export type HotelSortMode = 'recommended' | 'rating' | 'price_low' | 'price_high' | 'stars' | 'discount';

export const HOTEL_SORT_LABELS: Record<HotelSortMode, string> = {
  recommended: 'Recommended',
  rating: 'Guest Rating',
  price_low: 'Price: Low to High',
  price_high: 'Price: High to Low',
  stars: 'Star Rating',
  discount: 'Biggest Discount',
};

export function discountPercent(hotel: Hotel): number {
  if (!hotel.originalPricePerNight || hotel.originalPricePerNight <= hotel.pricePerNight) return 0;
  return Math.round((1 - hotel.pricePerNight / hotel.originalPricePerNight) * 100);
}

/** Client-side ranking so re-sorting never costs another API call. */
export function sortHotels(hotels: Hotel[], mode: HotelSortMode): Hotel[] {
  const arr = [...hotels];
  if (mode === 'price_low') return arr.sort((a, b) => a.pricePerNight - b.pricePerNight);
  if (mode === 'price_high') return arr.sort((a, b) => b.pricePerNight - a.pricePerNight);
  if (mode === 'rating') return arr.sort((a, b) => b.rating - a.rating);
  if (mode === 'stars') return arr.sort((a, b) => b.stars - a.stars);
  if (mode === 'discount') return arr.sort((a, b) => discountPercent(b) - discountPercent(a));

  const maxPrice = Math.max(...arr.map((h) => h.pricePerNight), 1);
  return arr.sort((a, b) => {
    const scoreA = a.pricePerNight / maxPrice - a.rating / 10 - a.stars * 0.03;
    const scoreB = b.pricePerNight / maxPrice - b.rating / 10 - b.stars * 0.03;
    return scoreA - scoreB;
  });
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(km < 10 ? 1 : 0)} km`;
}

export function toggleSetValue<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}