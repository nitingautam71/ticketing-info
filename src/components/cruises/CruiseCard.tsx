import Image from 'next/image';
import Link from 'next/link';
import type { CruiseSearchResult } from '@/lib/cruises/types';
import { Ship, MapPin, Calendar, Star } from 'lucide-react';

interface CruiseCardProps {
  cruise: CruiseSearchResult;
  imageUrl: string;
}

export default function CruiseCard({ cruise, imageUrl }: CruiseCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group">
      {/* Image container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Image
          src={imageUrl}
          alt={cruise.heroImage?.altText ?? cruise.title}
          fill
          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold rounded-full uppercase tracking-wider">
            {cruise.durationNights} Nights
          </span>
          {cruise.categories && cruise.categories[0] && (
            <span className="px-3 py-1 bg-blue-600/80 backdrop-blur-md text-white text-xs font-semibold rounded-full uppercase tracking-wider">
              {cruise.categories[0]}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Cruise Line & Ship */}
          <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mb-2">
            <span className="bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">
              {cruise.cruiseLineName}
            </span>
            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 normal-case">
              <Ship className="w-3.5 h-3.5" />
              {cruise.shipName}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 leading-snug mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {cruise.title}
          </h3>

          {/* Info grid */}
          <div className="space-y-2 text-sm text-slate-600 dark:text-slate-350 mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                From <span className="font-medium text-slate-800 dark:text-slate-200">{cruise.departurePortName}</span> to <span className="font-medium text-slate-800 dark:text-slate-200">{cruise.arrivalPortName}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Sails to {cruise.destination}</span>
            </div>
          </div>
        </div>

        <div>
          {/* Rating and Price */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            {/* Rating */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5 text-amber-500">
                <Star className="w-4 h-4 fill-current" />
              </div>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                {cruise.ratingOverall}
              </span>
              <span className="text-xs text-slate-400">
                ({cruise.reviewCount})
              </span>
            </div>

            {/* Price */}
            <div className="text-right">
              <span className="text-xs text-slate-400 block leading-none mb-0.5">From</span>
              <span className="text-2xl font-black text-slate-900 dark:text-slate-50">
                ${cruise.fromPriceUSD}
              </span>
              <span className="text-xs text-slate-400 block leading-none">per guest</span>
            </div>
          </div>

          {/* Action Button */}
          <Link
            href={`/cruises/${cruise.slug}`}
            className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-center block transition-colors duration-200"
          >
            View Itinerary
          </Link>
        </div>
      </div>
    </div>
  );
}
