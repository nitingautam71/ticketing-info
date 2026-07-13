import type { CabinPricing, CabinType } from '@/lib/cruises/types';
import { ShieldCheck, Coffee, Wifi, Compass, Sparkles } from 'lucide-react';

interface CabinPricingTableProps {
  cabinPricing: Record<CabinType, CabinPricing>;
  currency: string;
  usdRate: number;
  selectedCabin?: CabinType;
  onSelectCabin?: (cabinType: CabinType, priceUSD: number) => void;
}

const CABIN_DESCRIPTIONS: Record<CabinType, string> = {
  'Interior Cabin': 'Perfect budget option, cozy retreat with standard cruise amenities.',
  'Ocean View': 'Features a large picture window or porthole to enjoy natural light and ocean views.',
  'Balcony Cabin': 'Includes a private verandah with floor-to-ceiling glass doors and seating.',
  'Junior Suite': 'Spacious layout with a dedicated sitting area and full bathtub.',
  'Suite': 'Premium living room, priority boarding, and luxury bath amenities.',
  'Accessible Cabin': 'Wider doorways, roll-in shower, grab bars, and accessible closet rods.',
  'Solo Cabin': 'Specifically sized and priced for solo travelers, avoiding single supplements.',
  'Family Cabin': 'Designed for up to 6 guests, bunk beds, and double vanity bathroom.',
  'Luxury Suite': 'Elite suite with a private hot tub on the deck, concierge service.',
  'Owner\'s Suite': 'The ultimate cruise luxury, dining room, wet bar, and butler service.'
};

export default function CabinPricingTable({
  cabinPricing,
  currency,
  usdRate,
  selectedCabin,
  onSelectCabin
}: CabinPricingTableProps) {
  const getIncludedIcons = (cabin: CabinType) => {
    const isSuite = cabin.includes('Suite');
    return (
      <div className="flex gap-2 text-slate-400">
        <span title="Breakfast Included">
          <Coffee className="w-4 h-4 text-emerald-500" />
        </span>
        <span title="Travel Insurance Included">
          <ShieldCheck className="w-4 h-4 text-blue-500" />
        </span>
        {isSuite && (
          <span title="Premium Wi-Fi Included">
            <Wifi className="w-4 h-4 text-indigo-500" />
          </span>
        )}
        {isSuite && (
          <span title="VIP Access Included">
            <Sparkles className="w-4 h-4 text-amber-500" />
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <Compass className="w-5 h-5 text-blue-600" />
        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-50">Stateroom Tiers & Rates</h3>
      </div>
      <p className="text-sm text-slate-500 mb-6">
        Select a cabin type below. All fares are estimates based on your selected departure origin market and traveler composition.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-450 uppercase tracking-wider">
              <th className="py-3 px-4">Stateroom Category</th>
              <th className="py-3 px-4 hidden md:table-cell">Features</th>
              <th className="py-3 px-4">Inclusions</th>
              <th className="py-3 px-4 text-right">Price per Guest</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-850">
            {Object.values(cabinPricing).map((pricing) => {
              const displayPrice = pricing.discountedPriceLocal;
              const displayRetail = pricing.suggestedRetailPriceLocal;
              const hasDiscount = pricing.savingsLocal > 0;

              const isSelected = selectedCabin === pricing.cabinType;

              return (
                <tr
                  key={pricing.cabinType}
                  className={`transition-colors ${isSelected ? 'bg-blue-50/60 dark:bg-blue-950/30' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/20'}`}
                >
                  <td className="py-4 px-4">
                    <span className="font-bold text-slate-800 dark:text-slate-100 block">
                      {pricing.cabinType}
                    </span>
                    <span className="text-xs text-slate-400 line-clamp-1 max-w-[280px]">
                      {CABIN_DESCRIPTIONS[pricing.cabinType]}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-500 hidden md:table-cell">
                    Double Beds / Convertible
                  </td>
                  <td className="py-4 px-4">
                    {getIncludedIcons(pricing.cabinType)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    {hasDiscount && (
                      <span className="text-xs text-slate-400 line-through mr-2">
                        {currency} {displayRetail.toLocaleString()}
                      </span>
                    )}
                    <span className="text-lg font-black text-slate-900 dark:text-slate-50">
                      {currency} {displayPrice.toLocaleString()}
                    </span>
                    {hasDiscount && (
                      <span className="text-[10px] block font-bold text-emerald-600 dark:text-emerald-400">
                        Save {currency} {pricing.savingsLocal.toLocaleString()}!
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => onSelectCabin?.(pricing.cabinType, pricing.discountedPriceUSD)}
                      className={`px-4 py-2 font-bold rounded-lg text-xs transition-colors shadow-sm cursor-pointer ${
                        isSelected ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Select'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
