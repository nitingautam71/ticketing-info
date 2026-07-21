import type { TrainOperator, TrainService, TrainStation } from '@/lib/trains/types';
import { TRAIN_STATIONS } from '@/lib/trains/data/stations';
import { TRAIN_OPERATORS } from '@/lib/trains/data/operators';
import { US_TRAIN_SERVICES } from '@/lib/trains/data/services-us';
import { IN_TRAIN_SERVICES } from '@/lib/trains/data/services-in';

/**
 * Rail content provider abstraction. Everything downstream (engine, pages,
 * search API, AI grounding) consumes this interface, so integrating a live
 * operator feed — an IRCTC-authorised booking partner for India, an Amtrak
 * agency channel or GDS rail content for the US, or a commercial aggregator
 * like SilverRail/Trainline Partner Solutions — means implementing another
 * provider here without touching business logic. See TRAIN-PLATFORM.md for the
 * provider comparison and integration sequence.
 */
export interface RailContentProvider {
  id: string;
  stations(): TrainStation[];
  operators(): TrainOperator[];
  services(): TrainService[];
}

/** Curated timetable dataset bundled at build time: zero external calls per
 * search, survives provider/DB outages, refreshed via code review. */
class BundledRailProvider implements RailContentProvider {
  id = 'bundled-2026';
  stations(): TrainStation[] {
    return TRAIN_STATIONS;
  }
  operators(): TrainOperator[] {
    return TRAIN_OPERATORS;
  }
  services(): TrainService[] {
    return [...US_TRAIN_SERVICES, ...IN_TRAIN_SERVICES];
  }
}

export const railProvider: RailContentProvider = new BundledRailProvider();
