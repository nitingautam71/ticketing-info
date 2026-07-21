import type { TrainOperator, TrainService, TrainStation } from '@/lib/trains/types';
import { TRAIN_STATIONS } from '@/lib/trains/data/stations';
import { TRAIN_OPERATORS, isOperatorEnabled } from '@/lib/trains/data/operators';
import { US_TRAIN_SERVICES } from '@/lib/trains/data/services-us';

/**
 * Rail content provider abstraction. Everything downstream (engine, pages,
 * search API, AI grounding) consumes this interface, so integrating a live
 * operator feed — an Amtrak agency channel or GDS rail content, a commercial
 * aggregator like SilverRail/Trainline Partner Solutions, or a future
 * cross-border VIA Rail feed — means implementing another provider here without
 * touching business logic. See TRAIN-PLATFORM.md for the provider comparison.
 *
 * `services()` returns only the services of *enabled* operators, so a disabled
 * placeholder operator (Brightline, Alaska Railroad, VIA Rail) can carry
 * bundled data yet stay invisible until it is switched on via configuration.
 * `allServices()` exposes the full catalog for tooling that needs it.
 */
export interface RailContentProvider {
  id: string;
  stations(): TrainStation[];
  operators(): TrainOperator[];
  services(): TrainService[];
  allServices(): TrainService[];
}

/** Curated timetable dataset bundled at build time: zero external calls per
 * search, survives provider/DB outages, refreshed via code review. */
class BundledRailProvider implements RailContentProvider {
  id = 'bundled-amtrak-2026';
  private readonly catalog: TrainService[] = [...US_TRAIN_SERVICES];

  stations(): TrainStation[] {
    return TRAIN_STATIONS;
  }
  operators(): TrainOperator[] {
    return TRAIN_OPERATORS;
  }
  /** Active catalog: services of enabled operators only (Amtrak today). */
  services(): TrainService[] {
    return this.catalog.filter((s) => isOperatorEnabled(s.operator));
  }
  /** Full bundled catalog, including services of disabled placeholder operators. */
  allServices(): TrainService[] {
    return this.catalog;
  }
}

export const railProvider: RailContentProvider = new BundledRailProvider();
