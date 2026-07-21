# Travel Insurance Platform

The insurance marketplace layer of Ticketing-Info.org: plan comparison and indicative quoting across leading **US and Indian insurers**, programmatic SEO clusters (trip types, plans, providers, 199 destination guides, content hub), a grounded AI advisor, an admin console (plan overrides + policy/claim tracking), and lead capture into the existing CRM.

## Architecture

```
                    ┌──────────────────────────────────────────────┐
                    │  src/lib/insurance/ (bundled, curated)       │
                    │  providers.ts  13 insurer profiles           │
                    │  plans.ts      29 plan benefit tables+rates  │
                    │  regions.ts    rating regions, Schengen set, │
                    │                mandatory-insurance rules     │
                    │  categories/guides/coverage/seo/popular      │
                    └───────────────┬──────────────────────────────┘
                                    │ bundled at build time
┌──────────────┐  plans()   ┌───────▼────────────┐  overrides    ┌───────────────────────┐
│ Provider      │◄──────────│  Quote Engine      │◄──────────────│ Postgres (Neon)       │
│ abstraction   │           │  src/lib/insurance/│  60s cache    │ InsurancePlanOverride │
│ providers/    │           │  engine.ts         │               │ InsuranceQuoteLog     │
│ insurance.ts  │           │  (eligibility →    │               │ InsurancePolicy       │
└──────────────┘            │   premium → fit)   │               │ InsuranceClaim        │
                            └───────┬────────────┘               └───────────────────────┘
        ┌──────────────┬────────────┼──────────────────┬──────────────────┐
        ▼              ▼            ▼                  ▼                  ▼
 /api/insurance/  /insurance   /insurance/quotes  SEO clusters      /api/insurance/
 quote (JSON)     (hub UI)     (canonical results) plan/type/        assistant
                                                   provider/dest/    (grounded Gemini)
                                                   guides
```

**Design decisions**

- **Bundled curated catalog + DB overrides.** Benefit tables are compiled from insurers' public plan literature into typed modules, so quoting needs **zero external calls**, survives DB outages, and never blocks builds (CI has no `DATABASE_URL`). Only mutable state lives in Postgres: admin plan adjustments (`InsurancePlanOverride`, 60s in-memory cache), quote analytics (`InsuranceQuoteLog`, no PII), and the policy/claim records consultants manage.
- **Estimates, never bindable prices.** The engine's rating model (per-day age-banded rates × region multiplier with long-trip taper; % of trip cost for US comprehensive plans; flat premiums for annual plans) produces deterministic **indicative estimates**. Every quote carries `estimate: true` and the disclaimer; UI copy never presents an estimate as a price. This mirrors the visa platform's labelled-estimates philosophy and is the honest posture until live insurer feeds are contracted.
- **No fabricated social proof.** Plan cards carry benefits, claim processes and support contacts — never invented customer ratings or claim-settlement percentages.
- **Provider abstraction.** `src/lib/providers/insurance.ts` exposes `InsuranceCatalogProvider.plans()`. Swapping the bundled catalog for a live aggregator/insurer API touches one file — engine, pages, APIs and AI grounding are source-agnostic.
- **Canonical result URLs.** The quote form navigates to `/insurance/quotes?residence=…&destination=…` (server-rendered, shareable, `noindex`) instead of client-side results. Evergreen SEO surface = hub/type/plan/provider/destination/guide pages, all statically generated or on-demand ISR.
- **Lead-gen conversion, not checkout.** Purchases run through the existing consultant flow (BookingEnquiry → Lead → CRM): right for a business with no insurer API contracts or e-payment yet, and identical to how flights/cruises/visas convert on this site.

## Data model

| Layer | Source | Refresh |
|---|---|---|
| Provider profiles (13: Allianz, Travel Guard, Seven Corners, IMG, World Nomads, Travelex; Tata AIG, ICICI Lombard, HDFC ERGO, Bajaj Allianz, Reliance, Care, Digit) | `providers.ts`, public pages | code review / PR |
| Plan benefit tables + rating inputs (29 plans, 26 comparable benefit slots) | `plans.ts`, public brochures | code review / PR; per-plan runtime correction via `/admin/insurance` |
| Rating regions, Schengen set, mandatory-insurance rules (15+ destinations), medical-cost context | `regions.ts` | code review / PR |
| Trip-type landing content (17), guides (10), coverage glossary (26) | `categories.ts`, `guides.ts`, `coverage.ts` | code review / PR |
| Plan adjustments (hide plan, premium multiplier, public note) | `InsurancePlanOverride` via `/admin/insurance` | live (60s cache) |
| Quote analytics | `InsuranceQuoteLog` | live |
| Policies & claims tracked by the desk | `InsurancePolicy`, `InsuranceClaim` (PL-/CL- display IDs) | live |

## API contracts

### `GET /api/insurance/quote?residence=IN&destination=US&start=2026-09-01&end=2026-09-20&ages=34,62&tripCost=4000&categories=family&annual=false`
- Country params accept ISO2, slug, or full name. Rate limit 30/min/IP; cached 1h at the edge.
- Returns `QuoteResultSet`: ranked quotes (fit score + transparent reasons, premium label per plan currency, per-traveller split), excluded plans **with reasons**, and the disclaimer.
- Errors: `400` invalid input, `404` unknown country, `429` rate-limited.

### `POST /api/insurance/assistant`
Body `{question, residence?, destination?, history?}`. Rate limit 8/min/IP.
The server detects the destination/residence (longest-country-name matching) and audience keywords (student/senior/cruise/…), runs the quote engine for a representative trip, and injects ranked plans + mandatory-insurance rules + medical-cost context as `VERIFIED_DATA`. Hardening: plan facts come **only** from `VERIFIED_DATA`; estimates always labelled; user text treated as untrusted; role-change/prompt-reveal refused; fraud assistance refused; no tools; history capped (6 × 1.5k chars).

### Admin (all: middleware + `requireAdmin`, zod, `AuditLog`)
- `PUT/DELETE /api/admin/insurance` — plan overrides; invalidates engine cache.
- `POST/PATCH /api/admin/insurance/policies` — record/update policies our desk arranged.
- `POST/PATCH /api/admin/insurance/claims` — open claim files, move statuses (timeline auto-appended).

## Pages

| Route | Purpose | Rendering |
|---|---|---|
| `/insurance` | Hub: quote form, corridors, trip types, AI advisor, provider strip, destination chips, guides, FAQ (+JSON-LD) | static |
| `/insurance/quotes` | Canonical comparison results: sort, 3-way compare table, per-plan lead capture, exclusions explained | dynamic, `noindex` |
| `/insurance/plan/[slug]` | 29 plan pages: full benefit schedule, exclusions, claim process, FAQs (+JSON-LD) | SSG, ISR 24h |
| `/insurance/type/[slug]` | 17 trip-type landers (Schengen, student, seniors, visitors-USA/India, cruise, adventure…) | SSG, ISR 24h |
| `/insurance/provider/[slug]` | 13 insurer profiles: plans, product families, claims contacts | SSG, ISR 24h |
| `/insurance/destination/[slug]` | 199 destination guides: mandatory rules, cost context, plans by market, visa cross-link | on-demand ISR 24h |
| `/insurance/guides`, `/insurance/guides/[slug]` | Content hub: 10 long-form guides (+Article & FAQ JSON-LD) | SSG, ISR 24h |
| `/admin/insurance` | Quote analytics, plan overrides, policy & claim tracker | dynamic |

Cross-sell: destination-aware insurance card on visa pair pages; cruise-specific card on `/cruises`; cards on `/packages` and the post-enquiry thank-you page. Always optional, never pre-checked.

SEO: sitemap adds ~270 insurance URLs (types, plans, providers, guides, all destination guides). Breadcrumb + FAQ JSON-LD sitewide; year-stamped, category-aware titles (`seo.ts`).

## Commercial provider integrations (upgrade path)

When purchase volume justifies real-time bindable quotes, implement a second `InsuranceCatalogProvider` (and an issuance flow) against one of these. Comparison as of mid-2026:

| Provider / route | Coverage | Model | Notes |
|---|---|---|---|
| **battleface / Robin Assist** | US + global, embedded travel insurance APIs | White-label / rev-share | Modern REST, quote→bind→claim endpoints; built for OTAs; fastest US route to bindable quotes |
| **Ancileo** | APAC/global white-label for Allianz-partnered programs | SaaS + rev-share | Powers airline/OTA embedded insurance; good multi-market fit (US+IN ambition) |
| **Seven Corners / IMG / Travelex affiliate & API programs** | Their own catalogs | Commission per policy | Lowest-effort start: deep links / co-brand portals today, quote APIs on partnership; matches plans already profiled |
| **VisitorsCoverage / Insubuy partner programs** | US visitor-medical aggregation | Commission | Strong for the NRI/visitors-USA corridor we already rank content for |
| **India: insurer partner APIs (Tata AIG, ICICI Lombard, HDFC ERGO, Care, Digit)** | Each insurer's travel line | Commission via corporate-agent/POSP arrangement | Digit and Care are the most API-forward; **requires IRDAI registration** (see compliance) |
| **India: broker aggregation (e.g. Zopper, Ensuredit, Riskcovry)** | Multi-insurer quote+issue APIs | SaaS + commission share | One integration → many Indian insurers; they hold the regulated licence |

Recommended sequence: keep bundled+curated (free, current setup) → add **affiliate deep links** on plan cards (immediate revenue, zero licensing) → US: battleface/Ancileo embedded API; India: one broker-aggregation API under their licence → direct insurer APIs only at serious volume.

**Compliance notes (blockers for real selling, not for the current lead-gen model):**
- **India:** soliciting/selling insurance requires IRDAI registration (corporate agent — capped insurer partners — or broker) or operating as a referral partner of a licensed entity. The current model (comparison + estimates + human consultants + insurer-issued policies) must route actual sales through a licensed partner; formalise before charging premiums online.
- **US:** producer licensing is state-by-state; travel insurance is typically sold under a **limited-lines travel producer** licence with the insurer as supervising entity. Affiliate/referral links avoid this entirely; embedded API partners (battleface etc.) sponsor the licensing.
- Premiums collected online would also trigger PCI-DSS scope — use the insurer's/partner's hosted checkout, never card collection in this app (consistent with the existing CardAuthorization posture).

## Operations

- **Correct a plan now**: `/admin/insurance` → override (hide / multiplier / note) → live on quotes within 60s. Catalog fixes (benefit figures, new plans) go through PR review of `plans.ts`.
- **Record a sale**: `/admin/insurance` → Record policy (links to Customer/Lead) → status through `awaiting_payment → active`; renewal candidates = policies with near `endDate`.
- **Claims help**: open claim on the policy row; statuses append to the timeline; insurer ref + amounts tracked.
- **Monitoring**: quote analytics on `/admin/insurance` (top corridors, most-recommended plans); GA4 events `insurance_quote_search`, `insurance_plan_enquire` (Ads conversion), `insurance_assistant_ask`, `insurance_help_click`.
- **Catalog refresh** (quarterly): re-verify benefit tables against insurer brochures, adjust `plans.ts`, PR. Overrides survive refreshes (keyed by stable plan id).
- **Tests**: `src/lib/insurance/engine.test.ts` — catalog integrity (unique ids, valid refs, rated bands, category coverage), region mapping + mandatory rules, premium determinism/scaling, market/region/age eligibility filtering, annual/domestic/senior scenarios. `npm test`.

## Launch checklist

- [x] Schema pushed (`npm run db:push`) — `InsurancePlanOverride`, `InsuranceQuoteLog`, `InsurancePolicy`, `InsuranceClaim`
- [x] Typecheck, lint, unit tests green; production build passes
- [x] Rate limiting on both public endpoints; admin routes double-gated; zod on every input
- [x] JSON-LD (FAQ + breadcrumbs + Article), canonicals, sitemap entries; quotes pages `noindex`
- [x] Disclaimer on every quote/plan surface; estimates labelled; no fabricated ratings; insurer claim portals linked
- [ ] Post-deploy: request indexing for `/insurance`, top type pages and top destination guides in Search Console
- [ ] Wire affiliate/partner links per provider as agreements land (`providers.ts` website links are plain links today)
- [ ] Watch `/admin/insurance` corridor analytics to prioritise the first commercial integrations
