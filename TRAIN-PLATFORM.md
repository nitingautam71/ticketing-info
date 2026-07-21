# Rail Booking Platform

The rail layer of Ticketing-Info.org: corridor search across **US and Indian rail networks**, named-train pages, station guides, rail passes, a grounded AI rail assistant, an admin service-status console, and lead capture into the existing CRM.

## Architecture

```
                     ┌────────────────────────────────────────────┐
                     │  src/lib/trains/data/                      │
                     │  stations.ts (96)  operators.ts (4)        │
                     │  services-us.ts (26)  services-in.ts (23)  │
                     └───────────────────┬────────────────────────┘
                                         │ bundled at build time
┌──────────────┐   services()   ┌────────▼───────────┐  overrides   ┌──────────────────────┐
│ Provider     │◄───────────────│  Rail Engine       │◄─────────────│ Postgres (Neon)      │
│ abstraction  │                │  src/lib/trains/   │  60s cache   │ TrainServiceOverride │
│ providers/   │                │  engine.ts         │              │ TrainSearchLog       │
│ trains.ts    │                └────────┬───────────┘              └──────────────────────┘
└──────────────┘                         │
     ┌──────────────┬────────────────────┼──────────────────┬────────────────────┐
     ▼              ▼                    ▼                  ▼                    ▼
/api/trains/search  /trains hub   /trains/route/[from]/[to]  /trains/train/[slug]  /api/trains/assistant
(JSON contract)     (search UI)   (ISR corridor pages)       /trains/station/[slug] (grounded Gemini)
```

**Design decisions**

- **Bundled timetables + DB status overrides.** The curated dataset ships inside the serverless bundle, so a corridor search needs **zero external calls**, survives DB outages, and never blocks builds (this repo's CI has no `DATABASE_URL`). Only *mutable* state lives in Postgres: rail-desk disruption notices (`TrainServiceOverride`, always wins, 60s in-memory cache) and analytics (`TrainSearchLog`).
- **Provider abstraction.** `src/lib/providers/trains.ts` exposes `RailContentProvider.{stations,operators,services}()`. Swapping the bundled dataset for a live operator or aggregator feed (see below) touches one file — the engine, pages, API and AI grounding are source-agnostic.
- **Canonical corridor URLs.** The search form navigates to `/trains/route/{from-city}/{to-city}` rather than rendering results client-side: every result is shareable, cacheable (ISR, 24h) and indexable. City-slug based, so all stations in a multi-station city (Delhi's NDLS + NZM, Mumbai's CSMT + BCT) resolve to one page.
- **Segment-aware search.** A corridor query matches *any* origin→destination pair along a service's route in either direction, deriving segment departure/arrival clock times, day offsets for overnight runs, intermediate stop counts, and fares scaled to the travelled share of the run (floored at 35%, since short hops on long trains carry minimum fares).
- **On-demand ISR, never build-time generation.** Corridor, train and station pages materialise when first visited (no `generateStaticParams`), per this repo's no-DB-at-build rule.

## Coverage

| Network | Operator record | Services | Notes |
|---|---|---|---|
| **Amtrak** | `amtrak` | 22 | Acela, Northeast Regional, Empire/Cascades/Surfliner/Capitol corridors, and the long-distance network (Zephyr, Empire Builder, Coast Starlight, Southwest Chief, Crescent, Silver Meteor, Floridian, Cardinal, Texas Eagle, Sunset Limited, City of New Orleans, Lake Shore Limited, Carolinian) |
| **Brightline** | `brightline` | 1 | Miami ↔ Orlando International, all six stations |
| **Alaska Railroad** | `alaska-railroad` | 2 | Denali Star, Coastal Classic (seasonal) |
| **Indian Railways / IRCTC** | `indian-railways` | 23 | Vande Bharat (9 corridors), Rajdhani (6), Shatabdi (6), Tejas (2), Duronto, Gatimaan, Tamil Nadu Express |

96 stations across both markets, each with facilities, onward transit connections, coordinates and operator links.

Adding a network is data-only: append to `src/lib/trains/data/`, and corridor/station/train pages, sitemap entries, search and AI grounding pick it up automatically. Adding a *country* additionally means extending the `TrainCountry` union and currency handling in `format.ts`.

## Data honesty

Every fare and schedule is **indicative**, compiled from published operator timetables:

- The disclaimer (`TRAIN_DISCLAIMER`) renders on every corridor and train page and is injected into the AI system prompt.
- Fare chips are labelled "indicative"; the booking CTA opens a consultant enquiry rather than implying instant ticketing.
- The AI assistant is instructed to state that figures are indicative and that Indian Railways availability is quota-based.

## API contracts

### `GET /api/trains/search?from=new-york&to=washington-dc`
- `from` / `to`: station code (`NYP`, `NDLS`), station slug, city slug, or free text (city/station name).
- Rate limit 30/min/IP. Cached 1h at the edge (`s-maxage=3600`).
- Returns `CorridorResult`: resolved origin/destination stations, every matching journey (service, operator, segment timings, day offset, intermediate stops, scaled class fares, live status), plus `fastest`, `cheapest` and the disclaimer.
- Errors: `400` invalid input, `404` unknown station/city, `429` rate-limited.

### `POST /api/trains/assistant`
Body `{question, from?, to?, history?}`. Rate limit 8/min/IP.
The server grounds the model on up to three things it detects in the question — the corridor (city-pair), the named train (or train number), and the rail-pass catalog — by running the same engine the site uses and injecting results as `VERIFIED_DATA`. Hardening mirrors the visa assistant: schedules/fares come **only** from `VERIFIED_DATA`, user text is untrusted data, role-change and prompt-reveal instructions are refused, no tools, no DB writes beyond the analytics log, history capped (6 turns × 1.5k chars).

### `PUT/DELETE /api/admin/trains`
Admin-gated (middleware + in-handler `requireAdmin`), zod-validated, upserts/deletes one service-status notice, validates the slug against the bundled dataset, invalidates the engine cache, writes `AuditLog`.

## Pages

| Route | Purpose | Rendering |
|---|---|---|
| `/trains` | Hub: corridor search, featured US/India routes, AI assistant, iconic trains, operators, full station directory, FAQ (+JSON-LD) | static |
| `/trains/route/[from]/[to]` | Every train on a corridor: timings, day offsets, amenities, class fares, booking CTAs; FAQ + Breadcrumb + TrainTrip JSON-LD; reverse link; cross-sell | ISR 24h |
| `/trains/train/[slug]` | Named-train page: full stop-by-stop timetable, classes & perks, amenities, operator baggage/pet/bike/refund/accessibility policies, tips, status banner | ISR 1h |
| `/trains/station/[slug]` | Station guide: departure board, facilities, onward connections, calling trains, map link | ISR 24h |
| `/trains/passes` | Rail pass comparison (USA Rail Pass, California, Brightline, IRCTC circular, Eurail, JR Pass) + when point-to-point wins | static |
| `/admin/trains` | Service-status console + 30-day search analytics incl. zero-result coverage gaps | dynamic |

SEO: the sitemap enumerates station guides, named-train pages, `/trains/passes` and every city-pair corridor a bundled service actually covers (`allCorridorPairs()`), all discovered through internal links too. Titles/descriptions are corridor-aware (`seo.ts`), with FAQ, Breadcrumb, `TrainTrip` and `TrainStation` structured data.

## Commercial data providers (upgrade path)

The current bundled dataset is content, not live inventory. When revenue justifies live availability and ticketing, implement a second `RailContentProvider` (and a booking provider alongside it):

| Provider | Market | Capability | Notes |
|---|---|---|---|
| **IRCTC authorised B2B partners** (e.g. via an IRCTC-approved agent aggregator) | India | Live availability, fares, PNR status, ticketing | The only lawful route to Indian reserved-ticket issuance; requires an authorised-agent relationship and compliance with IRCTC agent rules. Highest priority for India revenue. |
| **RailYatri / ConfirmTkt / Ixigo-style content APIs** | India | Live running status, PNR prediction, seat availability | Content and prediction, not ticketing — good for enriching train pages with live status ahead of a booking integration. |
| **Amtrak agency channels / GDS rail content** (Sabre, Amadeus rail) | US | Availability, fares, ticketing | Amtrak has no public booking API; distribution runs through agency/GDS agreements. Enables true US ticketing. |
| **SilverRail / Trainline Partner Solutions** | Global | Multi-carrier search + booking via one integration | The fastest route to many operators at once (including the European expansion path); revenue share or per-booking fees. |
| **Brightline affiliate** | US (FL) | Referral | Lowest-effort monetisation for the Florida corridor today. |

Recommended sequence: keep bundled content (free, current setup) → add an India live-status content API to make train pages genuinely useful → pursue IRCTC-authorised ticketing for India (largest revenue pool) → SilverRail/GDS for US and European expansion.

## Operations

- **Add or correct a train/station**: edit `src/lib/trains/data/`, run `npm test` (dataset-integrity tests catch unknown station refs, non-monotonic stop times, duplicate slugs, orphan stations), PR. Live on next deploy.
- **Flag a disruption now**: `/admin/trains` → save a status notice → live on search within 60s; corridor/train pages pick it up at next ISR revalidation (≤24h / ≤1h) or immediately for API and assistant consumers.
- **Find coverage gaps**: `/admin/trains` lists the most-searched queries that returned **zero** results — the direct backlog for which service or station to add next.
- **Monitoring**: `TrainSearchLog` top corridors on `/admin/trains`; GA4 events `train_search`, `train_book_click` (Ads conversion), `train_assistant_ask`.
- **Tests**: `src/lib/trains/engine.test.ts` — dataset integrity, station resolution, corridor search (fastest/cheapest, reverse direction, segment pricing, overnight day offsets, intermediate stops), timetable/board generation, sitemap corridor enumeration, formatting. Run with `npm test`.

> Local `npm run build` needs `NODE_OPTIONS=--max-old-space-size=6144` (the `google-ads-api` type definitions OOM the default heap); CI sets this already.

## Launch checklist

- [x] Schema pushed (`npm run db:push`) — `TrainServiceOverride`, `TrainSearchLog`
- [x] Typecheck, lint, 89 unit tests green; production build passes
- [x] Rate limiting on both public endpoints; admin routes double-gated; zod on every input
- [x] JSON-LD (FAQ, breadcrumbs, TrainTrip, TrainStation), canonicals, sitemap entries
- [x] Indicative-fare labelling and disclaimer on every result, page and AI answer
- [x] Accessible combobox search, ARIA-labelled controls, keyboard navigation
- [ ] Post-deploy: request indexing for `/trains` + top corridors in Search Console
- [ ] Watch `/admin/trains` zero-result analytics for the first coverage gaps to fill
- [ ] Commercial: scope an IRCTC-authorised partner for live India ticketing
