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
  class: 'Economy' | 'Premium Economy' | 'Business' | 'First';
  baggage: string;
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
  roomTypes: {
    name: string;
    price: number;
    description: string;
    capacity: number;
  }[];
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
  itinerary: {
    day: number;
    port: string;
    activities: string;
  }[];
  cabins: {
    type: string;
    price: number;
    description: string;
  }[];
}

export interface Train {
  id: string;
  operator: string;
  trainNumber: string;
  departureStation: string;
  arrivalStation: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  classes: {
    name: string;
    price: number;
  }[];
}

export interface RentalCar {
  id: string;
  provider: string;
  model: string;
  category: 'Economy' | 'SUV' | 'Luxury' | 'Convertible';
  seats: number;
  transmission: 'Automatic' | 'Manual';
  pricePerDay: number;
  image: string;
  rating: number;
}

export interface Transfer {
  id: string;
  type: 'Private Sedan' | 'SUV SUV' | 'Luxury Limo' | 'Shared Shuttle';
  capacity: number;
  price: number;
  duration: string;
  description: string;
}

export interface InsurancePlan {
  id: string;
  name: string;
  tier: 'Basic' | 'Premium' | 'Elite';
  price: number;
  medicalCoverage: string;
  tripCancellation: string;
  luggageCoverage: string;
  description: string;
}

export interface VisaInfo {
  destinationCountry: string;
  visaRequired: boolean;
  maxStayDays?: number;
  processingTime?: string;
  fee?: number;
  requirements?: string[];
}

export interface Booking {
  id: string;
  type: 'flight' | 'hotel' | 'cruise' | 'train' | 'rental' | 'transfer' | 'insurance' | 'visa' | 'package';
  title: string;
  subtitle: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  price: number;
  date: string;
  details: any;
  qrCode?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestions?: {
    type: 'flight' | 'hotel' | 'itinerary';
    data: any;
  }[];
}

export interface UserProfile {
  name: string;
  email: string;
  passportNumber: string;
  passportExpiry: string;
  nationality: string;
  preferences: {
    dietary: string;
    seating: 'Window' | 'Aisle' | 'No Preference';
    hotelRoom: string;
  };
}
