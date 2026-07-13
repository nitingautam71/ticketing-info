import type { OnboardExperience as ExperienceType, CruiseDining } from '@/lib/cruises/types';
import { Ship, Utensils, Award, Smile, Sparkles, CheckCircle2 } from 'lucide-react';

interface OnboardExperienceProps {
  experience: ExperienceType;
  dining: CruiseDining;
}

export default function OnboardExperience({ experience, dining }: OnboardExperienceProps) {
  const allSportsFeatures = experience.sportsFeatures || [];
  
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-8">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/85 pb-4">
        <Ship className="w-5 h-5 text-blue-600" />
        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-50">Onboard Life & Entertainment</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Dining */}
        <div className="space-y-4">
          <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Utensils className="w-4 h-4 text-emerald-500" />
            Culinary Experience
          </h4>
          
          <div className="space-y-3">
            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-1">Included Complimentary Dining</span>
              <div className="flex flex-wrap gap-1.5">
                {dining.complimentary.map((d) => (
                  <span key={d} className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-2.5 py-1 rounded-md text-slate-650 dark:text-slate-350">
                    {d}
                  </span>
                ))}
              </div>
            </div>

            {dining.specialty.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-1">Specialty Fine Dining Options</span>
                <div className="flex flex-wrap gap-1.5">
                  {dining.specialty.map((d) => (
                    <span key={d} className="text-xs bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 px-2.5 py-1 rounded-md text-amber-700 dark:text-amber-400 font-medium">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Dietary Inclusions */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-400 block mb-2">Dietary Accommodations</span>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(dining.dietaryOptions).map(([diet, active]) => (
                  <div key={diet} className="flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className={`w-3.5 h-3.5 ${active ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-700'}`} />
                    <span className={`${active ? 'text-slate-700 dark:text-slate-300 font-medium' : 'text-slate-400'}`}>
                      {diet.charAt(0).toUpperCase() + diet.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Entertainment & Features */}
        <div className="space-y-4">
          <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-500" />
            Vessel Entertainment & Activities
          </h4>

          <div className="space-y-3">
            {experience.broadwayShows.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-1">Broadway-caliber Theater Production</span>
                <p className="text-sm font-bold text-slate-750 dark:text-slate-200">
                  🎭 Featured Show: "{experience.broadwayShows[0]}"
                </p>
              </div>
            )}

            {allSportsFeatures.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-1">Onboard Thrill Activities</span>
                <div className="flex flex-wrap gap-1.5">
                  {allSportsFeatures.map((f) => (
                    <span key={f} className="text-xs bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 px-2.5 py-1 rounded-md text-blue-700 dark:text-blue-400 font-medium">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-2">Amenities Overview</span>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-350">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                  <span>{experience.pools} Swimming Pools</span>
                </div>
                {experience.spa && (
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                    <span>Luxury Spa & Salon</span>
                  </div>
                )}
                {experience.casino && (
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                    <span>Grand Casino Floor</span>
                  </div>
                )}
                {experience.kidsClub && (
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                    <span>Kids & Teen Adventure Clubs</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
