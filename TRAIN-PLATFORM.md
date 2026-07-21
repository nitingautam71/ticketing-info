# Amtrak Rail Platform

The rail layer of Ticketing-Info.org: an **Amtrak-first US passenger-rail** platform — corridor search, named-train pages, station guides, rail passes, a grounded AI rail assistant, an admin service-status console, and lead capture into the existing CRM. The architecture is multi-operator; today only Amtrak is switched on, with Brightline, Alaska Railroad and VIA Rail (Canada) staged as disabled placeholders.

## Architecture

```
                     ┌────────────────────────────────────────────┐
                     │  src/lib/trains/data/                      │
                     │  stations.ts (75)  operators.ts (4)        │
                     │  services-us.ts (37 Amtrak + 3 disabled)   │
                     └───────────────────┬────────────────────────┘
                                         │ bundled at build time
┌──────────────┐   services()   ┌────────▼───────────┐  overrides   ┌──────────────────────┐
│ Provider     │◄───────────────│  Rail Engine       │◄─────────────│ Postgres (Neon)      │
│ abstraction  │  enabled-only  │  src/lib/trains/   │  60s cache   │ TrainServiceOverride │
│ providers/   │                │  engine.ts         │              │ TrainSearchLog       │
│ trains.ts    │                └────────┬───────────┘              └──────────────────────┘
└──────────────┘                         │
     ┌──────────────┬────────────────────┼──────────────────┬────────────────────┐
     ▼              ▼                    ▼                  ▼                    ▼
/api/trains/search  /trains hub   /trains/route/[from]/[to]  /trains/train/[slug]  /api/trains/assistant
(JSON contract)     (search UI)   (ISR corridor pages)       /trains/station/[slug] (grounded Gemini)
```

**Design decisions**

- **Bundled timetables + DB status overrides.** The curated Amtrak dataset ships inside the serverless bundle, so a corridor search needs **zero external calls**, survives DB outages, and never blocks builds (this repo's CI has no `DATABASE_URL`). Only *mutable* state lives in Postgres: rail-desk disruption notices (`TrainServiceOverride`, always wins, 60s in-memory cache) and analytics (`TrainSearchLog`).
- **Operator feature flags (the expansion seam).** Each operator in `operators.ts` has an `enabled` flag. `railProvider.services()` returns only enabled-operator services, and `activeStations()` / `activeStationsList()` only stations they serve. Adding a network — Brightline, Alaska Railroad, VIA Rail — is a **configuration change** (`enabled: true`), not a code change: search, pages, sitemap, station directory and AI grounding pick it up automatically. Brightline and Alaska timetable data is retained in the bundle (gated off) precisely so the switch is one line; VIA Rail is a pure operator placeholder with `country: 'CA'` reserved for cross-border support.
- **Provider abstraction.** `RailContentProvider.{stations,operators,services,allServices}()` is the single seam for swapping the bundled dataset for a live operator or aggregator feed (see below) — the engine, pages, API and AI grounding are source-agnostic.
- **Canonical corridor URLs.** The search form navigates to `/trains/route/{from-city}/{to-city}` rather than rendering results client-side: every result is shareable, cacheable (ISR, 24h) and indexable. City-slug based, so multi-station cities (Boston's BOS + BON, New York's Moynihan) resolve to one page.
- **Segment-aware search.** A corridor query matches any origin→destination pair along a service's route in either direction, deriving departure/arrival clock times, overnight day offsets, intermediate stop counts, and fares scaled to the travelled share of the run (floored at 35%).
- **On-demand ISR, never build-time generation.** Corridor, train and station pages materialise when first visited (no `generateStaticParams`), per this repo's no-DB-at-build rule.

## Coverage (active: Amtrak)

64 Amtrak stations and **37 services** spanning the network the brief asks for:

| Group | Services |
|---|---|
| Northeast Corridor | Acela, Northeast Regional, Keystone Service |
| State / regional corridors | Pacific Surfliner, Capitol Corridor, San Joaquins, Amtrak Cascades, Hiawatha, Lincoln Service, Missouri River Runner, Wolverine, Empire Service, Downeaster, Piedmont, Carolinian, Borealis, Heartland Flyer |
| Long-distance & overnight | California Zephyr, Coast Starlight, Empire Builder, Southwest Chief, Texas Eagle, Sunset Limited, City of New Orleans, Crescent, Cardinal, Lake Shore Limited, Capitol Limited, Silver Star, Silver Meteor, Floridian, Palmetto, Auto Train |
| Scenic / cross-border (US portion) | Adirondack, Ethan Allen Express, Vermonter, Maple Leaf |

Named routes are all data (`services-us.ts`) — nothing is hardcoded in business logic. Adding or amending a route is a data edit plus a test run.

**Disabled placeholders** (bundled but gated off): Brightline (Florida, 6 stations), Alaska Railroad (5 stations), VIA Rail Canada (operator only). Flip `enabled: true` in `operators.ts` to activate.

## India removal

The prior release covered Indian Railways; this refactor removed it entirely:

- Deleted `src/lib/trains/data/services-in.ts` (23 services) and every Indian station from `stations.ts`; removed the `indian-railways` operator.
- Dropped the `'IN'` country and `'INR'` currency from the type system (now `'US' | 'CA'` and `'USD' | 'CAD'`), and all INR formatting/rounding/conversion paths.
- Rewrote the hub, passes page, AI assistant prompt, admin copy and search UI to be Amtrak/US-only; the assistant now politely declines Indian Railways / IRCTC / other-network questions and steers back to US rail.
- Tests assert India is gone (no Indian station/service/operator resolves; Indian city and train-slug lookups return nothing).
- **No schema migration needed:** `TrainServiceOverride`/`TrainSearchLog` were never India-specific (keyed by train slug / free-text query). Historical Indian rows in `TrainSearchLog` are analytics data, not schema — purge with a one-off `DELETE` if desired; nothing references them.
- **Out of scope, flagged not deleted:** two pre-existing India-oriented *marketing* landing pages under the train section — `/trains/senior-citizen-train-ticket-discount` (IRCTC senior-quota SEO page) and `/lp/train-bus-tickets` — predate this platform and may carry live ad spend. They were left in place for a product/marketing decision rather than removed unilaterally.

## Data honesty

Every fare and schedule is **indicative**, compiled from published Amtrak timetables. The disclaimer renders on every corridor and train page and is injected into the AI prompt; fare chips are labelled "indicative"; booking routes through the consultant enquiry flow rather than implying instant ticketing.

## API contracts

### `GET /api/trains/search?from=new-york&to=washington-dc`
`from`/`to`: station code (`NYP`), station slug, city slug, or free text. Rate limit 30/min/IP, edge-cached 1h. Returns `CorridorResult` (resolved stations, journeys with segment timings/day offset/stop count/scaled fares/live status, `fastest`, `cheapest`, disclaimer). Only enabled-operator (Amtrak) journeys are ever returned. Errors: 400 invalid, 404 unknown station/city, 429 rate-limited.

### `POST /api/trains/assistant`
Body `{question, from?, to?, history?}`. Rate limit 8/min/IP. Grounds the model on the detected corridor, named train and pass catalog via the same engine, injected as `VERIFIED_DATA`. Scope-limited to Amtrak/US rail: it declines Indian Railways and other unsupported networks. Hardening: figures come only from `VERIFIED_DATA`, user text is untrusted, prompt-reveal/role-change refused, no tools, no DB writes beyond the analytics log.

### `PUT/DELETE /api/admin/trains`
Admin-gated, zod-validated service-status notices; validates the slug against the active catalog, invalidates the engine cache, writes `AuditLog`.

## Pages

| Route | Purpose | Rendering |
|---|---|---|
| `/trains` | Hub: search, featured Amtrak corridors (NEC + long-distance), AI assistant, iconic trains, operator registry (live + "coming soon"), station directory, FAQ | static |
| `/trains/route/[from]/[to]` | Every Amtrak train on a corridor: timings, day offsets, amenities, class fares, booking CTAs; FAQ/Breadcrumb/TrainTrip JSON-LD | ISR 24h |
| `/trains/train/[slug]` | Named-train page: full timetable, classes, amenities, operator policies, status banner | ISR 1h |
| `/trains/station/[slug]` | Station guide: departure board, facilities, connections, map. 404s for disabled-operator-only stations | ISR 24h |
| `/trains/passes` | Amtrak pass comparison (USA Rail Pass, California Rail Pass, multi-ride/monthly; VIA Canrailpass shown "coming soon") | static |
| `/admin/trains` | Service-status console, operator registry (enabled/disabled), 30-day search analytics incl. zero-result coverage gaps | dynamic |

SEO: the sitemap enumerates active station guides, Amtrak train pages, `/trains/passes` and every real city-pair corridor (`allCorridorPairs()`, derived from active services only). Corridor/train/station titles and descriptions are Amtrak-framed.

## Commercial data providers (upgrade path)

The bundled dataset is content, not live inventory. When live availability/ticketing is warranted, implement a second `RailContentProvider` (and a booking provider):

| Provider | Capability | Notes |
|---|---|---|
| **Amtrak agency channels / GDS rail** (Sabre, Amadeus rail) | Availability, fares, ticketing | Amtrak has no public booking API; distribution runs through agency/GDS agreements. The route to true US ticketing. |
| **SilverRail / Trainline Partner Solutions** | Multi-carrier search + booking via one integration | Fastest path to many operators at once, including the North American expansion. |
| **Brightline affiliate** | Referral | Lowest-effort monetisation for the Florida corridor when Brightline is switched on. |
| **VIA Rail (Canada)** | Cross-border availability | Pairs with the Maple Leaf/Adirondack routes for the first cross-border itineraries. |

## Operations

- **Add/amend an Amtrak route or station**: edit `src/lib/trains/data/`, run `npm test` (integrity tests catch unknown station refs, non-monotonic stop times, duplicate slugs, orphan stations), PR. Live on next deploy.
- **Enable a new operator**: set `enabled: true` in `operators.ts` (and add its services/stations if not already bundled). No other code change — the admin operator panel reflects status.
- **Flag a disruption now**: `/admin/trains` → status notice → live on search within 60s; pages pick it up at next ISR revalidation.
- **Find coverage gaps**: `/admin/trains` lists the most-searched queries that returned zero results — the backlog for which route/station to add next.
- **Monitoring**: `TrainSearchLog` top corridors on `/admin/trains`; GA4 events `train_search`, `train_book_click`, `train_assistant_ask`.
- **Tests**: `src/lib/trains/engine.test.ts` — operator gating, India-removal assertions, dataset integrity, Amtrak route coverage, station resolution, corridor search, timetables/boards, active-station derivation, sitemap enumeration, formatting. Run with `npm test`.

> Local `npm run build` needs `NODE_OPTIONS=--max-old-space-size=6144` (the `google-ads-api` type definitions OOM the default heap); CI sets this already.

## Launch checklist

- [x] India rail fully removed (data, types, currency, copy, prompt); tests assert its absence
- [x] Amtrak catalog covers the brief's headline routes (37 services, 64 stations)
- [x] Operator feature flags; Brightline/Alaska/VIA Rail staged as disabled placeholders, activatable via config
- [x] Typecheck, lint, 107 unit tests green; production build passes
- [x] Rate limiting on both public endpoints; admin routes double-gated; zod on every input
- [x] JSON-LD (FAQ, breadcrumbs, TrainTrip, TrainStation), canonicals, sitemap entries (active operators only)
- [x] Indicative-fare labelling and disclaimer on every result, page and AI answer
- [ ] Decide on the two pre-existing India train landing pages (`/trains/senior-citizen-train-ticket-discount`, `/lp/train-bus-tickets`) — remove, redirect, or keep — checking Google Ads targeting first
- [ ] Post-deploy: request re-indexing for `/trains` + top Amtrak corridors in Search Console
