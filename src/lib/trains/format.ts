import type { TrainClassFare } from './types';

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export function formatFare(cls: Pick<TrainClassFare, 'fare' | 'currency'>): string {
  return cls.currency === 'CAD' ? `C$${cls.fare.toLocaleString('en-US')}` : `$${cls.fare.toLocaleString('en-US')}`;
}

export function cheapestFareLabel(classes: TrainClassFare[]): string | null {
  if (classes.length === 0) return null;
  const min = classes.reduce((a, b) => (b.fare < a.fare ? b : a));
  return `from ${formatFare(min)}`;
}

/** '06:00' → '6:00 AM' for display. */
export function formatClock12(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, '0')} ${suffix}`;
}

export const AMENITY_LABELS: Record<string, string> = {
  wifi: 'Wi-Fi',
  dining_car: 'Dining car',
  cafe: 'Café car',
  catering_included: 'Meals included',
  power_outlets: 'Power outlets',
  quiet_car: 'Quiet car',
  sleeper: 'Sleeper berths',
  checked_baggage: 'Checked baggage',
  bike_space: 'Bike space',
  pets_allowed: 'Pets allowed',
  accessible: 'Wheelchair accessible',
  lounge_access: 'Lounge access',
  panoramic_windows: 'Panoramic views',
};

export const CATEGORY_LABELS: Record<string, string> = {
  'high-speed': 'High-Speed',
  premium: 'Premium',
  'long-distance': 'Long-Distance',
  intercity: 'Intercity',
  regional: 'Regional',
  scenic: 'Scenic',
  overnight: 'Overnight',
};

export function dayOffsetLabel(offset: number): string {
  if (offset <= 0) return '';
  return offset === 1 ? '+1 day' : `+${offset} days`;
}
