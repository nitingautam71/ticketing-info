export type CarCategory = 'Economy' | 'SUV' | 'Luxury' | 'Convertible';

export interface RentalCar {
  id: string;
  provider: string;
  model: string;
  category: CarCategory;
  seats: number;
  transmission: 'Automatic' | 'Manual';
  pricePerDay: number;
  image: string;
  rating: number;
}

interface CarProvider {
  search(): Promise<RentalCar[]>;
}

const CARS: RentalCar[] = [
  { id: 'RC-1', provider: 'Hertz', model: 'Tesla Model 3', category: 'Luxury', seats: 5, transmission: 'Automatic', pricePerDay: 85, image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=60', rating: 4.8 },
  { id: 'RC-2', provider: 'Enterprise', model: 'Toyota RAV4', category: 'SUV', seats: 5, transmission: 'Automatic', pricePerDay: 65, image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=60', rating: 4.6 },
  { id: 'RC-3', provider: 'Avis', model: 'Ford Mustang Convertible', category: 'Convertible', seats: 4, transmission: 'Automatic', pricePerDay: 120, image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop&q=60', rating: 4.7 },
  { id: 'RC-4', provider: 'Budget', model: 'Hyundai Elantra', category: 'Economy', seats: 5, transmission: 'Automatic', pricePerDay: 39, image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=60', rating: 4.3 },
];

class MockCarProvider implements CarProvider {
  async search(): Promise<RentalCar[]> {
    return CARS;
  }
}

export const carProvider: CarProvider = new MockCarProvider();

export async function searchCars(): Promise<RentalCar[]> {
  return carProvider.search();
}
