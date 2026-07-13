import type { CarRentalPolicies } from '@/lib/cars/types';
import { FileText } from 'lucide-react';

export default function PoliciesSection({ policies }: { policies: CarRentalPolicies }) {
  const rows: { label: string; value: string }[] = [
    { label: 'Minimum age', value: `${policies.minimumAge} years (young driver fee under ${policies.youngDriverSurchargeUnderAge})` },
    { label: 'Maximum age', value: policies.maximumAge ? `${policies.maximumAge} years` : 'No upper limit' },
    { label: 'License', value: policies.licenseRequirements },
    { label: 'International Driving Permit', value: policies.internationalDrivingPermitRequired ? 'Required alongside your national license' : 'Not required for most license holders' },
    { label: 'Security deposit', value: `~$${policies.depositUSD.toLocaleString()} (held on credit card)` },
    { label: 'Accepted cards', value: policies.acceptedCards.join(', ') },
    { label: 'Fuel policy', value: policies.fuelPolicy },
    { label: 'Mileage', value: policies.mileagePolicy },
    { label: 'Late return', value: policies.lateReturnPolicy },
    { label: 'Cancellation', value: policies.cancellationPolicy },
    { label: 'No-show', value: policies.noShowPolicy },
    { label: 'Border crossing', value: policies.borderCrossingRules },
    { label: 'Additional drivers', value: policies.additionalDriverRules },
    { label: 'Smoking', value: policies.smokingPolicy },
    { label: 'Pets', value: policies.petPolicy },
    ...(policies.evChargingPolicy ? [{ label: 'EV charging', value: policies.evChargingPolicy }] : []),
    { label: 'Tolls', value: policies.tollPolicy },
    { label: 'Driving side', value: policies.drivingSide === 'left' ? 'Drive on the left in this country' : 'Drive on the right in this country' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-lg text-slate-900 dark:text-slate-50 mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-blue-600" />
        Rental Policies
      </h3>
      <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
        {rows.map(({ label, value }) => (
          <div key={label} className="border-b border-slate-50 dark:border-slate-800/50 pb-2">
            <dt className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</dt>
            <dd className="text-slate-700 dark:text-slate-300 mt-0.5">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
