import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  robots: { index: false },
  alternates: { canonical: '/legal/terms' },
};

export default function TermsPage() {
  return (
    <div className="flex-1 max-w-3xl w-full mx-auto px-4 md:px-8 pt-28 lg:pt-24 pb-16">
      <h1 className="font-display text-4xl text-white font-medium mb-6">Terms of Service</h1>
      <div className="bg-amber-950/20 border border-amber-500/20 rounded-2xl p-5 mb-8 text-sm text-amber-200">
        Placeholder — this page needs real terms drafted with your legal counsel before launch, covering that prices shown
        are indicative estimates (not final until confirmed by a consultant), that bookings are not instant/paid online yet,
        cancellation policy, and liability terms for the travel services being resold.
      </div>
      <p className="text-neutral-400 text-sm">Prices shown on this site are indicative and subject to confirmation by a travel consultant. No booking is final until confirmed and paid for through the agreed offline process.</p>
    </div>
  );
}
