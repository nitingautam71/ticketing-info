import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Ship, Anchor, Star, ArrowLeft, Shield } from 'lucide-react';
import { getCruiseBySlug, getCruisePricing, getDisplayImageUrl, getCruiseLineLogoUrl } from '@/lib/providers/cruises';
import JsonLd from '@/components/seo/JsonLd';
import CruisePricingWidget from '@/components/cruises/CruisePricingWidget';
import ItineraryTimeline from '@/components/cruises/ItineraryTimeline';
import OnboardExperience from '@/components/cruises/OnboardExperience';
import ShoreExcursions from '@/components/cruises/ShoreExcursions';
import CruiseReviews from '@/components/cruises/CruiseReviews';
import CruiseLineLogo from '@/components/cruises/CruiseLineLogo';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getCruiseBySlug(slug);
  if (!pkg) return {};

  const image = getDisplayImageUrl(pkg.slug, pkg.destination, pkg.categories);
  return {
    title: pkg.seo.title,
    description: pkg.seo.metaDescription,
    alternates: { canonical: pkg.seo.canonicalUrl },
    openGraph: { title: pkg.seo.title, description: pkg.seo.metaDescription, images: [image], type: 'website' },
    twitter: { card: 'summary_large_image', title: pkg.seo.title, description: pkg.seo.metaDescription, images: [image] }
  };
}

export default async function CruiseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const pkg = await getCruiseBySlug(slug);
  if (!pkg) notFound();

  const initialPricing = getCruisePricing(pkg, 'US', 'couple', 'midRange');
  const heroImage = getDisplayImageUrl(pkg.slug, pkg.destination, pkg.categories);
  const logoUrl = getCruiseLineLogoUrl(pkg.cruiseLineName);
  const jsonLd = { ...pkg.seo.jsonLd, image: heroImage };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 pb-20">
      <JsonLd data={jsonLd} />

      {/* Top Navigation / Breadcrumbs */}
      <div className="bg-slate-900 border-b border-slate-800 py-4 px-4 md:px-8 text-white relative z-30">
        <div className="max-w-7xl w-full mx-auto flex justify-between items-center">
          <Link href="/cruises" className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Cruise Catalog
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[480px] bg-slate-950 overflow-hidden">
        <Image
          src={heroImage}
          alt={pkg.images.find((i) => i.role === 'hero')?.altText ?? pkg.title}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 py-12 px-4 md:px-8">
          <div className="max-w-7xl w-full mx-auto space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-600/90 text-white text-xs font-extrabold uppercase px-3 py-1 rounded-full">
                {pkg.durationNights} Nights
              </span>
              <span className="bg-slate-900/80 text-slate-100 text-xs font-extrabold uppercase px-3 py-1 rounded-full">
                {pkg.destination}
              </span>
            </div>

            {logoUrl && (
              <div className="bg-white rounded-lg px-3 py-2 inline-block w-fit">
                <CruiseLineLogo logoUrl={logoUrl} name={pkg.cruiseLineName} className="h-7 w-32" />
              </div>
            )}

            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight max-w-4xl">{pkg.title}</h1>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300">
              <span className="flex items-center gap-1">
                <Ship className="w-4 h-4 text-blue-500" />
                {pkg.cruiseLineName} • {pkg.shipName}
              </span>
              <span className="flex items-center gap-1">
                <Anchor className="w-4 h-4 text-blue-500" />
                Departs from {pkg.departurePortName}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                {pkg.ratings.overall} Rated ({pkg.ratings.reviewCount} Reviews)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-7xl w-full mx-auto px-4 md:px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Pricing, Itinerary, Onboard Experience, Specs */}
        <div className="lg:col-span-8 space-y-8">
          {/* Ship specifications box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-50 mb-4 flex items-center gap-2">
              <Ship className="w-5 h-5 text-blue-600" />
              Vessel Specifications
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Gross Tonnage</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-100 text-base">{pkg.shipSpecs.tonnage.toLocaleString()} GT</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Decks</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-100 text-base">{pkg.shipSpecs.decks} Guest Decks</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Pass Capacity</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-100 text-base">{pkg.shipSpecs.passengerCapacity.toLocaleString()} guests</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Crew Size</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-100 text-base">{pkg.shipSpecs.crewSize.toLocaleString()} staff</span>
              </div>
            </div>
          </div>

          {/* Live pricing configurator + cabin fare table + per-cabin booking */}
          <CruisePricingWidget pkg={pkg} initialPricing={initialPricing} />

          {/* Itinerary Timeline */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
            <ItineraryTimeline itinerary={pkg.dailyItinerary} />
          </div>

          {/* Shore Excursions */}
          <ShoreExcursions excursions={pkg.shoreExcursions} />

          {/* Onboard Experience */}
          <OnboardExperience experience={pkg.onboardExperience} dining={pkg.dining} />
        </div>

        {/* Right Column: Booking info, Reviews */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-slate-50">Reserve Your Voyage</h4>
            <p className="text-xs text-slate-500">
              No immediate online payment is required. Select a stateroom from the fare table to lock in these estimated rates, and one of our
              dedicated cruise consultants will contact you to finalize cabins, routes, and optional excursions.
            </p>
            <div className="flex items-start gap-2 pt-2 text-xs text-slate-500">
              <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Full consultant support, 100% refundable reservation until payment.</span>
            </div>
          </div>

          <CruiseReviews reviews={pkg.reviews} />
        </div>
      </div>
    </div>
  );
}
