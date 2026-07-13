import type { RentalLocation } from './types';

// Worldwide rental pickup/drop-off locations: international airports, downtown offices,
// cruise-port desks (aligned with the cruise vertical's ports), and rail stations.
// costIndex scales the pricing engine per market; oneWaySupported/crossBorderAllowed
// gate the corresponding fees and policies in the generator.

function loc(
  id: string, name: string, type: RentalLocation['type'], city: string, country: string, countryCode: string,
  region: RentalLocation['region'], lat: number, lon: number, currency: string, costIndex: number,
  opts: { airportCode?: string; oneWay?: boolean; crossBorder?: boolean } = {}
): RentalLocation {
  return {
    id, name, slug: id, type, city, country, countryCode, region, lat, lon, currency, costIndex,
    airportCode: opts.airportCode,
    oneWaySupported: opts.oneWay ?? true,
    crossBorderAllowed: opts.crossBorder ?? false,
  };
}

export const LOCATIONS: RentalLocation[] = [
  // ---- North America: airports ----
  loc('jfk-airport', 'New York JFK International Airport', 'airport', 'New York', 'United States', 'US', 'north-america', 40.6413, -73.7781, 'USD', 1.35, { airportCode: 'JFK' }),
  loc('lax-airport', 'Los Angeles International Airport', 'airport', 'Los Angeles', 'United States', 'US', 'north-america', 33.9416, -118.4085, 'USD', 1.25, { airportCode: 'LAX' }),
  loc('mia-airport', 'Miami International Airport', 'airport', 'Miami', 'United States', 'US', 'north-america', 25.7959, -80.287, 'USD', 1.2, { airportCode: 'MIA' }),
  loc('ord-airport', "Chicago O'Hare International Airport", 'airport', 'Chicago', 'United States', 'US', 'north-america', 41.9742, -87.9073, 'USD', 1.2, { airportCode: 'ORD' }),
  loc('mco-airport', 'Orlando International Airport', 'airport', 'Orlando', 'United States', 'US', 'north-america', 28.4312, -81.3081, 'USD', 1.1, { airportCode: 'MCO' }),
  loc('las-airport', 'Las Vegas Harry Reid International Airport', 'airport', 'Las Vegas', 'United States', 'US', 'north-america', 36.086, -115.1539, 'USD', 1.1, { airportCode: 'LAS' }),
  loc('sfo-airport', 'San Francisco International Airport', 'airport', 'San Francisco', 'United States', 'US', 'north-america', 37.6213, -122.379, 'USD', 1.35, { airportCode: 'SFO' }),
  loc('dfw-airport', 'Dallas/Fort Worth International Airport', 'airport', 'Dallas', 'United States', 'US', 'north-america', 32.8998, -97.0403, 'USD', 1.1, { airportCode: 'DFW' }),
  loc('sea-airport', 'Seattle-Tacoma International Airport', 'airport', 'Seattle', 'United States', 'US', 'north-america', 47.4502, -122.3088, 'USD', 1.2, { airportCode: 'SEA' }),
  loc('yyz-airport', 'Toronto Pearson International Airport', 'airport', 'Toronto', 'Canada', 'CA', 'north-america', 43.6777, -79.6248, 'CAD', 1.15, { airportCode: 'YYZ', crossBorder: true }),
  loc('yvr-airport', 'Vancouver International Airport', 'airport', 'Vancouver', 'Canada', 'CA', 'north-america', 49.1967, -123.1815, 'CAD', 1.15, { airportCode: 'YVR', crossBorder: true }),
  loc('mex-airport', 'Mexico City International Airport', 'airport', 'Mexico City', 'Mexico', 'MX', 'north-america', 19.4363, -99.0721, 'MXN', 0.75, { airportCode: 'MEX' }),
  loc('cun-airport', 'Cancún International Airport', 'airport', 'Cancún', 'Mexico', 'MX', 'north-america', 21.0365, -86.8771, 'MXN', 0.85, { airportCode: 'CUN' }),

  // ---- North America: city / cruise / rail ----
  loc('manhattan-downtown', 'Manhattan Midtown Office', 'downtown', 'New York', 'United States', 'US', 'north-america', 40.7549, -73.984, 'USD', 1.45),
  loc('miami-cruise-port', 'PortMiami Cruise Terminal Desk', 'cruise-port', 'Miami', 'United States', 'US', 'north-america', 25.7781, -80.1774, 'USD', 1.25),
  loc('la-downtown', 'Downtown Los Angeles Office', 'downtown', 'Los Angeles', 'United States', 'US', 'north-america', 34.0407, -118.2468, 'USD', 1.2),
  loc('orlando-downtown', 'Orlando International Drive Office', 'city-office', 'Orlando', 'United States', 'US', 'north-america', 28.4744, -81.4679, 'USD', 1.0),
  loc('toronto-union-station', 'Toronto Union Station Rail Desk', 'rail-station', 'Toronto', 'Canada', 'CA', 'north-america', 43.6453, -79.3806, 'CAD', 1.1, { crossBorder: true }),

  // ---- Europe: airports ----
  loc('lhr-airport', 'London Heathrow Airport', 'airport', 'London', 'United Kingdom', 'GB', 'europe', 51.47, -0.4543, 'GBP', 1.3, { airportCode: 'LHR', crossBorder: true }),
  loc('lgw-airport', 'London Gatwick Airport', 'airport', 'London', 'United Kingdom', 'GB', 'europe', 51.1537, -0.1821, 'GBP', 1.2, { airportCode: 'LGW', crossBorder: true }),
  loc('cdg-airport', 'Paris Charles de Gaulle Airport', 'airport', 'Paris', 'France', 'FR', 'europe', 49.0097, 2.5479, 'EUR', 1.25, { airportCode: 'CDG', crossBorder: true }),
  loc('fra-airport', 'Frankfurt Airport', 'airport', 'Frankfurt', 'Germany', 'DE', 'europe', 50.0379, 8.5622, 'EUR', 1.2, { airportCode: 'FRA', crossBorder: true }),
  loc('muc-airport', 'Munich Airport', 'airport', 'Munich', 'Germany', 'DE', 'europe', 48.3538, 11.7861, 'EUR', 1.2, { airportCode: 'MUC', crossBorder: true }),
  loc('mad-airport', 'Madrid-Barajas Airport', 'airport', 'Madrid', 'Spain', 'ES', 'europe', 40.4983, -3.5676, 'EUR', 1.0, { airportCode: 'MAD', crossBorder: true }),
  loc('bcn-airport', 'Barcelona-El Prat Airport', 'airport', 'Barcelona', 'Spain', 'ES', 'europe', 41.2974, 2.0833, 'EUR', 1.05, { airportCode: 'BCN', crossBorder: true }),
  loc('fco-airport', 'Rome Fiumicino Airport', 'airport', 'Rome', 'Italy', 'IT', 'europe', 41.8003, 12.2389, 'EUR', 1.1, { airportCode: 'FCO', crossBorder: true }),
  loc('mxp-airport', 'Milan Malpensa Airport', 'airport', 'Milan', 'Italy', 'IT', 'europe', 45.63, 8.7231, 'EUR', 1.1, { airportCode: 'MXP', crossBorder: true }),
  loc('ams-airport', 'Amsterdam Schiphol Airport', 'airport', 'Amsterdam', 'Netherlands', 'NL', 'europe', 52.3105, 4.7683, 'EUR', 1.25, { airportCode: 'AMS', crossBorder: true }),
  loc('zrh-airport', 'Zurich Airport', 'airport', 'Zurich', 'Switzerland', 'CH', 'europe', 47.4582, 8.5555, 'CHF', 1.5, { airportCode: 'ZRH', crossBorder: true }),
  loc('vie-airport', 'Vienna International Airport', 'airport', 'Vienna', 'Austria', 'AT', 'europe', 48.1103, 16.5697, 'EUR', 1.15, { airportCode: 'VIE', crossBorder: true }),
  loc('lis-airport', 'Lisbon Humberto Delgado Airport', 'airport', 'Lisbon', 'Portugal', 'PT', 'europe', 38.7756, -9.1354, 'EUR', 0.95, { airportCode: 'LIS', crossBorder: true }),
  loc('ath-airport', 'Athens International Airport', 'airport', 'Athens', 'Greece', 'GR', 'europe', 37.9364, 23.9445, 'EUR', 0.95, { airportCode: 'ATH' }),
  loc('dub-airport', 'Dublin Airport', 'airport', 'Dublin', 'Ireland', 'IE', 'europe', 53.4264, -6.2499, 'EUR', 1.15, { airportCode: 'DUB' }),
  loc('ist-airport', 'Istanbul Airport', 'airport', 'Istanbul', 'Turkey', 'TR', 'europe', 41.2753, 28.7519, 'TRY', 0.8, { airportCode: 'IST' }),
  loc('ayt-airport', 'Antalya Airport', 'airport', 'Antalya', 'Turkey', 'TR', 'europe', 36.8987, 30.8005, 'TRY', 0.75, { airportCode: 'AYT' }),

  // ---- Europe: rail / cruise / city ----
  loc('st-pancras-rail', 'London St Pancras International Rail Desk', 'rail-station', 'London', 'United Kingdom', 'GB', 'europe', 51.5322, -0.1263, 'GBP', 1.25, { crossBorder: true }),
  loc('gare-de-lyon-rail', 'Paris Gare de Lyon Rail Desk', 'rail-station', 'Paris', 'France', 'FR', 'europe', 48.8443, 2.3743, 'EUR', 1.2, { crossBorder: true }),
  loc('berlin-hbf-rail', 'Berlin Hauptbahnhof Rail Desk', 'rail-station', 'Berlin', 'Germany', 'DE', 'europe', 52.525, 13.3694, 'EUR', 1.1, { crossBorder: true }),
  loc('barcelona-cruise-port', 'Barcelona Cruise Terminal Desk', 'cruise-port', 'Barcelona', 'Spain', 'ES', 'europe', 41.3772, 2.1812, 'EUR', 1.1, { crossBorder: true }),
  loc('civitavecchia-cruise-port', 'Civitavecchia (Rome) Cruise Terminal Desk', 'cruise-port', 'Rome', 'Italy', 'IT', 'europe', 42.0963, 11.7891, 'EUR', 1.1),
  loc('paris-downtown', 'Paris Opéra District Office', 'downtown', 'Paris', 'France', 'FR', 'europe', 48.8709, 2.3323, 'EUR', 1.25, { crossBorder: true }),
  loc('rome-downtown', 'Rome Termini District Office', 'downtown', 'Rome', 'Italy', 'IT', 'europe', 41.9011, 12.5011, 'EUR', 1.05, { crossBorder: true }),

  // ---- Middle East ----
  loc('dxb-airport', 'Dubai International Airport', 'airport', 'Dubai', 'United Arab Emirates', 'AE', 'middle-east', 25.2532, 55.3657, 'AED', 1.15, { airportCode: 'DXB' }),
  loc('dubai-downtown', 'Dubai Downtown / Sheikh Zayed Road Office', 'downtown', 'Dubai', 'United Arab Emirates', 'AE', 'middle-east', 25.2048, 55.2708, 'AED', 1.1),
  loc('auh-airport', 'Abu Dhabi Zayed International Airport', 'airport', 'Abu Dhabi', 'United Arab Emirates', 'AE', 'middle-east', 24.4539, 54.6511, 'AED', 1.1, { airportCode: 'AUH' }),
  loc('doh-airport', 'Doha Hamad International Airport', 'airport', 'Doha', 'Qatar', 'QA', 'middle-east', 25.2731, 51.6081, 'QAR', 1.15, { airportCode: 'DOH' }),
  loc('jed-airport', 'Jeddah King Abdulaziz International Airport', 'airport', 'Jeddah', 'Saudi Arabia', 'SA', 'middle-east', 21.6796, 39.1565, 'SAR', 1.0, { airportCode: 'JED' }),
  loc('tlv-airport', 'Tel Aviv Ben Gurion Airport', 'airport', 'Tel Aviv', 'Israel', 'IL', 'middle-east', 32.0055, 34.8854, 'ILS', 1.2, { airportCode: 'TLV' }),

  // ---- Asia ----
  loc('del-airport', 'Delhi Indira Gandhi International Airport', 'airport', 'New Delhi', 'India', 'IN', 'asia', 28.5562, 77.1, 'INR', 0.55, { airportCode: 'DEL' }),
  loc('bom-airport', 'Mumbai Chhatrapati Shivaji Maharaj International Airport', 'airport', 'Mumbai', 'India', 'IN', 'asia', 19.0896, 72.8656, 'INR', 0.55, { airportCode: 'BOM' }),
  loc('sin-airport', 'Singapore Changi Airport', 'airport', 'Singapore', 'Singapore', 'SG', 'asia', 1.3644, 103.9915, 'SGD', 1.35, { airportCode: 'SIN' }),
  loc('hnd-airport', 'Tokyo Haneda Airport', 'airport', 'Tokyo', 'Japan', 'JP', 'asia', 35.5494, 139.7798, 'JPY', 1.2, { airportCode: 'HND' }),
  loc('kix-airport', 'Osaka Kansai International Airport', 'airport', 'Osaka', 'Japan', 'JP', 'asia', 34.4342, 135.2328, 'JPY', 1.15, { airportCode: 'KIX' }),
  loc('icn-airport', 'Seoul Incheon International Airport', 'airport', 'Seoul', 'South Korea', 'KR', 'asia', 37.4602, 126.4407, 'KRW', 1.1, { airportCode: 'ICN' }),
  loc('bkk-airport', 'Bangkok Suvarnabhumi Airport', 'airport', 'Bangkok', 'Thailand', 'TH', 'asia', 13.69, 100.7501, 'THB', 0.65, { airportCode: 'BKK' }),
  loc('kul-airport', 'Kuala Lumpur International Airport', 'airport', 'Kuala Lumpur', 'Malaysia', 'MY', 'asia', 2.7456, 101.7099, 'MYR', 0.6, { airportCode: 'KUL' }),
  loc('hkg-airport', 'Hong Kong International Airport', 'airport', 'Hong Kong', 'Hong Kong SAR', 'HK', 'asia', 22.308, 113.9185, 'HKD', 1.3, { airportCode: 'HKG' }),
  loc('dps-airport', 'Bali Ngurah Rai International Airport', 'airport', 'Denpasar', 'Indonesia', 'ID', 'asia', -8.7482, 115.1672, 'IDR', 0.55, { airportCode: 'DPS' }),

  // ---- Oceania ----
  loc('syd-airport', 'Sydney Kingsford Smith Airport', 'airport', 'Sydney', 'Australia', 'AU', 'oceania', -33.9399, 151.1753, 'AUD', 1.2, { airportCode: 'SYD' }),
  loc('mel-airport', 'Melbourne Airport', 'airport', 'Melbourne', 'Australia', 'AU', 'oceania', -37.669, 144.841, 'AUD', 1.15, { airportCode: 'MEL' }),
  loc('akl-airport', 'Auckland Airport', 'airport', 'Auckland', 'New Zealand', 'NZ', 'oceania', -37.0082, 174.785, 'NZD', 1.15, { airportCode: 'AKL' }),
  loc('sydney-downtown', 'Sydney CBD Office', 'downtown', 'Sydney', 'Australia', 'AU', 'oceania', -33.8688, 151.2093, 'AUD', 1.15),

  // ---- South America ----
  loc('gru-airport', 'São Paulo/Guarulhos International Airport', 'airport', 'São Paulo', 'Brazil', 'BR', 'south-america', -23.4356, -46.4731, 'BRL', 0.7, { airportCode: 'GRU' }),
  loc('eze-airport', 'Buenos Aires Ezeiza International Airport', 'airport', 'Buenos Aires', 'Argentina', 'AR', 'south-america', -34.8222, -58.5358, 'ARS', 0.65, { airportCode: 'EZE' }),
  loc('scl-airport', 'Santiago Arturo Merino Benítez Airport', 'airport', 'Santiago', 'Chile', 'CL', 'south-america', -33.393, -70.7858, 'CLP', 0.75, { airportCode: 'SCL' }),

  // ---- Africa ----
  loc('cpt-airport', 'Cape Town International Airport', 'airport', 'Cape Town', 'South Africa', 'ZA', 'africa', -33.9715, 18.6021, 'ZAR', 0.7, { airportCode: 'CPT' }),
  loc('jnb-airport', 'Johannesburg O.R. Tambo International Airport', 'airport', 'Johannesburg', 'South Africa', 'ZA', 'africa', -26.1367, 28.246, 'ZAR', 0.7, { airportCode: 'JNB' }),
  loc('cmn-airport', 'Casablanca Mohammed V International Airport', 'airport', 'Casablanca', 'Morocco', 'MA', 'africa', 33.3675, -7.5898, 'MAD', 0.6, { airportCode: 'CMN' }),
  loc('nbo-airport', 'Nairobi Jomo Kenyatta International Airport', 'airport', 'Nairobi', 'Kenya', 'KE', 'africa', -1.3192, 36.9278, 'KES', 0.65, { airportCode: 'NBO' }),
];

export const LOCATIONS_BY_ID: Record<string, RentalLocation> = Object.fromEntries(LOCATIONS.map((l) => [l.id, l]));
