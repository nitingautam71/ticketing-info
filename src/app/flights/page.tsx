import type { Metadata } from 'next';
import HeroSection from '@/components/layout/HeroSection';
import FlightSearch from '@/components/search/FlightSearch';
import { HERO_COPY } from '@/lib/nav';

export const metadata: Metadata = {
  title: 'Flight Search — Compare Fares & Book with a Consultant',
  description: 'Search flights across hundreds of routes and cabin classes. Compare fares, stops, and baggage, then book with a real travel consultant.',
  alternates: { canonical: '/flights' },
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
