export interface CruiseItineraryStop {
  day: number;
  port: string;
  activities: string;
}

export interface CruiseCabin {
  type: string;
  price: number;
  description: string;
}

export interface Cruise {
  id: string;
  name: string;
  cruiseLine: string;
  departurePort: string;
  durationDays: number;
  price: number;
  image: string;
  rating: number;
  itinerary: CruiseItineraryStop[];
  cabins: CruiseCabin[];
}

interface CruiseProvider {
  search(): Promise<Cruise[]>;
}

const CRUISES: Cruise[] = [
  {
    id: 'CR-101',
    name: 'Bahamas Royal Escape',
    cruiseLine: 'Royal Caribbean',
    departurePort: 'Miami, FL',
    durationDays: 7,
    price: 699,
    image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800&auto=format&fit=crop&q=60',
    rating: 4.7,
    itinerary: [
      { day: 1, port: 'Miami, FL', activities: 'Boarding and Welcome Gala.' },
      { day: 2, port: 'At Sea', activities: 'Relaxation, pool parties, evening Broadway show.' },
      { day: 3, port: 'Nassau, Bahamas', activities: 'Snorkeling, beach resorts, duty-free shopping.' },
      { day: 4, port: 'Perfect Day at CocoCay', activities: 'Waterpark, private cabanas, zip-lining.' },
      { day: 5, port: 'At Sea', activities: 'Casino night, gourmet fine dining experience.' },
      { day: 6, port: 'Key West, FL', activities: 'Historic town tours, sunset celebration.' },
      { day: 7, port: 'Miami, FL', activities: 'Disembarkation.' },
    ],
    cabins: [
      { type: 'Interior Stateroom', price: 699, description: 'Cozy and cost-effective, two twin beds, desk.' },
      { type: 'Oceanview Stateroom', price: 899, description: 'Elegant cabin with a large window facing the crystal oceans.' },
      { type: 'Grand Balcony Suite', price: 1499, description: 'Luxurious private balcony, spacious living lounge, premium concierge.' },
    ],
  },
  {
    id: 'CR-202',
    name: 'Mediterranean Wonders',
    cruiseLine: 'Celebrity Cruises',
    departurePort: 'Barcelona, Spain',
    durationDays: 10,
    price: 1399,
    image: 'https://images.unsplash.com/photo-1511316695145-4992006ffddb?w=800&auto=format&fit=crop&q=60',
    rating: 4.9,
    itinerary: [
      { day: 1, port: 'Barcelona, Spain', activities: 'Embarkation.' },
      { day: 2, port: 'Marseille, France', activities: 'Provence historical village exploration.' },
      { day: 3, port: 'Nice (Villefranche), France', activities: 'Stroll along French Riviera / Monaco.' },
      { day: 4, port: 'Florence/Pisa, Italy', activities: 'Tuscany wine tasting, Leaning Tower visits.' },
      { day: 5, port: 'Rome (Civitavecchia), Italy', activities: 'Colosseum and Vatican City sightseeing.' },
      { day: 6, port: 'Naples/Capri, Italy', activities: 'Pompeii exploration, Capri boat ride.' },
      { day: 7, port: 'At Sea', activities: 'On-deck spa relaxation, astronomical stargazing.' },
      { day: 8, port: 'Mykonos, Greece', activities: 'Iconic windmills, seaside lunch.' },
      { day: 9, port: 'Athens, Greece', activities: 'Acropolis and Parthenon exploration.' },
      { day: 10, port: 'Athens, Greece', activities: 'Disembarkation.' },
    ],
    cabins: [
      { type: 'Standard Stateroom', price: 1399, description: 'Cozy bed, complete amenities.' },
      { type: 'Ocean View Balcony', price: 1899, description: 'Private balcony facing beautiful European coastlines.' },
      { type: 'Ultra Suite', price: 2999, description: 'Enormous living area, personal butler service, fine luxury.' },
    ],
  },
];

class MockCruiseProvider implements CruiseProvider {
  async search(): Promise<Cruise[]> {
    return CRUISES;
  }
}

export const cruiseProvider: CruiseProvider = new MockCruiseProvider();

export async function searchCruises(): Promise<Cruise[]> {
  return cruiseProvider.search();
}

export async function getCruiseById(id: string): Promise<Cruise | undefined> {
  const all = await searchCruises();
  return all.find((c) => c.id === id);
}
