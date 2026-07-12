import type { Metadata } from 'next';
import AIPlannerChat from '@/components/ai/AIPlannerChat';

export const metadata: Metadata = {
  title: 'AI Travel Planner — Flight, Hotel & Package Suggestions',
  description: 'Describe your trip and get a custom itinerary with flight tickets, hotel, and tour package suggestions from our AI travel assistant.',
  alternates: { canonical: '/ai-planner' },
  openGraph: {
    title: 'AI Travel Planner — Flight, Hotel & Package Suggestions | Ticketing-Info',
    description: 'Describe your trip and get a custom itinerary with flight, hotel, and tour package suggestions from our AI travel assistant.',
  },
};

export default async function AIPlannerPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 pt-28 lg:pt-24 pb-12">
      <h1 className="sr-only">AI Travel Planner — Flight, Hotel & Package Suggestions</h1>
      <AIPlannerChat initialQuery={q} />
    </div>
  );
}
