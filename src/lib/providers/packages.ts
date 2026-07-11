export interface VacationPackage {
  id: string;
  name: string;
  destination: string;
  durationDays: number;
  price: number;
  image: string;
  rating: number;
  includes: string[];
  highlights: string[];
}

export interface PackageSearchParams {
  destination: string;
}

interface PackageProvider {
  search(params: PackageSearchParams): Promise<VacationPackage[]>;
}

const BASE_PACKAGES: Omit<VacationPackage, 'id'>[] = [
  {
    name: 'Santorini Sunset Escape',
    destination: 'Santorini, Greece',
    durationDays: 6,
    price: 1899,
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop&q=60',
    rating: 4.9,
    includes: ['Round-trip flights', '5-star caldera-view hotel', 'Airport transfers', 'Daily breakfast', 'Travel insurance'],
    highlights: ['Oia sunset viewpoint', 'Volcano boat tour', 'Wine tasting in Pyrgos'],
  },
  {
    name: 'Tokyo & Kyoto Discovery',
    destination: 'Japan',
    durationDays: 9,
    price: 2799,
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop&q=60',
    rating: 4.8,
    includes: ['Round-trip flights', 'Bullet train transfers', '4-star hotels x2 cities', 'Guided city tours', 'Travel insurance'],
    highlights: ['Shibuya & Asakusa', 'Fushimi Inari shrine', 'Arashiyama bamboo grove'],
  },
  {
    name: 'Dubai Luxury Long Weekend',
    destination: 'Dubai, UAE',
    durationDays: 4,
    price: 1399,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop&q=60',
    rating: 4.7,
    includes: ['Round-trip flights', '5-star hotel', 'Private airport transfer', 'Desert safari tour', 'Travel insurance'],
    highlights: ['Burj Khalifa access', 'Desert safari & BBQ dinner', 'Dubai Marina cruise'],
  },
  {
    name: 'Bali Wellness Retreat',
    destination: 'Bali, Indonesia',
    durationDays: 7,
    price: 1599,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=60',
    rating: 4.9,
    includes: ['Round-trip flights', 'Private villa with pool', 'Daily yoga sessions', 'Airport transfers', 'Travel insurance'],
    highlights: ['Ubud rice terraces', 'Traditional spa day', 'Sunrise volcano trek'],
  },
];

class MockPackageProvider implements PackageProvider {
  async search({ destination }: PackageSearchParams): Promise<VacationPackage[]> {
    const filtered = destination
      ? BASE_PACKAGES.filter((p) => p.destination.toLowerCase().includes(destination.toLowerCase()))
      : BASE_PACKAGES;
    const list = filtered.length > 0 ? filtered : BASE_PACKAGES;
    return list.map((p, idx) => ({ ...p, id: `PKG-${idx}-${p.destination.slice(0, 3).toUpperCase()}` }));
  }
}

export const packageProvider: PackageProvider = new MockPackageProvider();

export async function searchPackages(params: PackageSearchParams): Promise<VacationPackage[]> {
  return packageProvider.search(params);
}
