import { google } from 'googleapis';
import { searchConsoleConfig } from './config';

function authClient(): InstanceType<typeof google.auth.JWT> {
  const credentials = searchConsoleConfig.credentials;
  if (!credentials) throw new Error('Search Console is not configured (missing GOOGLE_SERVICE_ACCOUNT_JSON_BASE64 or GSC_SITE_URL)');
  return new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
}

function client() {
  return google.searchconsole({ version: 'v1', auth: authClient() });
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Search Console data typically isn't final until ~2-3 days after the fact, so the window ends 3 days ago. */
function dateWindow(days: number): { startDate: string; endDate: string } {
  const end = new Date();
  end.setDate(end.getDate() - 3);
  const start = new Date(end);
  start.setDate(start.getDate() - (days - 1));
  return { startDate: isoDate(start), endDate: isoDate(end) };
}

export interface SearchConsoleTotals {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

function emptyTotals(): SearchConsoleTotals {
  return { clicks: 0, impressions: 0, ctr: 0, position: 0 };
}

/** Aggregate clicks/impressions/CTR/avg. position across the whole property for a window. */
export async function getSearchConsoleTotals(days = 30): Promise<{ range: { startDate: string; endDate: string }; totals: SearchConsoleTotals }> {
  const range = dateWindow(days);
  const res = await client().searchanalytics.query({
    siteUrl: searchConsoleConfig.siteUrl!,
    requestBody: { startDate: range.startDate, endDate: range.endDate },
  });

  const row = res.data.rows?.[0];
  const totals = row
    ? { clicks: row.clicks ?? 0, impressions: row.impressions ?? 0, ctr: row.ctr ?? 0, position: row.position ?? 0 }
    : emptyTotals();

  return { range, totals };
}

export interface SearchConsoleQueryRow {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

/** Top search queries by clicks for the window (dimension: query). */
export async function getSearchConsoleTopQueries(days = 30, limit = 20): Promise<SearchConsoleQueryRow[]> {
  const range = dateWindow(days);
  const res = await client().searchanalytics.query({
    siteUrl: searchConsoleConfig.siteUrl!,
    requestBody: { startDate: range.startDate, endDate: range.endDate, dimensions: ['query'], rowLimit: 250 },
  });

  return (res.data.rows ?? [])
    .map((row) => ({
      query: row.keys?.[0] || '(not set)',
      clicks: row.clicks ?? 0,
      impressions: row.impressions ?? 0,
      ctr: row.ctr ?? 0,
      position: row.position ?? 0,
    }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, limit);
}

export interface SearchConsolePageRow {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

/** Top pages by clicks for the window (dimension: page). */
export async function getSearchConsoleTopPages(days = 30, limit = 20): Promise<SearchConsolePageRow[]> {
  const range = dateWindow(days);
  const res = await client().searchanalytics.query({
    siteUrl: searchConsoleConfig.siteUrl!,
    requestBody: { startDate: range.startDate, endDate: range.endDate, dimensions: ['page'], rowLimit: 250 },
  });

  return (res.data.rows ?? [])
    .map((row) => ({
      page: row.keys?.[0] || '(not set)',
      clicks: row.clicks ?? 0,
      impressions: row.impressions ?? 0,
      ctr: row.ctr ?? 0,
      position: row.position ?? 0,
    }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, limit);
}
