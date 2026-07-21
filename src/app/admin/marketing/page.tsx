import Link from 'next/link';
import { ga4Config, googleAdsConfig, searchConsoleConfig } from '@/lib/marketing/config';
import { getGa4Overview, getGa4ChannelBreakdown, getGa4TopLandingPages, type Ga4Overview, type Ga4ChannelRow, type Ga4LandingPageRow } from '@/lib/marketing/ga4';
import {
  getSearchConsoleTotals,
  getSearchConsoleTopQueries,
  getSearchConsoleTopPages,
  type SearchConsoleTotals,
  type SearchConsoleQueryRow,
  type SearchConsolePageRow,
} from '@/lib/marketing/searchConsole';
import { getGoogleAdsAccountInfo, getGoogleAdsCampaignSummary, type GoogleAdsAccountInfo, type GoogleAdsCampaignRow } from '@/lib/marketing/googleAds';
import { formatNumber, formatPercent, formatCurrency, formatDuration, formatChange } from '@/lib/marketing/format';

export const dynamic = 'force-dynamic';

const RANGE_OPTIONS = [7, 30, 90] as const;
type RangeDays = (typeof RANGE_OPTIONS)[number];

interface Ga4Data {
  overview: Ga4Overview;
  channels: Ga4ChannelRow[];
  landingPages: Ga4LandingPageRow[];
}

interface GscData {
  totals: { range: { startDate: string; endDate: string }; totals: SearchConsoleTotals };
  queries: SearchConsoleQueryRow[];
  pages: SearchConsolePageRow[];
}

interface AdsData {
  account: GoogleAdsAccountInfo;
  summary: { range: { startDate: string; endDate: string }; campaigns: GoogleAdsCampaignRow[] };
}

type SourceResult<T> = { status: 'ok'; data: T } | { status: 'unconfigured' } | { status: 'error'; message: string };

async function loadSource<T>(configured: boolean, loader: () => Promise<T>): Promise<SourceResult<T>> {
  if (!configured) return { status: 'unconfigured' };
  try {
    return { status: 'ok', data: await loader() };
  } catch (err) {
    console.error('Marketing source failed', err);
    return { status: 'error', message: err instanceof Error ? err.message : 'Unknown error' };
  }
}

function ChangeBadge({ pct }: { pct: number | null | undefined }) {
  const { text, direction } = formatChange(pct ?? null);
  const color =
    direction === 'up' ? 'text-emerald-400' : direction === 'down' ? 'text-red-400' : 'text-neutral-500';
  return <span className={`text-xs font-bold ${color}`}>{text}</span>;
}

function SourceCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
      <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">{title}</h2>
      {children}
    </div>
  );
}

function UnconfiguredNotice({ source, vars }: { source: string; vars: string[] }) {
  return (
    <div className="text-sm text-neutral-400 space-y-2">
      <p>{source} is not connected.</p>
      <p className="text-xs text-neutral-500">
        Set{' '}
        {vars.map((v, i) => (
          <span key={v}>
            {i > 0 && ', '}
            <code className="text-neutral-300 font-mono text-[11px]">{v}</code>
          </span>
        ))}{' '}
        — see <code className="text-neutral-300 font-mono text-[11px]">GOOGLE-MARKETING-API-SETUP.md</code> for how to get each value.
      </p>
    </div>
  );
}

function ErrorNotice({ message }: { message: string }) {
  return (
    <div className="text-sm text-red-400 space-y-1">
      <p>Failed to load data from this source.</p>
      <p className="text-xs text-red-500/80 font-mono break-all">{message}</p>
    </div>
  );
}

const TH = 'p-3 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-wider';
const TD = 'p-3 text-xs text-neutral-300';

export default async function AdminMarketingPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const { range } = await searchParams;
  const parsed = Number(range);
  const days: RangeDays = (RANGE_OPTIONS as readonly number[]).includes(parsed) ? (parsed as RangeDays) : 30;

  const [ga4, gsc, ads] = await Promise.all([
    loadSource<Ga4Data>(ga4Config.isConfigured, async () => {
      const [overview, channels, landingPages] = await Promise.all([
        getGa4Overview(days),
        getGa4ChannelBreakdown(days),
        getGa4TopLandingPages(days),
      ]);
      return { overview, channels, landingPages };
    }),
    loadSource<GscData>(searchConsoleConfig.isConfigured, async () => {
      const [totals, queries, pages] = await Promise.all([
        getSearchConsoleTotals(days),
        getSearchConsoleTopQueries(days),
        getSearchConsoleTopPages(days),
      ]);
      return { totals, queries, pages };
    }),
    loadSource<AdsData>(googleAdsConfig.isConfigured, async () => {
      const [account, summary] = await Promise.all([getGoogleAdsAccountInfo(), getGoogleAdsCampaignSummary(days)]);
      return { account, summary };
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Marketing</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Live GA4, Search Console and Google Ads data. Windows end 1-3 days ago because each source finalizes data on a lag.
          </p>
        </div>
        <div className="flex gap-1 bg-neutral-900 border border-neutral-800 rounded-xl p-1">
          {RANGE_OPTIONS.map((option) => (
            <Link
              key={option}
              href={`/admin/marketing?range=${option}`}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                option === days ? 'bg-emerald-600 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {option}d
            </Link>
          ))}
        </div>
      </div>

      <SourceCard title={`Website — GA4 (last ${days} days vs. previous ${days})`}>
        {ga4.status === 'unconfigured' && (
          <UnconfiguredNotice source="Google Analytics 4" vars={['GOOGLE_SERVICE_ACCOUNT_JSON_BASE64', 'GA4_PROPERTY_ID']} />
        )}
        {ga4.status === 'error' && <ErrorNotice message={ga4.message} />}
        {ga4.status === 'ok' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(
                [
                  { label: 'Sessions', value: formatNumber(ga4.data.overview.current.sessions), key: 'sessions' },
                  { label: 'Users', value: formatNumber(ga4.data.overview.current.totalUsers), key: 'totalUsers' },
                  { label: 'New Users', value: formatNumber(ga4.data.overview.current.newUsers), key: 'newUsers' },
                  { label: 'Engagement Rate', value: formatPercent(ga4.data.overview.current.engagementRate * 100), key: 'engagementRate' },
                  { label: 'Avg. Session', value: formatDuration(ga4.data.overview.current.averageSessionDurationSeconds), key: 'averageSessionDurationSeconds' },
                  { label: 'Conversions', value: formatNumber(ga4.data.overview.current.conversions), key: 'conversions' },
                  { label: 'Engaged Sessions', value: formatNumber(ga4.data.overview.current.engagedSessions), key: 'engagedSessions' },
                  { label: 'Revenue', value: formatCurrency(ga4.data.overview.current.totalRevenue), key: 'totalRevenue' },
                ] as const
              ).map((stat) => (
                <div key={stat.label} className="bg-neutral-950 border border-neutral-850 rounded-xl p-4">
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-black text-white mt-1">{stat.value}</p>
                  <ChangeBadge pct={ga4.data.overview.changePct[stat.key]} />
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Traffic by Channel</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-800">
                      <th className={TH}>Channel</th>
                      <th className={TH}>Sessions</th>
                      <th className={TH}>Engagement</th>
                      <th className={TH}>Conversions</th>
                      <th className={TH}>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ga4.data.channels.map((row) => (
                      <tr key={row.channel} className="border-b border-neutral-850 last:border-0">
                        <td className={`${TD} text-white font-medium`}>{row.channel}</td>
                        <td className={TD}>{formatNumber(row.sessions)}</td>
                        <td className={TD}>{formatPercent(row.engagementRate * 100)}</td>
                        <td className={TD}>{formatNumber(row.conversions)}</td>
                        <td className={TD}>{formatCurrency(row.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Top Landing Pages</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-800">
                      <th className={TH}>Page</th>
                      <th className={TH}>Sessions</th>
                      <th className={TH}>Engagement</th>
                      <th className={TH}>Bounce</th>
                      <th className={TH}>Conversions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ga4.data.landingPages.map((row) => (
                      <tr key={row.page} className="border-b border-neutral-850 last:border-0">
                        <td className={`${TD} font-mono text-[11px] max-w-xs truncate`}>{row.page}</td>
                        <td className={TD}>{formatNumber(row.sessions)}</td>
                        <td className={TD}>{formatPercent(row.engagementRate * 100)}</td>
                        <td className={TD}>{formatPercent(row.bounceRate * 100)}</td>
                        <td className={TD}>{formatNumber(row.conversions)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </SourceCard>

      <SourceCard title={`Organic Search — Search Console (last ${days} days)`}>
        {gsc.status === 'unconfigured' && (
          <UnconfiguredNotice source="Google Search Console" vars={['GOOGLE_SERVICE_ACCOUNT_JSON_BASE64', 'GSC_SITE_URL']} />
        )}
        {gsc.status === 'error' && <ErrorNotice message={gsc.message} />}
        {gsc.status === 'ok' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Clicks', value: formatNumber(gsc.data.totals.totals.clicks) },
                { label: 'Impressions', value: formatNumber(gsc.data.totals.totals.impressions) },
                { label: 'CTR', value: formatPercent(gsc.data.totals.totals.ctr * 100, 2) },
                { label: 'Avg. Position', value: gsc.data.totals.totals.position.toFixed(1) },
              ].map((stat) => (
                <div key={stat.label} className="bg-neutral-950 border border-neutral-850 rounded-xl p-4">
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-black text-white mt-1">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Top Queries</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-neutral-800">
                        <th className={TH}>Query</th>
                        <th className={TH}>Clicks</th>
                        <th className={TH}>Impr.</th>
                        <th className={TH}>CTR</th>
                        <th className={TH}>Pos.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gsc.data.queries.map((row) => (
                        <tr key={row.query} className="border-b border-neutral-850 last:border-0">
                          <td className={`${TD} text-white max-w-[16rem] truncate`}>{row.query}</td>
                          <td className={TD}>{formatNumber(row.clicks)}</td>
                          <td className={TD}>{formatNumber(row.impressions)}</td>
                          <td className={TD}>{formatPercent(row.ctr * 100, 2)}</td>
                          <td className={TD}>{row.position.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Top Pages</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-neutral-800">
                        <th className={TH}>Page</th>
                        <th className={TH}>Clicks</th>
                        <th className={TH}>Impr.</th>
                        <th className={TH}>CTR</th>
                        <th className={TH}>Pos.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gsc.data.pages.map((row) => (
                        <tr key={row.page} className="border-b border-neutral-850 last:border-0">
                          <td className={`${TD} font-mono text-[11px] max-w-[16rem] truncate`}>{row.page.replace(/^https?:\/\/[^/]+/, '') || '/'}</td>
                          <td className={TD}>{formatNumber(row.clicks)}</td>
                          <td className={TD}>{formatNumber(row.impressions)}</td>
                          <td className={TD}>{formatPercent(row.ctr * 100, 2)}</td>
                          <td className={TD}>{row.position.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </SourceCard>

      <SourceCard title={`Paid — Google Ads (last ${days} days)`}>
        {ads.status === 'unconfigured' && (
          <UnconfiguredNotice
            source="Google Ads"
            vars={[
              'GOOGLE_ADS_DEVELOPER_TOKEN',
              'GOOGLE_ADS_CLIENT_ID',
              'GOOGLE_ADS_CLIENT_SECRET',
              'GOOGLE_ADS_REFRESH_TOKEN',
              'GOOGLE_ADS_CUSTOMER_ID',
            ]}
          />
        )}
        {ads.status === 'error' && <ErrorNotice message={ads.message} />}
        {ads.status === 'ok' && (
          <div className="space-y-4">
            <p className="text-xs text-neutral-500">
              Account: <span className="text-neutral-300">{ads.data.account.descriptiveName}</span> ({ads.data.account.id}) ·{' '}
              {ads.data.account.currencyCode}
            </p>
            {ads.data.summary.campaigns.length === 0 ? (
              <p className="text-sm text-neutral-400">No campaign activity in this window.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-800">
                      <th className={TH}>Campaign</th>
                      <th className={TH}>Status</th>
                      <th className={TH}>Impr.</th>
                      <th className={TH}>Clicks</th>
                      <th className={TH}>CTR</th>
                      <th className={TH}>Avg. CPC</th>
                      <th className={TH}>Cost</th>
                      <th className={TH}>Conv.</th>
                      <th className={TH}>Cost / Conv.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ads.data.summary.campaigns.map((row) => (
                      <tr key={row.id} className="border-b border-neutral-850 last:border-0">
                        <td className={`${TD} text-white font-medium max-w-xs truncate`}>{row.name}</td>
                        <td className={TD}>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider ${
                              row.status === 'ENABLED' ? 'text-emerald-400' : 'text-neutral-500'
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className={TD}>{formatNumber(row.impressions)}</td>
                        <td className={TD}>{formatNumber(row.clicks)}</td>
                        <td className={TD}>{formatPercent(row.ctr * 100, 2)}</td>
                        <td className={TD}>{formatCurrency(row.averageCpc, ads.data.account.currencyCode)}</td>
                        <td className={TD}>{formatCurrency(row.cost, ads.data.account.currencyCode)}</td>
                        <td className={TD}>{formatNumber(row.conversions)}</td>
                        <td className={TD}>
                          {row.conversions > 0 ? formatCurrency(row.cost / row.conversions, ads.data.account.currencyCode) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </SourceCard>
    </div>
  );
}
