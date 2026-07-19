# Cruise Call Generation Engine — Ticketing-Info

The cruise vertical's job is different from the rest of the site: its primary KPI is **qualified inbound
phone calls from U.S. customers** that convert into cruise bookings. Cruises are a high-consideration,
high-ticket product that people overwhelmingly finish buying on the phone — the site's role is to earn the
search click, build enough trust to make dialing feel safe, and attribute every call back to the campaign
and page that produced it.

This document covers what is now **built in this codebase**, how to operate it, and the staged path from
here to enterprise scale. It pairs with:

- `ADS-KEYWORD-PLAN.md` — Ad Group 5 is the cruise PPC keyword set.
- `GOOGLE-ADS-SETUP.md` — account structure and conversion wiring shared by all verticals.
- `MARKETING-PLAYBOOK.md` — off-site work (GBP, reviews, listings) that this engine depends on.
- `SEO-CONTENT-PLAN.md` — the organic content strategy the cruise hub cluster now extends.

---

## 1. What is built (this codebase, live now)

### SEO hub cluster — ~90 indexable pages, one click from `/cruises`

| Page type | Route | Count | Content source |
|---|---|---|---|
| Destination hubs | `/cruises/destination/[slug]` | 33 | Curated intros/FAQ hooks in `src/lib/cruises/hubs.ts` + live catalog stats |
| Cruise line hubs | `/cruises/line/[slug]` | 25 | `src/lib/cruises/cruise-lines.ts` (descriptions, selling points) + fleet data + live stats |
| Departure port hubs | `/cruises/from/[slug]` | 27 with sailings | `src/lib/cruises/ports.ts` (rich port guides) + live stats |
| Paid landing page | `/lp/cruise-deals` | 1 (noindex) | Call-first LP template shared with other verticals |

Every hub page has:

- **Unique curated copy** (not templated filler) plus live numbers — sailing counts, from-prices, and
  duration ranges aggregated from the `CruiseCatalog` Postgres table at render time, revalidated hourly.
- **FAQPage + BreadcrumbList JSON-LD** for AI answer engines (Google AI Overviews, ChatGPT, Perplexity)
  and rich results. Answers embed real prices and counts, which is what answer engines quote.
- **Two `CruiseCallCta` banners** (above the fold and after the FAQs), each with a distinct `placement`
  tag so their call volume is separable in analytics.
- **Cluster cross-links** — destination ↔ line ↔ port ↔ filtered catalog search — so authority and crawl
  paths circulate inside the cruise cluster. The `/cruises` index links every hub; the sitemap includes
  them all.

The pages are SSG with `revalidate = 3600`: CDN-fast (Core Web Vitals) but never more than an hour stale
against the catalog.

### Call attribution pipeline (first-party, no vendor required)

```
visitor lands with ?gclid / utm_* / external referrer
        │
        ▼
AttributionCapture (root layout) → localStorage: first touch (90-day) + last touch
        │
        ▼
CruiseCallCta / LP call buttons clicked
        │            │
        │            ├── GA4 event  click_to_call / whatsapp_click  (existing)
        │            ├── Google Ads conversion ping                  (existing)
        │            └── navigator.sendBeacon → POST /api/calls      (new — survives tel: navigation)
        ▼
CallClick row in Postgres: channel, placement, page, vertical, phone, {firstTouch, lastTouch}
        │
        ▼
/admin/calls — 30-day volume, per-placement counts, per-click source
(Google Ads · campaign / Microsoft Ads / Meta / organic host / direct)
```

Key files: `src/lib/attribution.ts` (capture + beacon, unit-tested), `src/lib/callTracking.ts` +
`src/app/api/calls/route.ts` (validation + persistence, rate-limited), `src/app/admin/calls/page.tsx`
(dashboard), `CallClick` model in `prisma/schema.prisma`.

This answers "which campaign/page/placement produced the call click" today, with zero vendor cost. What it
cannot see is what happened *after* the dial — duration, answered vs. missed, revenue. That is the call
tracking provider's job (§4).

### CRM (already existed — calls flow into it)

Leads (`/api/leads` → admin pipeline with 13 stages, agents, tasks, quotations, communications log) were
already built. The cruise LP and `/get-quote` feed it with `vertical: 'cruise'`. The `CallClick` table is
deliberately separate: clicks are high-volume telemetry, leads are qualified humans; agents work leads,
marketing reads clicks.

---

## 2. Operating playbook (external actions, in order)

1. **Env vars** — confirm in Vercel: `NEXT_PUBLIC_BUSINESS_PHONE` (the number every CTA dials),
   `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_GOOGLE_ADS_ID`, `NEXT_PUBLIC_GOOGLE_ADS_LABEL_CALL`,
   `NEXT_PUBLIC_GOOGLE_ADS_LABEL_WHATSAPP`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
2. **Search Console** — the sitemap already includes the ~90 hub pages; resubmit `sitemap.xml` and watch
   the `/cruises/*` cluster's coverage report for the first two weeks.
3. **Google Ads** — build Ad Group 5 from `ADS-KEYWORD-PLAN.md`: U.S. geo-targeting, **call extensions
   on every ad**, ad schedule biased to consultant staffed hours, and deep links from destination/port/line
   keywords to the matching hub page (message match > generic LP).
4. **Google Business Profile** — add "Cruise agency" as a secondary category to the service-area profile
   from `MARKETING-PLAYBOOK.md`; cruise reviews mentioning destinations feed local pack rankings for
   "cruise travel agent" queries.
5. **Staff the phone.** Every dollar above is wasted if calls ring out. Agree consultant coverage hours
   before enabling the campaign, and pause ad schedules outside them until after-hours routing exists (§4).

---

## 3. KPI framework

| Layer | Metric | Where it lives today |
|---|---|---|
| Traffic | Hub page impressions/clicks per cluster | Search Console (filter `/cruises/`) |
| Engagement | `click_to_call` / `whatsapp_click` by `source` (placement) | GA4 |
| Call intent | CallClick volume by placement/page/source | `/admin/calls` |
| Ads efficiency | Cost per call click (spend ÷ attributed CallClicks) | Google Ads + `/admin/calls` |
| Qualification | Lead stage progression (`new` → `quotation_sent` → `paid`) | `/admin/leads` |
| Revenue | Booking value by lead source | `/admin/bookings` |

The unit economics to watch from week one: **cost per call click → call-to-lead rate → lead-to-booking
rate → revenue per booking**. Each stage has an owner (marketing, consultant, consultant, product mix)
and a fix if it sags (keywords/landing pages, phone staffing/scripts, quoting speed, line mix).

---

## 4. Upgrade path (build only when volume justifies)

**Stage 1 — now (0–50 calls/mo).** One business number everywhere; first-party click attribution as built.
Manually tag inbound calls in the CRM with the lead source the caller mentions.

**Stage 2 — call tracking provider (50+ calls/mo).** Add CallRail or Twilio-based dynamic number
insertion (DNI): a small script swaps the displayed number per session, the provider posts
call-completed webhooks (duration, recording, caller ID) to a new `/api/calls/webhook`, and rows join to
`CallClick` by timestamp + session. This upgrades "call clicks" to "answered qualified calls" per
keyword. Keep the first-party layer — it is the fallback attribution when DNI pools exhaust and the
audit trail for the provider's numbers.

**Stage 3 — routing (multiple consultants).** Provider-level rules, in order: business hours → voicemail
+ instant SMS-back after hours; destination-specialist ring groups keyed on the dialed DNI number's
source page (a Caribbean hub caller rings the Caribbean specialist first); VIP/returning caller ID match
from the CRM rings the owning agent directly. After-hours missed call → automatic SMS + CRM task at
9am next morning ("missed call recovery" — the highest-ROI automation in phone-led travel sales).

**Stage 4 — automation depth.** Webhook-driven: call ≥90s with no lead created → auto-create CRM lead
from caller ID; quotation sent + 48h silence → follow-up task; booking confirmed → review request →
the GBP reviews loop in `MARKETING-PLAYBOOK.md`. n8n or Vercel cron both work; the CRM tables these
flows need already exist.

**Stage 5 — scale-out content.** Ship-level pages (`/cruises/ship/[slug]` — specs and sailings exist in
the catalog already), month/seasonality pages ("Caribbean cruises in January"), and comparison pages
("Royal Caribbean vs Carnival") — each following the same hubs.ts pattern: curated copy + live stats +
FAQ JSON-LD + call CTAs. City "cruise travel agent [city]" pages only where a real local proof point
exists (reviews from that metro, a local number) — pure-template city pages are doorway-page risk with
no local signals to rank on.

---

## 5. Guardrails

- **No fake urgency, no fabricated prices.** Every number on a hub page comes from the catalog table;
  FAQ answers state prices as "from $X per person" with the consultant confirming final fares.
- **`/lp/*` stays noindex** — paid message-match pages, not SEO assets. The hub cluster is the SEO asset.
- **Don't bid on what organic already wins** — once a hub ranks top-3 for its exact term, shift that
  spend to terms it doesn't rank for (same rule as the other verticals).
- **PII discipline** — `CallClick` stores no caller PII (no caller phone numbers — only the business
  number dialed). Caller identity enters only the CRM, through consented lead forms or consultant entry.
  Attribution params are first-party localStorage, 90-day TTL, no cross-site tracking.
