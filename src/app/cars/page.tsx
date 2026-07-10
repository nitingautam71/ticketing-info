import type { Metadata } from 'next';
import HeroSection from '@/components/layout/HeroSection';
import CarSearch from '@/components/search/CarSearch';
import { HERO_COPY } from '@/lib/nav';

export const metadata: Metadata = {
  title: 'Car Rental Search — Airport & City Pickup',
  description: 'Search car rentals with airport and city pickup, compare categories and providers, then book with a real travel consultant.',
  alternates: { canonical: '/cars' },
};

export default function CarsPage() {
  const hero = HERO_COPY['/cars'];
  return (
    <div className="flex-1 flex flex-col">
      <HeroSection eyebrow={hero.eyebrow} title={hero.title} sub={hero.sub} />
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 relative z-20 -mt-20 md:-mt-16 pb-16">
        <CarSearch />
      </div>
    </div>
  );
}
