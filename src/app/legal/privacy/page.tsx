import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  robots: { index: false },
  alternates: { canonical: '/legal/privacy' },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex-1 max-w-3xl w-full mx-auto px-4 md:px-8 pt-28 lg:pt-24 pb-16">
      <h1 className="font-display text-4xl text-white font-medium mb-6">Privacy Policy</h1>
      <div className="bg-amber-950/20 border border-amber-500/20 rounded-2xl p-5 mb-8 text-sm text-amber-200">
        Placeholder — this page needs real privacy policy text reviewed by counsel before launch. It should cover what
        data is collected via enquiry forms and the AI planner, how it&apos;s stored, third parties involved (e.g. Google Gemini
        for AI chat), retention, and user rights.
      </div>
      <p className="text-neutral-400 text-sm">This site collects contact details you submit through booking enquiries, the contact form, and the AI travel planner chat, in order to respond to your travel requests.</p>
    </div>
  );
}
