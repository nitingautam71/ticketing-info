import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/seo/JsonLd';
import LandingCta from '@/components/seo/LandingCta';
import { breadcrumbJsonLd, faqPageJsonLd } from '@/lib/structuredData';

export const metadata: Metadata = {
  title: 'IRCTC Senior Citizen Train Ticket Discount — 2026 Status',
  description:
    "Is the IRCTC senior citizen train fare discount back in 2026? Here's the current status, who still qualifies for quota and lower-berth priority, and how to book correctly.",
  alternates: { canonical: '/trains/senior-citizen-train-ticket-discount' },
  openGraph: {
    title: 'IRCTC Senior Citizen Train Ticket Discount — 2026 Status | Ticketing-Info',
    description: "Is the IRCTC senior citizen train fare discount back in 2026? Here's the current status and how to book correctly.",
  },
};

const FAQS = [
  {
    question: 'Is the IRCTC senior citizen fare discount active in 2026?',
    answer:
      'No — the fare discount (previously 40% for men and 50% for women on most long-distance trains) was suspended in March 2020 and has not been reinstated as of 2026, despite ongoing budget discussion about restoring it. Senior citizens still get quota and lower-berth priority, but not a reduced fare.',
  },
  {
    question: 'Who counts as a senior citizen for Indian Railways booking purposes?',
    answer: 'Men aged 60 and above, and women aged 58 and above, are eligible for the senior citizen quota and lower-berth priority.',
  },
  {
    question: 'How many lower berths are reserved for senior citizens?',
    answer:
      'Indian Railways reserves a fixed number of lower berths per coach for senior citizens (along with women and pregnant passengers): roughly 6–7 in Sleeper Class, 4–5 in AC 3-tier, and 3–4 in AC 2-tier, subject to availability at the time of booking.',
  },
  {
    question: 'What documents do I need to claim senior citizen quota?',
    answer:
      'A valid government-issued photo ID showing your date of birth, with the name and age matching exactly what you enter while booking. A mismatch between your ticket and ID can result in the concession or quota being denied during a ticket check.',
  },
];

export default function SeniorCitizenTrainDiscountPage() {
  return (
    <div className="flex-1 max-w-3xl w-full mx-auto px-4 md:px-8 pt-28 lg:pt-24 pb-16">
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Trains', path: '/trains' }, { name: 'Senior Citizen Train Ticket Discount', path: '/trains/senior-citizen-train-ticket-discount' }])} />
      <JsonLd data={faqPageJsonLd(FAQS)} />

      <nav className="text-[11px] text-neutral-500 font-mono mb-4">
        <Link href="/" className="hover:text-neutral-300">Home</Link> / <Link href="/trains" className="hover:text-neutral-300">Trains</Link> / Senior Citizen Discount
      </nav>

      <p className="text-emerald-400 text-[10px] font-black tracking-[0.3em] uppercase mb-2">Train Tickets</p>
      <h1 className="font-display text-3xl md:text-5xl text-white font-medium mb-6">IRCTC Senior Citizen Train Ticket Discount — What&apos;s Actually True in 2026</h1>

      <div className="text-neutral-300 text-sm md:text-base leading-relaxed space-y-5">
        <p>
          Search for &ldquo;IRCTC senior citizen discount&rdquo; and you&apos;ll find a mix of outdated articles still describing a benefit
          that stopped years ago, and confused forum threads asking whether it&apos;s back. Here&apos;s the straightforward, current
          answer, plus what senior travelers still do get when booking a train ticket in India.
        </p>

        <h2 className="font-display text-2xl text-white font-medium pt-2">The fare discount: suspended since 2020, not reinstated</h2>
        <p>
          Before March 2020, Indian Railways offered a fare concession of 40% for male senior citizens and 50% for female senior
          citizens on most long-distance trains. That concession was withdrawn as a pandemic-era measure and, as of 2026, has not
          been restored — even though restoring it has come up repeatedly in Union Budget discussions. Instead of a blanket fare
          cut, Indian Railways has focused on non-fare benefits: priority seat allocation, medical assistance, and smoother
          booking access for senior travelers. If you&apos;re booking today, budget for the full adult fare and treat any site or
          agent claiming an automatic senior discount with caution.
        </p>

        <h2 className="font-display text-2xl text-white font-medium pt-2">What senior citizens do still get</h2>
        <p>
          Eligibility itself hasn&apos;t changed: men aged 60 and above and women aged 58 and above qualify as senior citizens for
          booking purposes. What they get is priority in the Senior Citizen/Lower Berth quota — a fixed allocation of lower
          berths held back in each coach specifically for elderly, pregnant, and other passengers who need easier access. In
          Sleeper Class that&apos;s typically around 6–7 lower berths per coach, in AC 3-tier around 4–5, and in AC 2-tier around 3–4
          — though exact numbers can vary by train and route. Booking early still matters, since this quota is limited and fills
          up on popular routes just like any other.
        </p>

        <h2 className="font-display text-2xl text-white font-medium pt-2">Booking correctly so the quota isn&apos;t denied</h2>
        <p>
          The single most common reason a senior citizen loses their lower-berth priority isn&apos;t eligibility — it&apos;s a mismatch
          between the name or age entered at booking and the photo ID carried while traveling. Always book using the exact name
          and date of birth as they appear on a government-issued ID (Aadhaar, passport, or similar), and carry that same ID for
          the journey. If the ticket-checking staff can&apos;t verify age against ID, the quota benefit can be withdrawn mid-journey,
          which is an avoidable hassle after an otherwise smooth booking.
        </p>

        <h2 className="font-display text-2xl text-white font-medium pt-2">Booking for a parent from abroad</h2>
        <p>
          We get a lot of these requests from NRIs booking a domestic train leg for a parent visiting India, or arranging travel
          for parents while they themselves are abroad. If that&apos;s you, we can handle the booking directly — matching ID details
          correctly, requesting the senior/lower-berth quota, and coordinating timing with any{' '}
          <Link href="/flights/usa-to-india-flight-tickets" className="text-emerald-400 hover:underline">
            USA to India flight
          </Link>{' '}
          or{' '}
          <Link href="/packages" className="text-emerald-400 hover:underline">
            tour package
          </Link>{' '}
          you&apos;re also arranging, so nobody has to juggle multiple bookings across time zones.
        </p>

        <p>
          Ready to book? Search routes on our{' '}
          <Link href="/trains" className="text-emerald-400 hover:underline">
            train search page
          </Link>{' '}
          or send us the travel details below and a consultant will confirm quota availability for you.
        </p>
      </div>

      <LandingCta
        heading="Booking a train ticket for a senior citizen?"
        body="Send us the travel details and ID information — we'll book with correct quota and lower-berth requests."
        whatsappMessage="Hi! I'd like to book a train ticket with senior citizen quota."
      />

      <section className="mt-10">
        <h2 className="font-display text-2xl text-white font-medium mb-4">Frequently asked questions</h2>
        <div className="space-y-2">
          {FAQS.map((faq) => (
            <details key={faq.question} className="group bg-neutral-900 border border-neutral-800 rounded-xl px-5 py-4 open:border-emerald-500/30">
              <summary className="text-sm font-bold text-white cursor-pointer list-none">{faq.question}</summary>
              <p className="text-sm text-neutral-400 leading-relaxed mt-3">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
