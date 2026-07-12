import type { Metadata } from 'next';
import HeroSection from '@/components/layout/HeroSection';
import FlightSearch from '@/components/search/FlightSearch';
import { HERO_COPY } from '@/lib/nav';

export const metadata: Metadata = {
  title: 'Flight Tickets — Domestic & International Fares Compared',
  description:
    'Book flight tickets for domestic and international travel. Compare fares, stops, and baggage across hundreds of routes and cabin classes, then book with a real travel consultant.',
  alternates: { canonical: '/flights' },
  openGraph: {
    title: 'Flight Tickets — Domestic & International Fares Compared | Ticketing-Info',
    description:
      'Book flight tickets for domestic and international travel. Compare fares, stops, and baggage across hundreds of routes, then book with a real travel consultant.',
  },
};

export default function FlightsPage() {
  const hero = HERO_COPY['/flights'];
  return (
    <div className="flex-1 flex flex-col">
      <HeroSection eyebrow={hero.eyebrow} title={hero.title} sub={hero.sub} />
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 relative z-20 -mt-20 md:-mt-16 pb-16">
        <FlightSearch />
      </div>
    </div>
  );
}
