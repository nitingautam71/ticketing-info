import type { Metadata } from 'next';
import HeroSection from '@/components/layout/HeroSection';
import InsuranceSearch from '@/components/search/InsuranceSearch';
import { HERO_COPY } from '@/lib/nav';

export const metadata: Metadata = {
  title: 'Travel Insurance — Medical, Cancellation & Baggage Cover',
  description: 'Compare travel insurance tiers covering medical emergencies, trip cancellation, and lost baggage, then purchase with a real travel consultant.',
  alternates: { canonical: '/insurance' },
};

export default function InsurancePage() {
  const hero = HERO_COPY['/insurance'];
  return (
    <div className="flex-1 flex flex-col">
      <HeroSection eyebrow={hero.eyebrow} title={hero.title} sub={hero.sub} />
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 relative z-20 -mt-20 md:-mt-16 pb-16">
        <InsuranceSearch />
      </div>
    </div>
  );
}
