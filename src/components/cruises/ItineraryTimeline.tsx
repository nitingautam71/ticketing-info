import type { DayItinerary } from '@/lib/cruises/types';
import { Anchor, Compass, Clock, Utensils, Music, Footprints } from 'lucide-react';

interface ItineraryTimelineProps {
  itinerary: DayItinerary[];
}

export default function ItineraryTimeline({ itinerary }: ItineraryTimelineProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 mb-6">
        <Anchor className="w-5 h-5 text-blue-600" />
        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-50">Day-by-Day Voyage Itinerary</h3>
      </div>

      <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-4 pl-8 space-y-12">
        {itinerary.map((day) => {
          const isAtSea = day.portName.toLowerCase().includes('at sea') || day.portName.toLowerCase().includes('cruising');

          return (
            <div key={day.day} className="relative group">
              {/* Dot indicator */}
              <span className="absolute -left-[41px] top-1.5 flex items-center justify-center w-6 h-6 rounded-full border-4 border-white dark:border-slate-900 bg-blue-600 group-hover:bg-blue-700 transition-colors z-10 shadow-sm text-[10px] font-bold text-white">
                {day.day}
              </span>

              {/* Day Header */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                  Day {day.day}
                </span>
                <h4 className="text-md font-extrabold text-slate-850 dark:text-slate-50">
                  {day.portName}
                </h4>
                
                {/* Arrival/Departure badges */}
                {!isAtSea && day.arrivalTime !== 'Embarkation' && day.arrivalTime !== 'Disembarkation' && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded">
                    <Clock className="w-3 h-3" />
                    {day.arrivalTime} - {day.departureTime}
                  </span>
                )}
                {day.arrivalTime === 'Embarkation' && (
                  <span className="text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 px-2 py-0.5 rounded">
                    Embarkation
                  </span>
                )}
                {day.arrivalTime === 'Disembarkation' && (
                  <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded">
                    Disembarkation
                  </span>
                )}
                {isAtSea && (
                  <span className="text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 px-2 py-0.5 rounded">
                    At Sea
                  </span>
                )}
              </div>

              {/* Day description */}
              {day.activities && day.activities.length > 0 && (
                <div className="bg-slate-50/50 dark:bg-slate-900/40 border border-slate-50 dark:border-slate-850 rounded-2xl p-5 space-y-4 max-w-3xl">
                  <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed">
                    {day.activities.join(' • ')}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    {/* Excursions */}
                    {day.suggestedExcursions && day.suggestedExcursions.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <Footprints className="w-3.5 h-3.5 text-blue-500" />
                          Shore Activities
                        </span>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          {day.suggestedExcursions.join(', ')}
                        </p>
                      </div>
                    )}

                    {/* Dining */}
                    {day.diningRecommendations && day.diningRecommendations.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <Utensils className="w-3.5 h-3.5 text-emerald-500" />
                          Dining
                        </span>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          {day.diningRecommendations.join(', ')}
                        </p>
                      </div>
                    )}

                    {/* Evening entertainment */}
                    {day.eveningEntertainment && day.eveningEntertainment.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <Music className="w-3.5 h-3.5 text-amber-500" />
                          Evening Show
                        </span>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          {day.eveningEntertainment.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
