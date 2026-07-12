import type { Metadata } from 'next';
import HeroSection from '@/components/layout/HeroSection';
import TrainSearch from '@/components/search/TrainSearch';
import { HERO_COPY } from '@/lib/nav';

export const metadata: Metadata = {
  title: 'Train Tickets — Domestic Rail & Scenic Routes',
  description:
    'Book train tickets for domestic rail journeys and scenic international routes, including senior citizen and family fare options, then book with a real travel consultant.',
  alternates: { canonical: '/trains' },
  openGraph: {
    title: 'Train Tickets — Domestic Rail & Scenic Routes | Ticketing-Info',
    description: 'Book train tickets for domestic rail journeys and scenic international routes, then book with a real travel consultant.',
  },
};

export default function TrainsPage() {
  const hero = HERO_COPY['/trains'];
  return (
    <div className="flex-1 flex flex-col">
      <HeroSection eyebrow={hero.eyebrow} title={hero.title} sub={hero.sub} />
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 relative z-20 -mt-20 md:-mt-16 pb-16">
        <TrainSearch />
      </div>
    </div>
  );
}
