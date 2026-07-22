# Flights — Production Readiness & Revenue Audit

**Scope:** The `/flights` section of ticketing-info.org.
**Method:** Source-code audit of the deployed implementation (git `main`, clean tree). This is grounded in the actual code, not a black-box crawl — where a claim needs a live measurement (Lighthouse, field CWV, real RapidAPI latency) that is called out explicitly rather than fabricated.
**Date:** 2026-07-22

---

## 0. The single most important framing

The prompt asks us to benchmark this page against Google Flights, Skyscanner, Kayak, Expedia, etc. **That is the wrong yardstick, and using it would produce a misleading report.**

What the code actually is:

- A **lead-generation funnel**, not a transactional OTA. There is no cart, no PNR, no payment, no affiliate redirect. Every "book" path ends at `BookingEnquiryModal` → `POST /api/leads` → a human travel consultant follows up by call/WhatsApp. This is stated in the code itself (`src/lib/providers/flights.ts:155`, `BookingEnquiryModal.tsx:189`: *"No payment is taken online. A travel consultant will contact you."*).
- Flight results come from **RapidAPI "Sky Scrapper" (an unofficial Skyscanner scraper)** when `RAPIDAPI_KEY` is set, otherwise a **random mock generator** (`MockFlightProvider`). Neither can transact.

So the correct competitive frame is **"consultant-assisted / lead-gen travel agencies"** (e.g. the enquiry-first model of a Flighthub/CheapOair-style call-center, or a premium concierge), **not** self-serve OTAs. Judged as a Google Flights clone this scores ~25/100 and always will, because it structurally isn't one. Judged as a **lead-gen flight funnel**, it's a polished, near-launchable MVP with specific, fixable gaps. **This report scores it as the latter.**

Every recommendation below is filtered through one question: *does it generate more qualified consultant leads (or reduce cost/risk), given this model?* Features that only make sense for a transactional OTA (seat maps, real fare rules, PCI checkout) are explicitly de-prioritized.

---

## 1. Executive Summary

Ticketing-Info's flights section is a **well-built front end on top of a lead-gen model**. The search widget is genuinely good — trip-type tabs, airport typeahead with debounce + keyboard nav + recents, a real custom calendar, sort/filter, self-transfer & "separate ticket" warnings, eco-delta badges, multi-city leg-by-leg selection. The engineering quality is high and security-conscious (strict CSP, Consent Mode v2, SSRF-guarded image allowlist).

But three things hold it back from being a revenue engine:

1. **The flagship vertical is the least-developed for SEO.** Every *other* vertical (visas ~8k URLs, trains, insurance, cruises) has programmatic `[slug]` pages in the sitemap. **Flights has exactly two URLs** (`/flights` and one hand-written `usa-to-india-flight-tickets` page). For an organic-traffic business, this is the biggest missed opportunity in the codebase.
2. **The flight funnel is invisible to analytics and to Google Ads.** Flight *search* fires no event, and flight *leads* never call `trackConversion()` — so Google Ads cannot optimize toward flight leads and you are almost certainly wasting ad budget. Visas/trains/insurance/cruises all do this correctly; flights (via the shared modal) does not.
3. **A compliance-grade trust problem:** the "50% OFF launch fares" cards apply a fabricated discount to *estimated* prices (`FeaturedFlightDeals.tsx`). A struck-through "was ~$980 est." next to "50% OFF" that was never a real offered price is squarely the kind of deceptive-pricing pattern the FTC polices (16 CFR §233). For a US-targeted company this is a launch blocker, not a nice-to-have.

Plus one cost/abuse hole: `/api/flights` and `/api/airports` proxy a **paid, quota-limited** RapidAPI with **no rate limiting** (only `/api/leads` is throttled). One script can drain your RapidAPI quota / rack up cost.

### Scorecard (as a lead-gen flight funnel)

| Dimension | Score | One-line rationale |
|---|---:|---|
| **Overall Production Readiness** | **62 / 100** | Launchable soon; blocked by compliance (deceptive pricing) + measurement gaps |
| UI / UX | 78 / 100 | Polished, responsive, dark-mode-native; a11y + trust-signal gaps |
| Technical | 70 / 100 | Clean Next 16 / RSC architecture; fragile scraper dependency; in-memory state on serverless |
| SEO | 45 / 100 | Excellent foundation, but flights is under-built vs every sibling vertical |
| Security | 74 / 100 | Strong headers/CSP/consent; unthrottled paid-API proxy is the hole |
| Performance | 68 / 100 | Architecture is sound; **needs real Lighthouse/CWV — not measured here** |
| Revenue Optimization | 40 / 100 | Single lead path; no Ads conversion signal; huge un-tapped cross-sell |
| Trust & Compliance | 55 / 100 | Consent Mode v2 is great; fabricated discounts + "estimate everywhere" undercut it |

---

## 2. Competitive Benchmark (Phase 2)

Rated 0–10. "Industry avg" = typical self-serve OTA/metasearch. "Best" = strongest competitor for that feature. Remember §0: many gaps are *intentional* given the lead-gen model.

| Feature | Current | Ind. avg | Best competitor | Gap | Difficulty | Business impact |
|---|---:|---:|---|---:|---|---|
| Search widget (trip types, pax, cabin) | 7 | 8 | Google Flights (9) | 1 | — | Already strong |
| Airport autocomplete | 7 | 8 | Kayak (9) | 1 | Low | Good; a11y + IATA-resolve gaps |
| Date picker / calendar | 6 | 8 | Google (9) | 2 | Med | No price-in-calendar, no flexible-dates |
| Passenger logic (adult/child/infant) | 2 | 8 | Expedia (9) | 6 | Med | **Only "travelers" int; no child/infant** |
| Round-trip pricing correctness | 3 | 8 | Google (9) | 5 | Med | Sums 2 one-ways; not true RT fare |
| Results cards & sort | 7 | 8 | Skyscanner (9) | 1 | — | Clean; good badges |
| Filters | 7 | 8 | Kayak (9) | 1 | Low | Solid; missing airport/alliance/arrival-time |
| Fare transparency (baggage/rules) | 5 | 7 | Google (8) | 2 | Med | Scraper returns "confirm at checkout" |
| Self-transfer / separate-ticket warnings | 8 | 5 | Kiwi (9) | -3 | — | **Ahead of average** |
| Carbon emissions | 6 | 6 | Google (9) | 0 | Low | Eco-delta present; not absolute kg |
| Price history / prediction | 0 | 6 | Hopper (10) | 6 | High | Absent |
| Price alerts | 0 | 7 | Google/Hopper (9) | 7 | Med | Absent — high lead-capture value |
| Nearby / flexible airports | 1 | 7 | Skyscanner (9) | 6 | Med | Static list only |
| SEO route/airport/airline pages | 2 | 8 | Kayak/Skyscanner (10) | 6 | Med | **Biggest gap** |
| Conversion/analytics instrumentation | 3 | 8 | all (9) | 5 | Low | **Flight funnel untracked** |
| Trust signals (reviews, ATOL/IATA, secure) | 4 | 8 | Expedia (9) | 4 | Low | Thin on the flow itself |

**Where you already beat the average:** self-transfer/protected-transfer/mash-up warnings (`FlightResultCard.tsx:128-137`) and eco-delta badges are things even big OTAs handle poorly. Keep and market these.

---

## 3. UX Audit (Phase 3)

Reviewed every component: `FlightSearch`, `AirportAutocomplete`, `DatePicker`, `TravelerClassPicker`, `FlightFilters`, `FlightResultCard`, `FeaturedFlightDeals`, `BookingEnquiryModal`.

**Strengths (keep):**
- Coherent dark visual system, consistent emerald accent, good spacing/typography (Inter + Fraunces).
- Real interaction quality: 300 ms debounced typeahead, arrow-key navigation, `localStorage` recents (`AirportAutocomplete.tsx:90,104-112`), click-outside close on every popover, sticky booking summary, multi-city step progress bar.
- Responsive grid (`md:grid-cols-12`) collapses sensibly to mobile; result card reflows to stacked on `<sm`.

**Issues, in priority order:**

1. **Accessibility — the typeahead is invisible to screen readers.** `AirportAutocomplete` uses a plain `<input>` + `<div>` list with no `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`, or `role="listbox"/"option"`. Keyboard *arrow* nav works, but AT users get nothing announced. Same pattern in `TravelerClassPicker`/`DatePicker` (custom dropdowns, no ARIA, calendar days are unlabeled `<button>{d.getDate()}</button>` with no `aria-label="July 24, 2026"`). **This is both an inclusion issue and an ADA/Section 508 litigation risk for a US business.**
2. **Forced-uppercase input is confusing.** Typing "london" renders "LONDON" and pushes `from="LONDON"` immediately (`handleInput` → `onChange(upper)`), even before a suggestion is picked. If the user hits Search without selecting, the API receives `LONDON`, not `LHR`. The mock can't resolve it; the scraper *might*. Resolve to an IATA on blur, or block search until a valid selection exists.
3. **No empty/duplicate-airport guardrails.** `from` and `to` can be equal, or blank, and Search still fires. Add inline validation.
4. **Loading state is a single spinner** ("Querying active flight paths…"). Competitors use skeleton cards (you already have `HotelSkeleton.tsx` — mirror it for flights) to improve perceived speed.
5. **Trust signals are absent from the flow.** No "prices are estimates" microcopy on result cards, no IATA/ATOL/secured badges, no consultant photo/response-time near the CTA. The modal says the right things but only *after* the user commits.
6. **Contrast:** lots of `text-neutral-500`/`text-[10px]` on `neutral-900/950`. Several combinations fall below WCAG AA 4.5:1 — verify the fine print (baggage line, "was ~$X est.", segment details) with a contrast checker.

*(Mockups: see §14 "Result card v2" and "search-bar validation" wireframes.)*

---

## 4. Flight Search Engine Audit (Phase 4)

Source: `src/lib/providers/flights.ts`, `src/app/api/flights/route.ts`, `FlightSearch.tsx`.

**Correctness findings:**

- **CRITICAL — round-trip and multi-city are modeled as independent one-ways.** `buildLegs()` (`FlightSearch.tsx:131`) issues a *separate* `/api/flights` call per leg, and the provider only ever reads `it.legs[0]` (`flights.ts:481`). The displayed "Total" is `sum(legs)`. Real airline round-trip fares are usually a single bundled fare **cheaper** than 2×one-way. So the quoted total is systematically **too high and structurally different from how Google/Skyscanner price RT** — it hurts both accuracy and competitiveness. For a lead-gen model the fix can be pragmatic: label it "estimated, per-direction" and let the consultant quote the true RT fare — but the current UI presents it as a firm total.
- **CRITICAL — no child/infant/senior passenger support.** UI exposes a single `travelers` integer (`TravelerClassPicker.tsx`), API only reads `adults` (`api/flights/route.ts:10`). Family/diaspora travel (your stated USA↔India core) *always* involves kids/infant-in-lap. This suppresses exactly your highest-value leads.
- **Mock vs prod divergence:** `MockFlightProvider` ignores `adults` in pricing, so without `RAPIDAPI_KEY` the "Total" doesn't change with traveler count — a visible inconsistency in any environment lacking the key.
- **IATA resolution is best-effort.** `resolveAirport` falls back to "first AIRPORT match" then "first entry" (`flights.ts:417-420`) — a wrong-airport risk for ambiguous queries.
- **Good:** one-way works cleanly; self-transfer / protected-transfer / mash-up flags, eco delta, fare-policy (change/cancel/refund), operating-vs-marketing carrier, and next-day-arrival `+1` are all handled well (`flights.ts:504-547`).

**Absent vs the checklist (given lead-gen, only the starred ones matter near-term):**
- ★ Nearby/multi-airport cities, ★ flexible dates, ★ child/infant fares, ★ visa/passport reminders (you *have* a visa engine — cross-link it!), layover-time quality warnings.
- Not worth building for lead-gen: real seat class inventory, booking classes, aircraft type, live delay stats, terminal maps — a consultant handles these.

---

## 5. Search Results Audit (Phase 5)

Source: `FlightResultCard.tsx`, `flightDisplay.ts`, `FlightFilters.tsx`.

**Present & good:** price, duration, stop dots, layover expander, baggage, refundable/changeable pills, self-transfer/separate-ticket/eco badges, airline logo with graceful letter-code fallback (`AirlineLogo` `onError`), Cheapest/Fastest/Recommended tags from the provider.

**Missing that would move leads:**
- **Badges that build confidence:** "Best value", "Cheapest", "Fastest" exist as provider tags but there's no *computed* "Best value" when tags are absent (mock path shows none). Compute client-side.
- **Layover quality / long-layover & short-connection risk** — you have the segment times to compute this; surface "1h 5m connection — tight" or "9h overnight layover".
- **Price context** — even without Hopper-grade prediction, "typical fare for this route" (from your own historical leads) is a cheap trust boost.
- **No "message a consultant about this exact flight"** micro-CTA on the card — currently selection is required first. A per-card "Ask about this fare" is a lower-friction lead.

**Sorting/filters (`flightDisplay.ts`):** clean and correct (client-side, no extra API cost). Missing filters vs Kayak: by connecting airport, by alliance, by arrival-time window, "nonstop only" quick toggle (stops filter exists but isn't a prominent 1-tap).

---

## 6. Revenue Optimization (Phase 6)

**Current revenue surface = one thing:** a flight enquiry lead. That's it. No cross-sell wired into the flight flow, despite the site *already owning* hotels, cars, transfers, packages, insurance, visas, trains, cruises, and eSIM-adjacent verticals.

### Highest-ROI revenue moves (all leverage assets you already have)

| Stream | Mechanism | Effort | Why it's near-free |
|---|---|---|---|
| **Attach insurance to every flight lead** | After enquiry, "Add trip protection?" → `InsuranceQuoteForm` | Low | Insurance vertical fully built (`/insurance`, 29-plan catalog) |
| **Attach airport transfer** | "Need a ride from {arrivalAirport}?" post-enquiry | Low | `TransferSearch` exists |
| **Attach visa check** | On international routes, "Do you need a visa?" → visa engine | Low | Visa engine + `/visas/[from]/[to]` exist |
| **Bundle → package upsell** | Multi-pax/long-stay leads routed to packages desk | Low | Packages vertical exists |
| **Hotel attach** | "Where are you staying in {destCity}?" | Low | Hotels vertical exists |
| **Price-drop alerts (email/SMS capture)** | "Watch this route" captures email even when not ready to book | Med | New, but pure lead-list growth |
| **Newsletter / route deals** | Capture on the featured-deals cards | Low | — |
| **Sponsored airline/route placements** | Later, once traffic exists | Med | Ad inventory |

**Illustrative annual model** — *these are scenario models with explicit assumptions, not forecasts.* Lead-gen agency economics: revenue ≈ sessions × lead-rate × booking-rate × margin/booking. Assume blended margin/booking ≈ $45 (mix of domestic ~$25 and intl ~$60–80; higher if premium cabins), booking-rate ≈ 15% of leads.

| Scenario | Monthly flight sessions | Lead rate | Leads/mo | Bookings/mo | Attach uplift | **Annual** |
|---|---:|---:|---:|---:|---:|---:|
| Conservative | 8,000 | 2.0% | 160 | 24 | +15% | **~$15k** |
| Base | 40,000 | 3.0% | 1,200 | 180 | +25% | **~$120k** |
| Aggressive (post-SEO) | 200,000 | 3.5% | 7,000 | 1,050 | +40% | **~$790k** |

The swing between rows is dominated by **traffic (SEO, §7)** and **attach revenue (the table above)** — which is exactly why those two are the top of the roadmap. The "compete with Google Flights" framing, by contrast, adds ~$0 to this model.

---

## 7. SEO Audit (Phase 7) — the biggest growth lever

**The finding in one sentence:** Flights is your top nav item and flagship product, yet it is the **only** major vertical without a programmatic page cluster.

Evidence from `src/app/sitemap.ts`:
- Visas: passport + destination hubs + ~8k pair pages (`/visas/[from]/[to]`).
- Trains: stations + named trains + every corridor (`/trains/route/[from]/[to]`).
- Insurance: type + plan + provider + guide + per-country destination pages.
- Cruises: destination + line + port hubs.
- **Flights: `/flights` and `/flights/usa-to-india-flight-tickets`. Two URLs.**

The `usa-to-india-flight-tickets` page (`src/app/flights/usa-to-india-flight-tickets/page.tsx`) is a **template you can clone**: strong H1/H2s, genuinely useful copy, FAQ + breadcrumb JSON-LD, internal links to visas/trains/packages. It proves the pattern works — it just hasn't been scaled.

**Roadmap to programmatic scale (mirror the trains/visa architecture):**

1. **Route pages `/flights/[from]/[to]`** — on-demand ISR (per your "No DB at build" rule: no `generateStaticParams` with a live provider). Seed the sitemap with the top ~300–500 US-origin city pairs (US↔India diaspora routes first: JFK/EWR/SFO/ORD/IAD/ATL/DFW/LAX → DEL/BOM/BLR/MAA/HYD/AMD). Each page: "Cheapest month / weekday", direct-vs-onestop, airlines on the route, FAQ schema, the live search widget pre-filled, and cross-links to visa/insurance/transfer.
2. **Airport hub pages `/flights/airport/[iata]`** — terminals, airlines, "flights from {city}", nearby airports. ~50–100 US airports + top intl.
3. **Airline pages `/flights/airline/[code]`** — baggage policy, hubs, routes. Evergreen, high-intent.
4. **"Best time to fly / cheapest month" cluster** — programmatic per route; strong long-tail.
5. **Add all of the above to `sitemap.ts`** (they cost nothing until crawled — same note the file already makes for visa pairs).

**On-page fixes now (cheap):**
- `/flights` (`page.tsx`) has **no JSON-LD** — add `TravelAgency`/`WebSite`+`SearchAction` and an FAQ block. It's the highest-authority page in the section and currently schema-less.
- No `FlightReservation`/`Offer` schema anywhere (fine — you're not selling inventory; don't fake `Offer` prices, that compounds the §8 compliance risk).

**Traffic realism:** "millions of organic visitors" is achievable *at the section level over 12–24 months* only via the route/airport/airline clusters above — not from the current 2 URLs. The visa cluster proves you can execute programmatic SEO; flights just needs the same treatment.

---

## 8. Trust & Compliance (Phase 9 subset — surfaced early because it's a launch blocker)

**Deceptive pricing risk — `FeaturedFlightDeals.tsx`.** The cards show `was ~$980 est.` struck through, a red "50% OFF" badge, and `$490 round-trip est.`, where the "50% off" is applied to an *estimated* retail fare that was never actually offered at $980. US FTC guidance on former-price comparisons (16 CFR §233) requires a "was" price to be a *bona fide* price at which the item was recently offered in good faith. A blanket "50% off launch fare" on estimates — even with the fine-print disclaimer at the bottom — is the pattern the FTC and state AGs (and class-action plaintiffs) target. **Recommendation:** drop the struck-through "was" price and the "50% OFF" framing entirely, or replace with non-comparative language ("Popular route — from ~$490 est., confirmed by a consultant"). This is a **do-before-launch** item for a US-market company.

**Other trust items:**
- Fares are labeled "estimate" *everywhere*, which is honest but reads as "we don't actually know prices." Pair each estimate with a confidence/《typical range》and the consultant guarantee to convert honesty into trust.
- No visible business identity / IATA-or-equivalent accreditation / physical address on the flow (the `TravelAgency` JSON-LD address is env-driven and may be empty). US travellers expect a seller of travel disclosure (some states, e.g. California SOT, require registration).

---

## 9. Security Audit (Phase 9)

Cross-referenced with the existing `SECURITY-AUDIT.md`. The platform-level posture is genuinely strong.

**Strong (keep):**
- Strict CSP with `object-src 'none'`, `frame-ancestors 'none'`, `base-uri 'self'`, `form-action 'self'` (`next.config.ts:11`). HSTS preload, `nosniff`, `X-Frame-Options: DENY`, COOP/CORP, tight `Permissions-Policy`.
- Image optimizer host allowlist instead of `**` — explicitly to avoid `/_next/image` becoming an SSRF/open-proxy (`next.config.ts:35`). Good.
- Consent Mode v2, deny-by-default (`GoogleAnalytics.tsx`).
- `/api/leads` is rate-limited (8/60s) and Zod-validated; `clientIp` correctly prefers non-spoofable Vercel headers over raw XFF (`rateLimit.ts:42`).

**Findings:**
1. **HIGH — unthrottled paid-API proxy.** `/api/flights` (`route.ts`) and `/api/airports` (`route.ts`) call the **paid, quota-metered** RapidAPI Sky Scrapper with **no `rateLimit()`**. A trivial loop against `/api/flights?from=..&to=..` (or `/api/airports?query=a`, which the typeahead hammers) drains quota and/or runs up cost, and can get your RapidAPI key throttled/banned. **Fix:** wrap both with `rateLimit(\`flights:${clientIp(req)}\`, …)` and `rateLimit(\`airports:${clientIp(req)}\`, …)`, and cache more aggressively.
2. **MEDIUM — in-memory state on serverless.** `rateLimit` buckets, `airportCache`, and `searchCache` are process-local `Map`s (`rateLimit.ts:14`, `flights.ts:335-337`). On Vercel's multi-instance runtime the effective rate limit is *per instance* (attacker gets N× the limit) and cache hit-rate is poor (more paid API calls). The code comments already acknowledge this. **Fix:** move to Upstash Redis / Vercel KV for shared rate-limit + cache. (Compounds finding #1.)
3. **LOW — error handling masks failures as empty.** `/api/flights` returns `[]` on any error (`route.ts:17`), which the UI renders as "No flights found." Real API outages look identical to no-results. Add an error state distinct from empty so you can alert on provider failures (and so users get "try again" not "no flights").
4. **LOW — no bot protection on lead submission.** `/api/leads` has rate-limiting but no CAPTCHA/honeypot; expect spam leads. A honeypot field is a zero-friction start.

No SQLi/XSS exposure found in the flight path (Prisma parameterized, React escaping, no `dangerouslySetInnerHTML` except audited JSON-LD). Auth/CSRF are out of scope for the public flight flow (no session there).

---

## 10. Performance Audit (Phase 8)

**Not measured live — run Lighthouse + PageSpeed/CrUX against the production `/flights` before launch. The following are architecture-level observations, not field numbers.**

- **Likely LCP risk:** `FeaturedFlightDeals` loads **9 Unsplash images** (`images.unsplash.com`, `w=800`) below the search widget, plus the hero. None are `priority`; that's correct (below fold), but 9 remote hero-grade images is weight — confirm they're lazy and consider `sizes` accuracy (already set) and smaller `w=`.
- **Fonts:** two Google font families (Inter with 6 weights + Fraunces with 4) via `next/font` (self-hosted, good) — but 10 weights is a lot; subset to what's used.
- **Client-side search:** results render client-side after `fetch`; fine for ≤20 results (provider slices to 20). No virtualization needed at this scale.
- **CWV/CLS:** the `-mt-20 md:-mt-16` hero overlap (`flights/page.tsx:24`) and image-heavy grid are the CLS things to verify. Reserve space is present via fixed `h-44`/`h-44 relative` — good.
- **Caching:** flight search caches 5 min in-memory (weak on serverless, see §9.2). Add CDN/edge caching or KV.
- **INP:** heavy client component (`FlightSearch` holds ~12 `useState`); fine now, watch as filters grow.

**Action:** capture a real Lighthouse run (mobile, throttled) and CrUX field data; treat any LCP > 2.5s / INP > 200ms / CLS > 0.1 as a fix item. I can't produce those numbers from source.

---

## 11. Analytics & Conversion Tracking (Phase 10) — measurement is broken for flights

This is the finding with the fastest payback. Confirmed by grepping every `trackEvent`/`trackConversion` call site:

- **Flight search fires ZERO analytics.** `handleSearch` (`FlightSearch.tsx:147`) has no `trackEvent('flight_search', {from,to,date,pax,cabin})`. Meanwhile `VisaSearchForm`, `TrainSearchForm`, `InsuranceQuoteForm` all track their search. **You cannot see search volume, top routes, or search→result drop-off for your flagship product.**
- **Flight leads are NOT reported to Google Ads.** `BookingEnquiryModal` (`BookingEnquiryModal.tsx:64`) calls `trackEvent('generate_lead', …)` but **never `trackConversion(NEXT_PUBLIC_GOOGLE_ADS_LABEL_LEAD, …)`**. Compare: visa (`VisaHelpCTA.tsx:27`), insurance (`QuoteResults.tsx:36`), cruise (`CruiseCallCta.tsx:27`), and every LP CTA *do* fire `trackConversion`. Because flights, hotels, and packages all route through this shared modal, **none of their leads become Ads conversions** → Google Ads Smart Bidding is flying blind on your biggest categories, wasting spend. **One-line-per-path fix, potentially large ROI.**
- **No funnel events** (`view_search_results`, `select_flight`) between search and enquiry, so you can't find the leak.
- **Stack present:** GA4 + Google Ads via direct `gtag` (not GTM), Consent Mode v2, attribution capture. **Absent:** GTM container, Meta Pixel, Microsoft Clarity/Hotjar (heatmaps + session replay would be very high-value to *see* where the flight flow loses people).

**Fix set (all Low effort):**
1. `trackEvent('flight_search', {...})` in `handleSearch`.
2. Add `trackConversion(process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_LEAD, { vertical })` next to line 64 in `BookingEnquiryModal` (fixes flights **and** hotels/packages at once).
3. Add `select_flight` on `selectFlightForLeg`, `view_search_results` after results load.
4. Add Microsoft Clarity (free) for the flight flow.

---

## 12. AI Feature Recommendations (Phase 11)

You already have an AI planner (`/ai-planner`, `AIPlannerChat.tsx`) and `@google/genai` + assistant endpoints (visa/insurance/train assistants). Reuse that infrastructure for flights:

- **Natural-language route search** ("cheapest way to get my family of 4 to Ahmedabad in December") → parse to `{from,to,date,pax}` and pre-fill the widget. Highest-value, and you have the LLM plumbing.
- **AI fare-timing assistant** — "is $X good for JFK→DEL in December?" using your own lead history as the signal. Doubles as price-alert capture.
- **AI disruption / rebooking triage** — for existing customers, a lead-gen hook ("flight cancelled? we'll rebook you").
- **AI visa/passport reminder inline** on international searches (wire the visa engine into the flight result → a qualified visa lead too).

Keep AI as *lead-qualification and capture*, not as a booking bot — consistent with the model.

---

## 13. Competitive Differentiators (Phase 12)

Given the human-consultant model, lean into things OTAs *can't* do well:

- **"A real human quotes your exact fare in 30 min"** — make the response-time promise a first-class, measured trust badge (you already claim it on the LP; put it on the search flow).
- **Trip Risk / Layover Quality score** — compute from segment data you already have (tight connection, overnight, self-transfer). OTAs bury this; you flag it.
- **Hidden-fees / true-cost honesty** — "estimate + what a consultant confirms" as a *feature*, not an apology.
- **Diaspora specialization** — USA↔India family travel (kids/infants, multi-city, festival timing) is your `usa-to-india` page's whole thesis. Own that niche in copy, routes, and consultant expertise; it's defensible against generic OTAs.
- **One enquiry, whole trip** — flight + visa + insurance + transfer + hotel in a single consultant conversation. This is the actual product; the search widget is just the top of it.

---

## 14. Technical Architecture Review (Phase 13)

- **Stack:** Next.js 16 (App Router, RSC), React 19, Tailwind v4, Prisma 6, Zod, deployed on Vercel. Modern and coherent.
- **Provider abstraction is clean:** `FlightProvider` interface with mock/scraper swap behind `RAPIDAPI_KEY` (`flights.ts:66,564`). Swapping to a real supplier (Amadeus/Duffel) later is a single-adapter change — good design.
- **Key risk — data source is an unofficial scraper.** "Sky Scrapper" is a RapidAPI reseller of scraped Skyscanner data: no SLA, breakage risk, ToS ambiguity, and it can't transact. Fine for a lead-gen MVP (the code says so), but it's the top piece of technical debt. Plan the migration to a licensed aggregator (Duffel for a future booking path; Amadeus/Travelport for content).
- **Serverless state** (§9.2): move rate-limit + cache to KV/Redis.
- **Testing:** Vitest present, with tests for rateLimit/leads/attribution/pricing/engines — but **no tests for the flight provider or `flightDisplay` sort/filter**. Add unit tests for `sortFlights`, `getDepartureBucket`, `parseDurationMinutes`, and the scraper mapping.
- **Error observability:** provider failures collapse to `[]`; add real error surfacing + logging/alerting (Sentry).

### Wireframe — Result card v2 (adds confidence + lower-friction lead)
```
┌───────────────────────────────────────────────────────────┐
│ [BEST VALUE]                          typical: $520–$610 ⓘ │
│  🛫 Emirates  EK202 · Economy · Operated by Emirates       │
│  09:15 JFK ───4h 20m, 1 stop (DXB)──── 21:35 DEL  +1       │
│  ⚠ 9h overnight layover in DXB   🧳 2 bags   ♻ −12% CO₂    │
│  ✓ Refundable   ✓ Changes allowed                          │
│  ~$596 est.  [ Ask a consultant ]      [ Select flight ▸ ] │
└───────────────────────────────────────────────────────────┘
  ↑ new: computed badge, price context, layover-quality warning,
    per-card low-friction "Ask a consultant" lead CTA
```

### Wireframe — search-bar validation
```
From [ JFK �on-select→resolved ]  ⇅  To [ DEL ]   ← block search if from==to or unresolved
Depart [Jul 24]  Return [—]   Travelers [2 adults, 1 child, 1 infant ▾]  ← child/infant added
                                         ^^^ NEW passenger breakdown
```

---

## 15. Prioritized Roadmap (Phase 14) — ranked by ROI = (Revenue × User impact) ÷ Effort

Each item: **[Effort / Time / Dependencies]**.

### 🔴 CRITICAL — do before/at launch (blockers)
1. **Remove fabricated "50% OFF / was $X est." pricing** in `FeaturedFlightDeals`. *Business: avoids FTC/state-AG deceptive-pricing exposure. Revenue: neutral-positive (trust). User: +trust.* **[Low / 0.5 day / none]**
2. **Rate-limit `/api/flights` + `/api/airports`.** *Business: stops paid-quota drain / key ban. Revenue: protects unit economics.* **[Low / 0.5 day / rateLimit.ts (exists)]**
3. **Fire `trackConversion()` for flight (modal) leads.** *Business: Google Ads can finally optimize; likely large ad-spend efficiency gain — also fixes hotels/packages. Revenue: HIGH.* **[Low / 1 hr / GOOGLE_ADS_LABEL_LEAD env]**
4. **Add `flight_search` + funnel events.** *Business: you can measure the flagship funnel. Revenue: enables all later optimization.* **[Low / 0.5 day / none]**

### 🟠 HIGH — revenue next
5. **Cross-sell attach after every flight lead** (insurance → transfer → visa → hotel). *Revenue: +15–40% per lead; all verticals already built.* **[Med / 1 wk / existing vertical components]**
6. **Programmatic route pages `/flights/[from]/[to]`** (top 300–500 US pairs, ISR, sitemap). *Revenue: the traffic engine. This is what unlocks the "aggressive" row in §6.* **[Med-High / 2–3 wk / clone usa-to-india template + sitemap.ts]**
7. **Child/infant passenger support** end-to-end. *Revenue: unblocks family/diaspora leads (your core). User: HIGH.* **[Med / 3–4 days / TravelerClassPicker + API + provider]**
8. **Price-drop / route-watch alert capture (email).** *Revenue: grows lead list from not-ready-yet users.* **[Med / 1 wk / email sender]**
9. **JSON-LD + FAQ on `/flights`.** *Revenue: SEO on highest-authority page.* **[Low / 0.5 day / structuredData.ts (exists)]**

### 🟡 MEDIUM — UX / correctness
10. **Accessibility pass** on typeahead/date/traveler (ARIA combobox/listbox, calendar `aria-label`s). *Also reduces ADA legal risk.* **[Med / 3–4 days]**
11. **Fix round-trip framing** (label per-direction estimate or fetch true RT). **[Med / 3 days / provider]**
12. **Search-bar validation** (from≠to, resolve-to-IATA, non-empty). **[Low / 1 day]**
13. **Skeleton loaders** for results (mirror `HotelSkeleton`). **[Low / 0.5 day]**
14. **Airport + airline SEO hubs.** **[Med / 2 wk / route-page infra]**
15. **Microsoft Clarity** on the flight flow. **[Low / 2 hr]**

### 🟢 LOW — nice-to-have
16. NL search pre-fill via existing `@google/genai`. **[Med / 1 wk]**
17. Layover-quality / trip-risk score on cards. **[Low-Med / 3 days]**
18. Nearby/flexible-airport suggestions. **[Med / 1 wk]**
19. Move rate-limit + cache to Vercel KV. **[Med / 3 days]**
20. Unit tests for `flightDisplay` + provider mapping. **[Low / 2 days]**

---

## 16. Plans

### 30-Day Plan
Ship all 🔴 CRITICAL (1–4) in week 1 — they're mostly one-liners with outsized impact (compliance, cost, measurement). Weeks 2–4: HIGH items 5 (cross-sell attach) and 9 (JSON-LD), start 6 (route pages) and 7 (child/infant). **Outcome:** compliant, measurable, monetized-per-lead flight funnel with the SEO engine under construction.

### 90-Day Plan
Complete route-page cluster (6) + airport/airline hubs (14) → the organic-traffic flywheel. Finish child/infant (7), price alerts (8), accessibility (10), round-trip fix (11), Clarity (15). Stand up KV-backed caching/limits (19). **Outcome:** flights reaches SEO parity with your other verticals and starts compounding organic leads.

### 6-Month Growth Plan
Migrate off the scraper to a licensed content/booking API (Duffel/Amadeus) — optionally opening a *real* booking path for domestic US as a second revenue mode. Layer AI (16), trip-risk scoring (17), and a "one enquiry, whole trip" bundling experience (13/§5). Scale route pages to the long tail. **Outcome:** defensible diaspora-focused flight lead engine with cross-vertical attach; positioned for either continued lead-gen scale or a hybrid book-online pivot.

### Estimated revenue potential (recap, illustrative — see §6 assumptions)
- **Monthly:** ~$1.3k (conservative) → ~$10k (base) → ~$65k (aggressive, post-SEO).
- **Annual:** ~$15k → ~$120k → ~$790k. Driven almost entirely by **traffic (SEO §7)** and **attach (§6)** — *not* by chasing OTA feature parity.

---

## 17. Final Pre-Launch Checklist (flights)

- [ ] Remove/replace "50% OFF / was $X est." deceptive pricing (§8, roadmap #1)
- [ ] Rate-limit `/api/flights` and `/api/airports` (§9.1, #2)
- [ ] `trackConversion()` on modal leads; `flight_search` + funnel events (§11, #3–4)
- [ ] Business identity / seller-of-travel disclosure visible; `TravelAgency` JSON-LD address populated (§8)
- [ ] Real Lighthouse + CrUX run; fix any LCP>2.5s / INP>200ms / CLS>0.1 (§10)
- [ ] Search validation: from≠to, resolve to IATA, non-empty (§4, #12)
- [ ] Distinct API error state vs "no flights" (§9.3)
- [ ] Honeypot on `/api/leads` (§9.4)
- [ ] `/flights` JSON-LD + FAQ (§7, #9)
- [ ] Accessibility smoke test with a screen reader on the widget (§3, #10)
- [ ] Child/infant passengers (if launching family/diaspora messaging) (§4, #7)
- [ ] Cross-sell attach live on at least insurance + transfer (§6, #5)
- [ ] First batch of `/flights/[from]/[to]` route pages in sitemap (§7, #6)

---

### Appendix — files referenced
`src/app/flights/page.tsx` · `src/app/flights/usa-to-india-flight-tickets/page.tsx` · `src/app/lp/flight-booking/page.tsx` · `src/app/api/flights/route.ts` · `src/app/api/airports/route.ts` · `src/app/api/leads/route.ts` · `src/lib/providers/flights.ts` · `src/lib/flightDisplay.ts` · `src/components/search/FlightSearch.tsx` · `FlightResultCard.tsx` · `AirportAutocomplete.tsx` · `DatePicker.tsx` · `TravelerClassPicker.tsx` · `FlightFilters.tsx` · `src/components/flights/FeaturedFlightDeals.tsx` · `src/components/leads/BookingEnquiryModal.tsx` · `src/lib/rateLimit.ts` · `src/lib/analytics.ts` · `src/lib/structuredData.ts` · `src/app/sitemap.ts` · `src/app/layout.tsx` · `next.config.ts`
