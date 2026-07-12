import type { Metadata } from 'next';
import HeroSection from '@/components/layout/HeroSection';
import CruiseSearch from '@/components/search/CruiseSearch';
import { HERO_COPY } from '@/lib/nav';

export const metadata: Metadata = {
  title: 'Cruise Packages — Ocean Voyages & Cabin Classes',
  description: 'Browse cruise packages, itineraries, ports of call, and cabin classes for domestic and international sailings, then book with a real travel consultant.',
  alternates: { canonical: '/cruises' },
  openGraph: {
    title: 'Cruise Packages — Ocean Voyages & Cabin Classes | Ticketing-Info',
    description: 'Browse cruise packages, itineraries, ports of call, and cabin classes, then book with a real travel consultant.',
  },
};

export default function CruisesPage() {
  const hero = HERO_COPY['/cruises'];
  return (
    <div className="flex-1 flex flex-col">
      <HeroSection eyebrow={hero.eyebrow} title={hero.title} sub={hero.sub} />
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 relative z-20 -mt-20 md:-mt-16 pb-16">
        <CruiseSearch />
      </div>
    </div>
  );
}
