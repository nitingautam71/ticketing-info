export type CabinClass = 'Economy' | 'Premium Economy' | 'Business' | 'First';

export interface Flight {
  id: string;
  airline: string;
  airlineLogo: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  stopoverAirports?: string[];
  price: number;
  class: CabinClass;
  baggage: string;
}

export interface FlightSearchParams {
  from: string;
  to: string;
  date: string;
  cabinClass: CabinClass;
}

interface FlightProvider {
  search(params: FlightSearchParams): Promise<Flight[]>;
}

const AIRLINES = [
  { name: 'Delta Air Lines', logo: 'DL', bag: '1 Carry-on, 1 Checked bag free' },
  { name: 'United Airlines', logo: 'UA', bag: '1 Carry-on, checked bag $30' },
  { name: 'American Airlines', logo: 'AA', bag: '1 Carry-on, 1 Checked bag free' },
  { name: 'British Airways', logo: 'BA', bag: '2 Checked bags free' },
  { name: 'Singapore Airlines', logo: 'SQ', bag: '2 Checked bags free' },
  { name: 'Emirates', logo: 'EK', bag: '2 Checked bags free' },
  { name: 'Lufthansa', logo: 'LH', bag: '1 Checked bag free' },
];

const AIRPORTS: Record<string, string> = {
  JFK: 'New York JFK',
  LHR: 'London Heathrow',
  HND: 'Tokyo Haneda',
  SFO: 'San Francisco',
  CDG: 'Paris Charles de Gaulle',
  DXB: 'Dubai Intl',
  SIN: 'Singapore Changi',
  LAX: 'Los Angeles Intl',
  ORD: "Chicago O'Hare",
};

/**
 * Placeholder provider generating realistic-looking search results so the
 * lead-gen MVP can ship before a real supplier (Amadeus, Duffel, etc.) is
 * contracted. Swap `flightProvider` below for a real adapter later — nothing
 * else in the app needs to change.
 */
class MockFlightProvider implements FlightProvider {
  async search({ from, to, cabinClass }: FlightSearchParams): Promise<Flight[]> {
    const fCode = (from || 'JFK').toUpperCase();
    const tCode = (to || 'LHR').toUpperCase();

    const results: Flight[] = [];
    const count = 5 + Math.floor(Math.random() * 4);

    for (let i = 0; i < count; i++) {
      const airline = AIRLINES[Math.floor(Math.random() * AIRLINES.length)];
      const flNum = Math.floor(100 + Math.random() * 899);
      const depHour = 6 + Math.floor(Math.random() * 15);
      const depMin = Math.random() > 0.5 ? '30' : '00';
      const durationHours = 4 + Math.floor(Math.random() * 10);
      const durationMins = Math.random() > 0.5 ? '45' : '15';
      const arrHour = (depHour + durationHours) % 24;
      const depTime = `${depHour.toString().padStart(2, '0')}:${depMin} ${depHour >= 12 ? 'PM' : 'AM'}`;
      const arrTime = `${arrHour.toString().padStart(2, '0')}:${durationMins} ${arrHour >= 12 ? 'PM' : 'AM'}`;

      const stops = Math.random() > 0.6 ? 1 : 0;
      const stopovers = stops === 1 ? [Object.keys(AIRPORTS).find((k) => k !== fCode && k !== tCode) || 'ORD'] : [];

      let basePrice = 250 + Math.floor(Math.random() * 600);
      if (cabinClass === 'Premium Economy') basePrice *= 1.5;
      if (cabinClass === 'Business') basePrice *= 3;
      if (cabinClass === 'First') basePrice *= 5;

      results.push({
        id: `FL-${fCode}-${tCode}-${flNum}-${i}`,
        airline: airline.name,
        airlineLogo: airline.logo,
        flightNumber: `${airline.logo}${flNum}`,
        departureAirport: fCode,
        arrivalAirport: tCode,
        departureTime: depTime,
        arrivalTime: arrTime,
        duration: `${durationHours}h ${durationMins}m`,
        stops,
        stopoverAirports: stopovers,
        price: Math.floor(basePrice),
        class: cabinClass,
        baggage: airline.bag,
      });
    }

    return results.sort((a, b) => a.price - b.price);
  }
}

export const flightProvider: FlightProvider = new MockFlightProvider();

export function airportName(code: string): string {
  return AIRPORTS[code.toUpperCase()] || code.toUpperCase();
}

export async function searchFlights(params: FlightSearchParams): Promise<Flight[]> {
  return flightProvider.search(params);
}
