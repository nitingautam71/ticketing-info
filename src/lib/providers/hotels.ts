export interface HotelRoomType {
  name: string;
  price: number;
  description: string;
  capacity: number;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewsCount: number;
  stars: number;
  pricePerNight: number;
  image: string;
  amenities: string[];
  roomTypes: HotelRoomType[];
}

export interface HotelSearchParams {
  location: string;
}

interface HotelProvider {
  search(params: HotelSearchParams): Promise<Hotel[]>;
}

const HOTEL_BRANDS = [
  { name: 'Grand Plaza Resort', rating: 4.6, reviews: 1250, stars: 5, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=60' },
  { name: 'Vanguard Boutique Hotel', rating: 4.8, reviews: 420, stars: 4, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop&q=60' },
  { name: 'Royal Palace Suite', rating: 4.9, reviews: 890, stars: 5, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=60' },
  { name: 'Comfort Inn & Executive Suites', rating: 4.2, reviews: 2100, stars: 3, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop&q=60' },
  { name: 'The Meridian Luxury Lodge', rating: 4.7, reviews: 670, stars: 5, image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&auto=format&fit=crop&q=60' },
  { name: 'Apex Urban Residences', rating: 4.5, reviews: 1530, stars: 4, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=60' },
];

const AMENITIES = ['Free WiFi', 'Infinity Pool', 'Full Gym', 'Room Service', 'Spa Center', 'Free Breakfast', 'Airport Shuttle', 'Michelin Star Dining'];

class MockHotelProvider implements HotelProvider {
  async search({ location }: HotelSearchParams): Promise<Hotel[]> {
    return HOTEL_BRANDS.map((b, idx) => {
      const price = 120 + Math.floor(Math.random() * 380);
      const selected = AMENITIES.filter(() => Math.random() > 0.4);
      if (selected.length === 0) selected.push('Free WiFi');

      return {
        id: `HTL-${idx}-${Math.floor(1000 + Math.random() * 9000)}`,
        name: b.name,
        location: location || 'London, United Kingdom',
        rating: b.rating,
        reviewsCount: b.reviews,
        stars: b.stars,
        pricePerNight: price,
        image: b.image,
        amenities: selected,
        roomTypes: [
          { name: 'Standard King Room', price, description: 'One King bed, modern bathroom, smart TV, city view.', capacity: 2 },
          { name: 'Executive Suite', price: Math.floor(price * 1.5), description: 'Spacious suite with separate living room, workspace, and VIP lounge access.', capacity: 3 },
          { name: 'Presidential Penthouse', price: Math.floor(price * 3), description: 'Top floor ultimate luxury, full panoramic glass windows, private balcony.', capacity: 4 },
        ],
      };
    });
  }
}

export const hotelProvider: HotelProvider = new MockHotelProvider();

export async function searchHotels(params: HotelSearchParams): Promise<Hotel[]> {
  return hotelProvider.search(params);
}
