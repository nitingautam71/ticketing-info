# Visa Checker Platform

The visa intelligence layer of Ticketing-Info.org: instant entry requirements for **every passport → every destination** (199 × 199), programmatic SEO pages, a grounded AI assistant, an admin rule-correction console, and lead capture into the existing CRM.

## Architecture

```
                       ┌────────────────────────────────────────┐
                       │  src/data/visas/                       │
                       │  passport-index-matrix-iso2.csv (MIT)  │
                       │   └─ scripts/visas/build-matrix.mjs    │
                       │  matrix.json (~217KB) countries.json   │
                       └───────────────┬────────────────────────┘
                                       │ bundled at build time
┌─────────────┐   baseRule()   ┌───────▼────────────┐  overrides   ┌──────────────────┐
│ Provider     │◄──────────────│  Rules Engine      │◄─────────────│ Postgres (Neon)  │
│ abstraction  │               │  src/lib/visas/    │  60s cache   │ VisaRuleOverride │
│ providers/   │               │  engine.ts         │              │ VisaCheckLog     │
│ visas.ts     │               └───────┬────────────┘              └──────────────────┘
└─────────────┘                        │
        ┌──────────────┬───────────────┼───────────────────┬─────────────────┐
        ▼              ▼               ▼                   ▼                 ▼
  /api/visa/check  /visas hub   /visas/[from]/[to]  /visas/passport/[s]  /api/visa/assistant
  (JSON contract)  (search UI)  (ISR pair pages)    /visas/destination/[s]  (grounded Gemini)
```

**Design decisions**

- **Bundled base rules + DB overrides.** The 199×199 matrix ships inside the serverless bundle (compiled to compact tokens), so a check needs **zero external calls** in the common case, survives DB outages, and never blocks builds (this repo's CI has no `DATABASE_URL`). Only *mutable* state lives in Postgres: admin corrections (`VisaRuleOverride`, always wins, 60s in-memory cache) and analytics (`VisaCheckLog`).
- **Provider abstraction.** `src/lib/providers/visas.ts` exposes `VisaRulesProvider.baseRule(passport, dest)`. Swapping the bundled dataset for a commercial feed (see below) touches one file — the engine, pages, API, and AI grounding are source-agnostic.
- **Canonical result URLs.** The search form navigates to `/visas/{passport-slug}/{destination-slug}` instead of rendering results client-side: every result is shareable, cacheable (ISR, 24h), and indexable. Purpose-specific extras (`?purpose=student` etc.) are layered client-side from the same pure checklist module so the page stays statically cacheable.
- **On-demand ISR, never build-time generation.** ~39k possible pair pages materialise only when visited (no `generateStaticParams`), per this repo's no-DB-at-build rule.

## Data

| Layer | Source | Refresh |
|---|---|---|
| Base matrix (category + stay days) | [Passport Index dataset](https://github.com/ilyankou/passport-index-dataset) (MIT), vendored CSV | `curl` new CSV → `node scripts/visas/build-matrix.mjs` → commit |
| Corrections | `VisaRuleOverride` via `/admin/visas` | live (60s cache) |
| Fees, processing, portals, validity, health, transit | Curated modules in `src/lib/visas/` (`enrichment.ts`, `transit.ts`, `checklist.ts`) | code review / PR |
| Check analytics | `VisaCheckLog` | live |

Unknown fees fall back to category-typical numbers and are **labelled as estimates** (`fee.official: false`) — the UI copy never presents an estimate as an official figure.

## API contracts

### `GET /api/visa/check?passport=IN&destination=JP&purpose=tourism`
- `passport` / `destination`: ISO2, slug, or full name. `purpose`: `tourism | business | transit | student | work | medical | family_visit | digital_nomad`.
- Rate limit 30/min/IP. Cached 1h at the edge (`s-maxage=3600`).
- Returns `VisaCheckResult` (src/lib/visas/types.ts): category, headline, stay days, fee (`{amountUsd, official, label}`), processing, passport validity, blank pages, document checklist, purpose note, transit note, health block, official portal link, source (`passport-index` | `admin-override`), disclaimer.
- Errors: `400` invalid input, `404` unknown country, `429` rate-limited.

### `POST /api/visa/assistant`
Body `{question, passport?, destination?, history?}`. Rate limit 8/min/IP.
The server resolves the country pair (explicit fields win; otherwise longest-name matching on the question), runs the engine, and injects the result as `VERIFIED_DATA` into the system prompt. Hardening: the model is instructed that rules come **only** from `VERIFIED_DATA`, user text is untrusted data, and role-change/prompt-reveal instructions are refused; the endpoint has no tools, no DB write access beyond the analytics log, and history is capped (6 turns × 1.5k chars).

### `PUT/DELETE /api/admin/visas`
Admin-gated (middleware + in-handler `requireAdmin`), zod-validated, upserts/deletes one override, invalidates the engine cache, writes `AuditLog`.

## Pages

| Route | Purpose | Rendering |
|---|---|---|
| `/visas` | Hub: smart search, featured corridors, AI assistant, passport/destination indexes, FAQ (+JSON-LD) | static |
| `/visas/[from]/[to]` | Full requirement breakdown per pair; FAQ + Breadcrumb JSON-LD; reverse link; cross-sell; lead CTA | ISR 24h |
| `/visas/passport/[slug]` | Passport power report — every destination grouped by category with stay days | ISR 24h |
| `/visas/destination/[slug]` | Destination visa policy — every passport grouped by category + validity/health facts | ISR 24h |
| `/admin/visas` | Overrides console + 30-day corridor analytics | dynamic |

SEO: sitemap includes all 398 hub pages + the full pair matrix for the top 40 traffic passports (~8.3k URLs, well under the 50k sitemap cap); remaining pairs are discovered via internal links (related-destination chips, reverse links, hub groupings). Titles/descriptions are category-aware (`seo.ts`).

## Commercial data providers (upgrade path)

When revenue justifies a licensed feed, implement a second `VisaRulesProvider`:

| Provider | Coverage | Notes |
|---|---|---|
| **IATA Timatic / AutoCheck** | The airline-industry source of truth; all carriers use it at check-in | Highest accuracy + update SLA; enterprise pricing, contract via IATA; REST integration (Timatic Web Services) |
| **Sherpa (joinsherpa.com)** | Visa + eTA + health rules, application APIs | Strong developer experience, per-request pricing, powers many OTAs; can also *sell* eVisas (rev-share) |
| **VisaHQ / iVisa affiliate APIs** | Requirements + application funnels | Easiest commercial start; earn commission on applications instead of paying for data |
| **Official portals** (linked per destination) | Authoritative per-country | Free but unstructured; what our curated `OFFICIAL_LINKS` already points users to |

Recommended sequence: keep bundled+curated (free, current setup) → add Sherpa for the top 20 destination corridors and diff against bundled data to auto-flag stale rows → Timatic if/when airline-grade accuracy becomes a selling point.

## Operations

- **Refresh dataset** (quarterly or on major policy news): re-download CSV, run `node scripts/visas/build-matrix.mjs`, review the diff, PR. Overrides survive refreshes.
- **Correct a rule now**: `/admin/visas` → save override → live within 60s on API; pair pages pick it up on next ISR revalidation (≤24h) — or immediately for API/assistant consumers.
- **Monitoring**: `VisaCheckLog` top-corridors on `/admin/visas`; GA4 events `visa_check_search`, `visa_apply_click` (Ads conversion), `visa_assistant_ask`, `visa_checklist_print/share`.
- **Tests**: `src/lib/visas/engine.test.ts` — registry integrity (199 unique slugs), full-matrix coverage (0 missing pairs), known-corridor truths, fee/validity/transit/checklist behaviour. Run with `npm test`.

## Launch checklist

- [x] Schema pushed (`npm run db:push`) — `VisaRuleOverride`, `VisaCheckLog`
- [x] Typecheck, lint, unit tests green; production build passes
- [x] Rate limiting on both public endpoints; admin routes double-gated; zod on every input
- [x] JSON-LD (FAQ + breadcrumbs), canonicals, sitemap entries
- [x] Disclaimer on every result; estimates labelled; official portals linked
- [ ] Post-deploy: request indexing for `/visas` + top corridors in Search Console
- [ ] Watch `/admin/visas` corridor analytics for the first override candidates
