import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/seo/JsonLd';
import LandingCta from '@/components/seo/LandingCta';
import { breadcrumbJsonLd, faqPageJsonLd } from '@/lib/structuredData';

export const metadata: Metadata = {
  title: 'OCI Card vs Indian Visa for NRIs — Which Do You Need?',
  description:
    'A clear guide to OCI cards vs Indian visas for NRIs and people of Indian origin: who qualifies, what each document lets you do, and how to decide before your next trip to India.',
  alternates: { canonical: '/visas/oci-vs-indian-visa-for-nris' },
  openGraph: {
    title: 'OCI Card vs Indian Visa for NRIs — Which Do You Need? | Ticketing-Info',
    description: 'A clear guide to OCI cards vs Indian visas for NRIs and people of Indian origin: who qualifies and what each document lets you do.',
  },
};

const FAQS = [
  {
    question: 'Is an OCI card the same as Indian citizenship?',
    answer:
      'No. India does not permit dual citizenship. An OCI card is a lifelong, multiple-entry visa-equivalent document that lets a foreign citizen of Indian origin live, work, and study in India without needing a separate visa for most purposes — it does not confer citizenship, voting rights, or eligibility for public-sector jobs.',
  },
  {
    question: 'Who is eligible for an OCI card?',
    answer:
      'Broadly: foreign citizens who were Indian citizens on or after 26 January 1950, or who are descended from someone who was, and foreign-citizen spouses of Indian citizens or OCI cardholders (typically after being married for a minimum period). Pakistani and Bangladeshi citizens (or those with a parent/grandparent from those countries) are not eligible.',
  },
  {
    question: 'Does an OCI card need to be renewed?',
    answer:
      'The OCI card itself does not expire, but it must be re-issued whenever you get a new passport before turning 20, and once again after turning 50 — it is a common mistake to travel on an old OCI card linked to an expired passport, which can cause issues at check-in or immigration.',
  },
  {
    question: 'If a family member is not an OCI cardholder, can they still travel to India with us?',
    answer:
      'Yes — a foreign national without OCI status can apply for a regular Indian visa (commonly the e-Visa for tourism, business, or medical purposes). Processing routes and required documents differ from the OCI process, so it is worth applying separately and early rather than assuming the same paperwork covers both.',
  },
];

export default function OciVsIndianVisaPage() {
  return (
    <div className="flex-1 max-w-3xl w-full mx-auto px-4 md:px-8 pt-28 lg:pt-24 pb-16">
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Visas', path: '/visas' }, { name: 'OCI vs Indian Visa for NRIs', path: '/visas/oci-vs-indian-visa-for-nris' }])} />
      <JsonLd data={faqPageJsonLd(FAQS)} />

      <nav className="text-[11px] text-neutral-500 font-mono mb-4">
        <Link href="/" className="hover:text-neutral-300">Home</Link> / <Link href="/visas" className="hover:text-neutral-300">Visas</Link> / OCI vs Indian Visa
      </nav>

      <p className="text-emerald-400 text-[10px] font-black tracking-[0.3em] uppercase mb-2">Visa Assistance</p>
      <h1 className="font-display text-3xl md:text-5xl text-white font-medium mb-6">OCI Card vs Indian Visa for NRIs — Which Do You Need?</h1>

      <div className="text-neutral-300 text-sm md:text-base leading-relaxed space-y-5">
        <p>
          One of the most common questions we get from NRI families planning a trip to India is deceptively simple: do I need a
          visa, or does my OCI card cover me? The answer depends on your citizenship, your parents&apos; or grandparents&apos; citizenship
          history, and whether you already hold — or are eligible for — an Overseas Citizen of India (OCI) card. Getting this
          wrong close to a travel date is one of the most stressful (and avoidable) mistakes families make, so here&apos;s a clear
          breakdown.
        </p>

        <h2 className="font-display text-2xl text-white font-medium pt-2">What an OCI card actually is</h2>
        <p>
          The OCI card is a lifelong, multiple-entry document — not a citizenship, and not the same as the older PIO (Person of
          Indian Origin) card, which was merged into the OCI scheme years ago and is no longer issued. India does not allow dual
          citizenship, so an OCI card is best understood as a permanent visa-equivalent status: it lets a foreign citizen of
          Indian origin enter, live, work, and study in India indefinitely, without applying for a fresh visa before every trip.
          It does not grant voting rights, eligibility for public-sector or constitutional-post jobs, or the right to buy
          agricultural or farm property.
        </p>

        <h2 className="font-display text-2xl text-white font-medium pt-2">Who typically qualifies for OCI</h2>
        <p>
          In general, you may be eligible if you are a foreign citizen who was an Indian citizen on or after 26 January 1950, or a
          child, grandchild, or great-grandchild of someone who was — this covers most second- and third-generation members of the
          Indian diaspora. Spouses of Indian citizens or existing OCI cardholders are also typically eligible after a minimum
          period of marriage. Citizens of Pakistan and Bangladesh (or applicants with a parent or grandparent from either country)
          are not eligible for OCI regardless of Indian ancestry further back.
        </p>

        <h2 className="font-display text-2xl text-white font-medium pt-2">When a regular Indian visa is the right path instead</h2>
        <p>
          If a family member joining your trip doesn&apos;t qualify for OCI — a spouse&apos;s extended family, a close friend, or a
          colleague, for example — the standard route is a regular Indian visa. For most tourism, business, or medical visits,
          that means the e-Visa, applied for online ahead of travel. It&apos;s a separate process from OCI with its own document
          checklist and timeline, so don&apos;t assume paperwork for one covers the other, and don&apos;t leave the application until the
          week before departure.
        </p>

        <h2 className="font-display text-2xl text-white font-medium pt-2">A renewal detail that catches people out</h2>
        <p>
          An OCI card doesn&apos;t expire on its own, but it is tied to the passport it was issued against. Indian government
          guidance requires it to be re-issued whenever the holder gets a new passport before age 20, and once again after age 50.
          Travelers who renewed their passport but kept flying on the old OCI card sometimes run into friction at check-in or
          immigration — if your passport has changed since your OCI card was issued, it&apos;s worth confirming your OCI status is
          current before you book.
        </p>

        <h2 className="font-display text-2xl text-white font-medium pt-2">How we help</h2>
        <p>
          Because eligibility rules and required documents can change and vary by consulate, we don&apos;t just point you to a
          government website and wish you luck — a travel consultant reviews your family&apos;s specific situation, flags anything
          that needs attention before you book flights, and coordinates timing with your{' '}
          <Link href="/flights/usa-to-india-flight-tickets" className="text-emerald-400 hover:underline">
            USA to India flight tickets
          </Link>{' '}
          so paperwork isn&apos;t a last-minute scramble. If your trip also involves onward travel once you land, ask us about{' '}
          <Link href="/packages" className="text-emerald-400 hover:underline">
            tour packages
          </Link>{' '}
          or{' '}
          <Link href="/insurance" className="text-emerald-400 hover:underline">
            travel insurance
          </Link>{' '}
          for the whole family in the same enquiry.
        </p>
      </div>

      <LandingCta
        heading="Not sure which document your family needs?"
        body="Tell us who's traveling and their citizenship — we'll help you figure out OCI vs visa before you book."
        whatsappMessage="Hi! I need help figuring out OCI card vs Indian visa for my family's trip."
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
