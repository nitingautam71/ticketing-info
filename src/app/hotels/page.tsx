import type { Metadata } from 'next';
import HeroSection from '@/components/layout/HeroSection';
import HotelSearch from '@/components/search/HotelSearch';
import { HERO_COPY } from '@/lib/nav';

export const metadata: Metadata = {
  title: 'Hotel Booking — Compare Stays Worldwide',
  description:
    'Book hotels worldwide for domestic and international trips. Compare ratings, amenities, and room types, then book with a real travel consultant.',
  alternates: { canonical: '/hotels' },
  openGraph: {
    title: 'Hotel Booking — Compare Stays Worldwide | Ticketing-Info',
    description: 'Book hotels worldwide for domestic and international trips. Compare ratings, amenities, and room types, then book with a real travel consultant.',
  },
};

export default function HotelsPage() {
  const hero = HERO_COPY['/hotels'];
  return (
    <div className="flex-1 flex flex-col">
      <HeroSection eyebrow={hero.eyebrow} title={hero.title} sub={hero.sub} />
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 relative z-20 -mt-20 md:-mt-16 pb-16">
        <HotelSearch />
      </div>
    </div>
  );
}
