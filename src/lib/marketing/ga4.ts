import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { ga4Config } from './config';

function client(): BetaAnalyticsDataClient {
  const credentials = ga4Config.credentials;
  if (!credentials) throw new Error('GA4 is not configured (missing GOOGLE_SERVICE_ACCOUNT_JSON_BASE64 or GA4_PROPERTY_ID)');
  return new BetaAnalyticsDataClient({ credentials });
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

interface DateRange {
  startDate: string;
  endDate: string;
}

/**
 * GA4 standard reporting can lag by a few hours, so "today" is excluded —
 * the window ends yesterday. `previous` is the immediately preceding window
 * of equal length, used to compute period-over-period % change.
 */
function periodRanges(days: number): { current: DateRange; previous: DateRange } {
  const end = new Date();
  end.setDate(end.getDate() - 1);
  const start = new Date(end);
  start.setDate(start.getDate() - (days - 1));
  const prevEnd = new Date(start);
  prevEnd.setDate(prevEnd.getDate() - 1);
  const prevStart = new Date(prevEnd);
  prevStart.setDate(prevStart.getDate() - (days - 1));

  return {
    current: { startDate: isoDate(start), endDate: isoDate(end) },
    previous: { startDate: isoDate(prevStart), endDate: isoDate(prevEnd) },
  };
}

export interface Ga4Metrics {
  sessions: number;
  totalUsers: number;
  newUsers: number;
  engagedSessions: number;
  engagementRate: number;
  averageSessionDurationSeconds: number;
  conversions: number;
  totalRevenue: number;
}

export interface Ga4Overview {
  currentRange: DateRange;
  previousRange: DateRange;
  current: Ga4Metrics;
  previous: Ga4Metrics;
  /** Percent change current-vs-previous per metric; null when previous was zero (undefined %). */
  changePct: Partial<Record<keyof Ga4Metrics, number | null>>;
}

// 'keyEvents' is the current name for what GA4 used to call 'conversions'.
const OVERVIEW_METRICS = [
  'sessions',
  'totalUsers',
  'newUsers',
  'engagedSessions',
  'engagementRate',
  'averageSessionDuration',
  'keyEvents',
  'totalRevenue',
] as const;

function emptyMetrics(): Ga4Metrics {
  return {
    sessions: 0,
    totalUsers: 0,
    newUsers: 0,
    engagedSessions: 0,
    engagementRate: 0,
    averageSessionDurationSeconds: 0,
    conversions: 0,
    totalRevenue: 0,
  };
}

function pctChange(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return ((current - previous) / previous) * 100;
}

/** Core traffic/conversion/revenue totals for `days` vs. the preceding equal-length period. */
export async function getGa4Overview(days = 30): Promise<Ga4Overview> {
  const { current, previous } = periodRanges(days);

  const [response] = await client().runReport({
    property: `properties/${ga4Config.propertyId}`,
    dateRanges: [
      { startDate: current.startDate, endDate: current.endDate, name: 'current' },
      { startDate: previous.startDate, endDate: previous.endDate, name: 'previous' },
    ],
    metrics: OVERVIEW_METRICS.map((name) => ({ name })),
  });

  const rows = response.rows ?? [];
  const byRange = new Map<string, Ga4Metrics>();

  for (const row of rows) {
    const rangeName = row.dimensionValues?.[0]?.value;
    if (!rangeName) continue;
    const values = row.metricValues ?? [];
    const metrics = emptyMetrics();
    OVERVIEW_METRICS.forEach((key, i) => {
      const raw = Number(values[i]?.value ?? 0);
      if (key === 'averageSessionDuration') metrics.averageSessionDurationSeconds = raw;
      else if (key === 'keyEvents') metrics.conversions = raw;
      else (metrics as unknown as Record<string, number>)[key] = raw;
    });
    byRange.set(rangeName, metrics);
  }

  const currentMetrics = byRange.get('current') ?? emptyMetrics();
  const previousMetrics = byRange.get('previous') ?? emptyMetrics();

  const changePct: Ga4Overview['changePct'] = {};
  (Object.keys(currentMetrics) as Array<keyof Ga4Metrics>).forEach((key) => {
    changePct[key] = pctChange(currentMetrics[key], previousMetrics[key]);
  });

  return { currentRange: current, previousRange: previous, current: currentMetrics, previous: previousMetrics, changePct };
}

export interface Ga4ChannelRow {
  channel: string;
  sessions: number;
  conversions: number;
  revenue: number;
  engagementRate: number;
}

/** Sessions/conversions/revenue by GA4's default channel grouping (Organic Search, Paid Search, Direct, etc.). */
export async function getGa4ChannelBreakdown(days = 30, limit = 12): Promise<Ga4ChannelRow[]> {
  const { current } = periodRanges(days);

  const [response] = await client().runReport({
    property: `properties/${ga4Config.propertyId}`,
    dateRanges: [{ startDate: current.startDate, endDate: current.endDate }],
    dimensions: [{ name: 'sessionDefaultChannelGroup' }],
    metrics: [{ name: 'sessions' }, { name: 'keyEvents' }, { name: 'totalRevenue' }, { name: 'engagementRate' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit,
  });

  return (response.rows ?? []).map((row) => ({
    channel: row.dimensionValues?.[0]?.value || '(not set)',
    sessions: Number(row.metricValues?.[0]?.value ?? 0),
    conversions: Number(row.metricValues?.[1]?.value ?? 0),
    revenue: Number(row.metricValues?.[2]?.value ?? 0),
    engagementRate: Number(row.metricValues?.[3]?.value ?? 0),
  }));
}

export interface Ga4LandingPageRow {
  page: string;
  sessions: number;
  engagementRate: number;
  conversions: number;
  bounceRate: number;
}

/** Top landing pages by sessions, with engagement/bounce/conversion context for each. */
export async function getGa4TopLandingPages(days = 30, limit = 10): Promise<Ga4LandingPageRow[]> {
  const { current } = periodRanges(days);

  const [response] = await client().runReport({
    property: `properties/${ga4Config.propertyId}`,
    dateRanges: [{ startDate: current.startDate, endDate: current.endDate }],
    dimensions: [{ name: 'landingPagePlusQueryString' }],
    metrics: [{ name: 'sessions' }, { name: 'engagementRate' }, { name: 'keyEvents' }, { name: 'bounceRate' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit,
  });

  return (response.rows ?? []).map((row) => ({
    page: row.dimensionValues?.[0]?.value || '(not set)',
    sessions: Number(row.metricValues?.[0]?.value ?? 0),
    engagementRate: Number(row.metricValues?.[1]?.value ?? 0),
    conversions: Number(row.metricValues?.[2]?.value ?? 0),
    bounceRate: Number(row.metricValues?.[3]?.value ?? 0),
  }));
}
