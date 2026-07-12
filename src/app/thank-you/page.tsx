import type { Metadata } from 'next';
import Link from 'next/link';
import ThankYouTracker from './ThankYouTracker';
import ThankYouActions from './ThankYouActions';

export const metadata: Metadata = {
  title: 'Thank You',
  robots: { index: false },
};

const COPY: Record<string, { heading: string; body: string }> = {
  quote: {
    heading: 'Your quote request is in!',
    body: 'A travel consultant will review your request and get back to you shortly — usually the same day. Want it faster? Call or WhatsApp us now.',
  },
  contact: {
    heading: 'Message received!',
    body: "We'll get back to you shortly. Want it faster? Call or WhatsApp us now.",
  },
  default: {
    heading: 'Thank you!',
    body: "We've received your request and will be in touch shortly.",
  },
};

export default async function ThankYouPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const copy = COPY[type ?? 'default'] ?? COPY.default;

  return (
    <div className="flex-1 max-w-lg w-full mx-auto px-4 md:px-8 pt-32 lg:pt-28 pb-20 text-center flex flex-col items-center">
      <ThankYouTracker type={type} />
      <div className="w-16 h-16 bg-emerald-950/40 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 mb-6">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-9 h-9">
          <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h1 className="font-display text-3xl md:text-4xl text-white font-medium mb-3">{copy.heading}</h1>
      <p className="text-neutral-400 text-sm max-w-sm mb-8">{copy.body}</p>

      <ThankYouActions />

      <Link href="/" className="text-xs font-bold text-neutral-500 hover:text-white transition-colors mt-8">
        ← Back to homepage
      </Link>
    </div>
  );
}
