import Image from 'next/image';
import Link from 'next/link';
import type { CarSearchResult } from '@/lib/cars/types';
import { MapPin, Star, Users, Briefcase, Fuel, Cog } from 'lucide-react';
import CarCompanyLogo from './CarCompanyLogo';

interface CarCardProps {
  car: CarSearchResult;
  imageUrl: string;
  logoUrl?: string;
}

export default function CarCard({ car, imageUrl, logoUrl }: CarCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group">
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Image
          src={imageUrl}
          alt={car.heroImage?.altText ?? car.title}
          fill
          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold rounded-full uppercase tracking-wider">
            {car.category}
          </span>
          {car.filters?.ev && (
            <span className="px-3 py-1 bg-emerald-600/80 backdrop-blur-md text-white text-xs font-semibold rounded-full uppercase tracking-wider">
              Electric
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs mb-2">
            <CarCompanyLogo logoUrl={logoUrl} name={car.companyName} />
          </div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 leading-snug mb-1 group-hover:text-blue-600 transition-colors">
            {car.brand} {car.model}
          </h3>
          <p className="text-xs text-slate-400 mb-3">{car.year} model year or similar</p>

          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-350 mb-3">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="line-clamp-1">
              {car.locationName}, <span className="font-medium">{car.country}</span>
            </span>
          </div>

          {/* Spec chips */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4">
            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {car.seats} seats</span>
            <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {car.luggage} bags</span>
            <span className="flex items-center gap-1"><Cog className="w-3.5 h-3.5" /> {car.transmission}</span>
            <span className="flex items-center gap-1"><Fuel className="w-3.5 h-3.5" /> {car.fuelType}</span>
          </div>
        </div>

        <div>
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-500 fill-current" />
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{car.ratingOverall}</span>
              <span className="text-xs text-slate-400">({car.reviewCount})</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block leading-none mb-0.5">From</span>
              <span className="text-2xl font-black text-slate-900 dark:text-slate-50">${car.fromPricePerDayUSD}</span>
              <span className="text-xs text-slate-400 block leading-none">per day est.</span>
            </div>
          </div>

          <Link
            href={`/cars/${car.slug}`}
            className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-center block transition-colors duration-200"
          >
            View Deal
          </Link>
        </div>
      </div>
    </div>
  );
}
