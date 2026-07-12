import type { OriginMarket } from './types';

// Representative hub city per origin market (for great-circle distance/flight-time
// estimation) and a static approximate FX rate to USD. Both are clearly-labeled
// estimates throughout the app — swap the airfare formula in pricing.ts for a
// live GDS/NDC fare search and usdRate for a live FX feed when those are wired up.
export const ORIGIN_MARKETS: OriginMarket[] = [
  { code: 'US', name: 'United States', hubCity: 'New York', lat: 40.7128, lon: -74.006, currency: 'USD', usdRate: 1 },
  { code: 'CA', name: 'Canada', hubCity: 'Toronto', lat: 43.6532, lon: -79.3832, currency: 'CAD', usdRate: 1.37 },
  { code: 'GB', name: 'United Kingdom', hubCity: 'London', lat: 51.5074, lon: -0.1278, currency: 'GBP', usdRate: 0.79 },
  { code: 'FR', name: 'France', hubCity: 'Paris', lat: 48.8566, lon: 2.3522, currency: 'EUR', usdRate: 0.92 },
  { code: 'DE', name: 'Germany', hubCity: 'Frankfurt', lat: 50.1109, lon: 8.6821, currency: 'EUR', usdRate: 0.92 },
  { code: 'IT', name: 'Italy', hubCity: 'Rome', lat: 41.9028, lon: 12.4964, currency: 'EUR', usdRate: 0.92 },
  { code: 'ES', name: 'Spain', hubCity: 'Madrid', lat: 40.4168, lon: -3.7038, currency: 'EUR', usdRate: 0.92 },
  { code: 'NL', name: 'Netherlands', hubCity: 'Amsterdam', lat: 52.3676, lon: 4.9041, currency: 'EUR', usdRate: 0.92 },
  { code: 'CH', name: 'Switzerland', hubCity: 'Zurich', lat: 47.3769, lon: 8.5417, currency: 'CHF', usdRate: 0.88 },
  { code: 'AU', name: 'Australia', hubCity: 'Sydney', lat: -33.8688, lon: 151.2093, currency: 'AUD', usdRate: 1.52 },
  { code: 'NZ', name: 'New Zealand', hubCity: 'Auckland', lat: -36.8485, lon: 174.7633, currency: 'NZD', usdRate: 1.64 },
  { code: 'IN', name: 'India', hubCity: 'Delhi', lat: 28.6139, lon: 77.209, currency: 'INR', usdRate: 84 },
  { code: 'JP', name: 'Japan', hubCity: 'Tokyo', lat: 35.6762, lon: 139.6503, currency: 'JPY', usdRate: 152 },
  { code: 'KR', name: 'South Korea', hubCity: 'Seoul', lat: 37.5665, lon: 126.978, currency: 'KRW', usdRate: 1370 },
  { code: 'SG', name: 'Singapore', hubCity: 'Singapore', lat: 1.3521, lon: 103.8198, currency: 'SGD', usdRate: 1.34 },
  { code: 'TH', name: 'Thailand', hubCity: 'Bangkok', lat: 13.7563, lon: 100.5018, currency: 'THB', usdRate: 35 },
  { code: 'MY', name: 'Malaysia', hubCity: 'Kuala Lumpur', lat: 3.139, lon: 101.6869, currency: 'MYR', usdRate: 4.4 },
  { code: 'ID', name: 'Indonesia', hubCity: 'Jakarta', lat: -6.2088, lon: 106.8456, currency: 'IDR', usdRate: 15800 },
  { code: 'PH', name: 'Philippines', hubCity: 'Manila', lat: 14.5995, lon: 120.9842, currency: 'PHP', usdRate: 57 },
  { code: 'VN', name: 'Vietnam', hubCity: 'Ho Chi Minh City', lat: 10.8231, lon: 106.6297, currency: 'VND', usdRate: 25400 },
  { code: 'AE', name: 'United Arab Emirates', hubCity: 'Dubai', lat: 25.2048, lon: 55.2708, currency: 'AED', usdRate: 3.67 },
  { code: 'SA', name: 'Saudi Arabia', hubCity: 'Riyadh', lat: 24.7136, lon: 46.6753, currency: 'SAR', usdRate: 3.75 },
  { code: 'QA', name: 'Qatar', hubCity: 'Doha', lat: 25.2854, lon: 51.531, currency: 'QAR', usdRate: 3.64 },
  { code: 'KW', name: 'Kuwait', hubCity: 'Kuwait City', lat: 29.3759, lon: 47.9774, currency: 'KWD', usdRate: 0.307 },
  { code: 'ZA', name: 'South Africa', hubCity: 'Johannesburg', lat: -26.2041, lon: 28.0473, currency: 'ZAR', usdRate: 18.5 },
  { code: 'BR', name: 'Brazil', hubCity: 'São Paulo', lat: -23.5505, lon: -46.6333, currency: 'BRL', usdRate: 5.4 },
  { code: 'MX', name: 'Mexico', hubCity: 'Mexico City', lat: 19.4326, lon: -99.1332, currency: 'MXN', usdRate: 17 },
];

export const ORIGIN_MARKETS_BY_CODE: Record<string, OriginMarket> = Object.fromEntries(
  ORIGIN_MARKETS.map((m) => [m.code, m]),
);

/** Major airlines plausible on routes ex- each origin market, used to compose SuggestedFlightRoute.airlines. Not a live schedule — illustrative of realistic carriers. */
export const AIRLINES_BY_MARKET: Record<string, string[]> = {
  US: ['United Airlines', 'Delta Air Lines', 'American Airlines'],
  CA: ['Air Canada', 'WestJet'],
  GB: ['British Airways', 'Virgin Atlantic'],
  FR: ['Air France', 'Lufthansa'],
  DE: ['Lufthansa', 'Condor'],
  IT: ['ITA Airways', 'Lufthansa'],
  ES: ['Iberia', 'Air Europa'],
  NL: ['KLM', 'Lufthansa'],
  CH: ['Swiss International Air Lines', 'Edelweiss Air'],
  AU: ['Qantas', 'Virgin Australia'],
  NZ: ['Air New Zealand', 'Qantas'],
  IN: ['Air India', 'IndiGo', 'Vistara'],
  JP: ['Japan Airlines', 'ANA'],
  KR: ['Korean Air', 'Asiana Airlines'],
  SG: ['Singapore Airlines', 'Scoot'],
  TH: ['Thai Airways', 'Thai AirAsia'],
  MY: ['Malaysia Airlines', 'AirAsia'],
  ID: ['Garuda Indonesia', 'AirAsia'],
  PH: ['Philippine Airlines', 'Cebu Pacific'],
  VN: ['Vietnam Airlines', 'VietJet Air'],
  AE: ['Emirates', 'flydubai'],
  SA: ['Saudia', 'flynas'],
  QA: ['Qatar Airways'],
  KW: ['Kuwait Airways', 'Jazeera Airways'],
  ZA: ['South African Airways', 'Emirates'],
  BR: ['LATAM Airlines', 'Emirates'],
  MX: ['Aeroméxico', 'Volaris'],
};
