'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MapPin, Star, ChevronRight, Heart, Share2, Scale, CheckCircle2, Wallet, Crown } from 'lucide-react';
import type { Hotel } from '@/lib/providers/hotels';
import { discountPercent, formatDistance } from '@/lib/hotelDisplay';

interface HotelResultCardProps {
  hotel: Hotel;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  isCompared: boolean;
  compareDisabled: boolean;
  onToggleCompare: () => void;
  onViewDetails: () => void;
}

export default function HotelResultCard({ hotel: h, isFavorite, onToggleFavorite, isCompared, compareDisabled, onToggleCompare, onViewDetails }: HotelResultCardProps) {
  const [shareState, setShareState] = useState<'idle' | 'copied'>('idle');
  const discount = discountPercent(h);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = `${h.name} — $${h.pricePerNight}/night on Ticketing-Info`;
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: h.name, text: shareText, url: shareUrl });
        return;
      } catch {
        // user cancelled the native share sheet — fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(`${shareText} — ${shareUrl}`);
      setShareState('copied');
      setTimeout(() => setShareState('idle'), 1800);
    } catch {
      // clipboard unavailable — nothing more we can do without a backend share link
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl overflow-hidden shadow-md flex flex-col sm:flex-row transition-all group">
      <div className="w-full sm:w-[240px] h-[180px] sm:h-auto relative bg-neutral-950 shrink-0">
        <Image src={h.image} alt={h.name} fill sizes="(min-width: 640px) 240px, 100vw" className="object-cover opacity-90" />
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow">-{discount}%</span>
        )}
        {h.isSponsored && (
          <span className="absolute top-3 right-3 bg-neutral-950/80 border border-neutral-700 text-neutral-300 text-[9px] font-bold uppercase tracking-wide px-2 py-1 rounded-lg">Sponsored</span>
        )}
        <div className="absolute bottom-3 right-3 flex gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            aria-label={isFavorite ? 'Remove from saved hotels' : 'Save hotel'}
            aria-pressed={isFavorite}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer ${isFavorite ? 'bg-red-500 text-white' : 'bg-neutral-950/70 text-white hover:bg-neutral-950'}`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share hotel"
            className="w-8 h-8 rounded-full flex items-center justify-center bg-neutral-950/70 text-white hover:bg-neutral-950 backdrop-blur-sm transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
        {shareState === 'copied' && <span className="absolute bottom-3 left-3 bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg">Link copied</span>}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between gap-4 min-w-0">
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                {h.stars > 0 &&
                  Array.from({ length: h.stars }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-emerald-400 stroke-none" />)}
              </div>
              <h4 className="text-base font-bold text-white tracking-tight leading-snug group-hover:text-emerald-400 transition-colors truncate">{h.name}</h4>
              <p className="text-xs text-neutral-400 flex items-center gap-0.5 truncate">
                <MapPin className="w-3.5 h-3.5 shrink-0" /> {h.location}
                {h.distanceFromCenterKm != null && <span className="text-neutral-500">&nbsp;• {formatDistance(h.distanceFromCenterKm)} away</span>}
              </p>
            </div>
            <label className="flex items-center gap-1.5 text-[10px] text-neutral-400 shrink-0 cursor-pointer">
              <input
                type="checkbox"
                checked={isCompared}
                disabled={compareDisabled && !isCompared}
                onChange={(e) => {
                  e.stopPropagation();
                  onToggleCompare();
                }}
                className="accent-emerald-500"
              />
              <Scale className="w-3 h-3" /> Compare
            </label>
          </div>

          <div className="flex gap-2 flex-wrap pt-1.5">
            {h.freeCancellation && (
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Free cancellation
              </span>
            )}
            {h.payAtProperty && (
              <span className="text-[10px] bg-neutral-950 text-neutral-400 border border-neutral-850 px-2.5 py-1 rounded-lg flex items-center gap-1">
                <Wallet className="w-3 h-3" /> Pay at property
              </span>
            )}
            {h.reviewScoreWord === 'Exceptional' && (
              <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1">
                <Crown className="w-3 h-3" /> Guest favorite
              </span>
            )}
            {h.amenities.slice(0, 3).map((am) => (
              <span key={am} className="text-[10px] bg-neutral-950 text-neutral-400 border border-neutral-850 px-2.5 py-1 rounded-lg">
                {am}
              </span>
            ))}
          </div>
        </div>

        <div className="flex sm:flex-row justify-between items-end border-t border-neutral-800/60 pt-4 mt-2 gap-3">
          <div className="flex items-center gap-2 text-xs text-neutral-400 min-w-0">
            {h.rating > 0 && (
              <>
                <span className="bg-emerald-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">{h.rating.toFixed(1)}</span>
                <span className="text-white font-semibold">{h.reviewScoreWord}</span>
                <span className="truncate">({h.reviewsCount.toLocaleString()} reviews)</span>
              </>
            )}
          </div>
          <div className="text-right flex items-center gap-4 shrink-0">
            <div>
              {h.originalPricePerNight && h.originalPricePerNight > h.pricePerNight && (
                <p className="text-[11px] text-neutral-500 line-through">${h.originalPricePerNight.toLocaleString()}</p>
              )}
              <p className="text-[10px] text-neutral-500 font-semibold">{h.nights} night{h.nights > 1 ? 's' : ''} • from</p>
              <p className="text-lg font-black text-white">${h.pricePerNight.toLocaleString()}<span className="text-xs font-medium text-neutral-500">/night</span></p>
              <p className="text-[10px] text-neutral-500">${h.totalPrice.toLocaleString()} total, excl. taxes &amp; fees</p>
            </div>
            <button
              onClick={onViewDetails}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1 cursor-pointer transition-colors shrink-0"
            >
              View Rooms <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
