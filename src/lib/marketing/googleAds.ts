import { GoogleAdsApi, enums } from 'google-ads-api';
import { googleAdsConfig } from './config';

function customer() {
  const cfg = googleAdsConfig;
  if (!cfg.isConfigured) throw new Error('Google Ads is not configured (see GOOGLE_ADS_* vars in GOOGLE-MARKETING-API-SETUP.md)');

  const api = new GoogleAdsApi({
    client_id: cfg.clientId!,
    client_secret: cfg.clientSecret!,
    developer_token: cfg.developerToken!,
  });

  return api.Customer({
    customer_id: cfg.customerId!.replace(/-/g, ''),
    refresh_token: cfg.refreshToken!,
    login_customer_id: cfg.loginCustomerId?.replace(/-/g, '') || undefined,
  });
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Ads reporting can lag slightly for the current day, so the window ends yesterday, same as the GA4 client. */
function dateWindow(days: number): { startDate: string; endDate: string } {
  const end = new Date();
  end.setDate(end.getDate() - 1);
  const start = new Date(end);
  start.setDate(start.getDate() - (days - 1));
  return { startDate: isoDate(start), endDate: isoDate(end) };
}

export interface GoogleAdsAccountInfo {
  id: string;
  descriptiveName: string;
  currencyCode: string;
  timeZone: string;
}

/** Minimal identity query, mostly used to confirm the connection actually resolves before trusting the numbers below. */
export async function getGoogleAdsAccountInfo(): Promise<GoogleAdsAccountInfo> {
  const rows = await customer().query(`
    SELECT customer.id, customer.descriptive_name, customer.currency_code, customer.time_zone
    FROM customer
    LIMIT 1
  `);

  const row = rows[0];
  return {
    id: String(row?.customer?.id ?? googleAdsConfig.customerId),
    descriptiveName: row?.customer?.descriptive_name || '(unnamed account)',
    currencyCode: row?.customer?.currency_code || 'USD',
    timeZone: row?.customer?.time_zone || '',
  };
}

export interface GoogleAdsCampaignRow {
  id: string;
  name: string;
  status: string;
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  conversionsValue: number;
  ctr: number;
  averageCpc: number;
}

/** Per-campaign spend/clicks/conversions aggregated over `days`, most expensive campaign first. */
export async function getGoogleAdsCampaignSummary(days = 30): Promise<{ range: { startDate: string; endDate: string }; campaigns: GoogleAdsCampaignRow[] }> {
  const range = dateWindow(days);

  const rows = await customer().query(`
    SELECT
      campaign.id,
      campaign.name,
      campaign.status,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros,
      metrics.conversions,
      metrics.conversions_value,
      metrics.ctr,
      metrics.average_cpc
    FROM campaign
    WHERE segments.date BETWEEN '${range.startDate}' AND '${range.endDate}'
      AND campaign.status != 'REMOVED'
    ORDER BY metrics.cost_micros DESC
  `);

  const campaigns: GoogleAdsCampaignRow[] = rows.map((row) => ({
    id: String(row.campaign?.id ?? ''),
    name: row.campaign?.name || '(unnamed campaign)',
    // The API returns enum fields as numbers; map back to the label ("ENABLED", "PAUSED", …).
    status: typeof row.campaign?.status === 'number' ? enums.CampaignStatus[row.campaign.status] ?? 'UNKNOWN' : String(row.campaign?.status ?? 'UNKNOWN'),
    impressions: Number(row.metrics?.impressions ?? 0),
    clicks: Number(row.metrics?.clicks ?? 0),
    cost: Number(row.metrics?.cost_micros ?? 0) / 1_000_000,
    conversions: Number(row.metrics?.conversions ?? 0),
    conversionsValue: Number(row.metrics?.conversions_value ?? 0),
    ctr: Number(row.metrics?.ctr ?? 0),
    averageCpc: Number(row.metrics?.average_cpc ?? 0) / 1_000_000,
  }));

  return { range, campaigns };
}
