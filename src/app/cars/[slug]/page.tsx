import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MapPin, Star, Gauge, Fuel, Users, Briefcase, DoorOpen, Zap, Check, X } from 'lucide-react';
import { getCarBySlug, getCarPricing, getDisplayImageUrl, getCarCompanyLogoUrl, getCarCompanyById } from '@/lib/providers/cars';
import JsonLd from '@/components/seo/JsonLd';
import CarCompanyLogo from '@/components/cars/CarCompanyLogo';
import CarPricingWidget from '@/components/cars/CarPricingWidget';
import PoliciesSection from '@/components/cars/PoliciesSection';
import InsuranceTable from '@/components/cars/InsuranceTable';
import CompanyReviews from '@/components/cars/CompanyReviews';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const listing = getCarBySlug(slug);
  if (!listing) return {};

  const image = getDisplayImageUrl(listing.slug, listing.category);
  return {
    title: listing.seo.title,
    description: listing.seo.metaDescription,
    alternates: { canonical: listing.seo.canonicalUrl },
    openGraph: { title: listing.seo.title, description: listing.seo.metaDescription, images: [image], type: 'website' },
    twitter: { card: 'summary_large_image', title: listing.seo.title, description: listing.seo.metaDescription, images: [image] },
  };
}

export default async function CarDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const listing = getCarBySlug(slug);
  if (!listing) notFound();

  const initialPricing = getCarPricing(listing, 'US', 'daily');
  const heroImage = getDisplayImageUrl(listing.slug, listing.category);
  const logoUrl = getCarCompanyLogoUrl(listing.companyName);
  const company = getCarCompanyById(listing.companyId);
  const jsonLd = { ...listing.seo.jsonLd, image: heroImage };

  const v = listing.specs;
  const featureFlags: { label: string; on: boolean }[] = [
    { label: 'GPS Navigation', on: v.features.gps },
    { label: 'Bluetooth', on: v.features.bluetooth },
    { label: 'Apple CarPlay', on: v.features.appleCarPlay },
    { label: 'Android Auto', on: v.features.androidAuto },
    { label: 'In-car Wi-Fi', on: v.features.wifi },
    { label: 'Heated Seats', on: v.features.heatedSeats },
    { label: 'Sunroof', on: v.features.sunroof },
    { label: 'Air Conditioning', on: v.features.airConditioning },
    { label: 'Child Seat Available', on: v.features.childSeatAvailable },
    { label: 'Pet Friendly', on: v.features.petFriendly },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 pb-20">
      <JsonLd data={jsonLd} />

      {/* Breadcrumb bar */}
      <div className="bg-slate-900 border-b border-slate-800 py-4 px-4 md:px-8 text-white relative z-30">
        <div className="max-w-7xl w-full mx-auto flex justify-between items-center">
          <Link href="/cars" className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Car Rentals
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="relative h-[420px] bg-slate-950 overflow-hidden">
        <Image
          src={heroImage}
          alt={listing.images.find((i) => i.role === 'hero')?.altText ?? listing.title}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 py-10 px-4 md:px-8">
          <div className="max-w-7xl w-full mx-auto space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-600/90 text-white text-xs font-extrabold uppercase px-3 py-1 rounded-full">{listing.category}</span>
              <span className="bg-slate-900/80 text-slate-100 text-xs font-extrabold uppercase px-3 py-1 rounded-full">
                {listing.year} model or similar
              </span>
              {v.fuelType === 'Electric' && (
                <span className="bg-emerald-600/90 text-white text-xs font-extrabold uppercase px-3 py-1 rounded-full">Electric</span>
              )}
            </div>

            {logoUrl && (
              <div className="bg-white rounded-lg px-3 py-2 inline-block w-fit">
                <CarCompanyLogo logoUrl={logoUrl} name={listing.companyName} className="h-7 w-28" />
              </div>
            )}

            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight max-w-4xl">
              {listing.brand} {listing.model}
            </h1>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-blue-500" />
                {listing.locationName}, {listing.city}, {listing.country}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                {listing.ratings.overall} Rated ({listing.ratings.reviewCount} Reviews)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl w-full mx-auto px-4 md:px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Vehicle specs */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-50 mb-4 flex items-center gap-2">
              <Gauge className="w-5 h-5 text-blue-600" />
              Vehicle Specifications
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {[
                { label: 'Engine', value: v.engine, icon: Gauge },
                { label: 'Horsepower', value: `${v.horsepower} hp`, icon: Zap },
                { label: 'Transmission', value: v.transmission, icon: Gauge },
                { label: 'Fuel', value: v.fuelType, icon: Fuel },
                { label: 'Seats', value: `${v.seats}`, icon: Users },
                { label: 'Doors', value: `${v.doors}`, icon: DoorOpen },
                { label: 'Luggage', value: `${v.luggageCapacity.large} large + ${v.luggageCapacity.small} small`, icon: Briefcase },
                { label: 'Drive', value: v.driveType, icon: Gauge },
                { label: 'Economy', value: v.fuelEconomy, icon: Fuel },
                { label: 'Tank / Battery', value: v.fuelTankCapacity, icon: Fuel },
                { label: 'Range', value: `~${v.rangeKm} km`, icon: Gauge },
                { label: 'Color', value: listing.color, icon: Gauge },
              ].map(({ label, value }) => (
                <div key={label} className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">{label}</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">{value}</span>
                </div>
              ))}
            </div>

            {/* Feature checklist */}
            <div className="mt-5 grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 text-sm">
              {featureFlags.map(({ label, on }) => (
                <span key={label} className={`flex items-center gap-1.5 ${on ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 line-through'}`}>
                  {on ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4 text-slate-300" />}
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Pickup & drop-off */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-50 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Pickup & Drop-off
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-2">Pickup Options</span>
                <ul className="space-y-1.5">
                  {listing.pickupOptions.map((o) => (
                    <li key={o} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /> {o}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-2">Drop-off Options</span>
                <ul className="space-y-1.5">
                  {listing.dropoffOptions.map((o) => (
                    <li key={o} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /> {o}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <InsuranceTable options={listing.insuranceOptions} />
          <PoliciesSection policies={listing.policies} />
        </div>

        {/* Right column */}
        <div className="lg:col-span-4 space-y-6">
          <CarPricingWidget listing={listing} initialPricing={initialPricing} />
          {company && <CompanyReviews companyName={company.name} reviews={company.reviews} />}
        </div>
      </div>
    </div>
  );
}
