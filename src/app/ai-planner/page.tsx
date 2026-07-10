import type { Metadata } from 'next';
import AIPlannerChat from '@/components/ai/AIPlannerChat';

export const metadata: Metadata = {
  title: 'AI Travel Planner',
  description: 'Describe your trip and get a custom itinerary, flight, and hotel suggestions from our AI travel assistant.',
  alternates: { canonical: '/ai-planner' },
};

export default async function AIPlannerPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 pt-28 lg:pt-24 pb-12">
      <AIPlannerChat initialQuery={q} />
    </div>
  );
}
