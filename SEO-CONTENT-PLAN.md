# SEO Content Plan — Ticketing-Info

20 keyword-targeted pages for domestic Indian, outbound, and NRI/diaspora travelers, prioritized by lead
potential. Grounded in July 2026 keyword research (see Sources below) rather than guesswork — notably:
IRCTC's senior-citizen **fare discount has been suspended since March 2020** and was not reinstated in the
2026 budget (only quota/lower-berth priority remains), and NRI "OCI card vs Indian visa" is a live,
actively-searched confusion point — both are reflected accurately in the pages below rather than repeating
outdated claims common on competitor sites.

Pages marked **✅ Built** exist in this PR under their listed URL, nested under their vertical per the site's
existing route structure. The rest are prioritized for the next content sprints — one or two per week is a
sustainable cadence for a single operator, reusing the same schema/CTA pattern established by the three
built pages.

## Flights

| # | Page | Target keyword | URL | Intent | Priority | Type |
|---|------|-----------------|-----|--------|----------|------|
| 1 | ✅ **Built** — USA to India Flight Tickets | usa to india flight tickets, cheap flights to india from usa | `/flights/usa-to-india-flight-tickets` | Transactional | High | Landing page |
| 2 | Delhi to Dubai Flight Tickets | delhi to dubai flight tickets | `/flights/delhi-to-dubai-flight-tickets` | Transactional | High | Landing page |
| 3 | JFK / Newark / SFO to India Direct Flights | jfk to delhi flights, newark to mumbai flights | `/flights/jfk-newark-to-india-direct-flights` | Transactional | Medium-High | Landing page |
| 4 | Flight Ticket Cancellation & Refund Rules in India | flight ticket cancellation refund rules india | `/flights/flight-cancellation-refund-rules-india` | Informational→Transactional | Medium | Blog post |
| 5 | Best Time to Book International Flight Tickets from India | best time to book international flights from india | `/flights/best-time-to-book-international-flights` | Informational | Medium | Blog post |

## Trains

| # | Page | Target keyword | URL | Intent | Priority | Type |
|---|------|-----------------|-----|--------|----------|------|
| 6 | ✅ **Built** — IRCTC Senior Citizen Train Ticket Discount | irctc senior citizen discount 2026 | `/trains/senior-citizen-train-ticket-discount` | Informational→Transactional | High | Landing page |
| 7 | IRCTC Tatkal Booking Rules & Timing | irctc tatkal booking rules 2026, tatkal timing | `/trains/irctc-tatkal-booking-rules` | Informational→Transactional | High | Blog post |
| 8 | Scenic Train Routes in India for Tourists | scenic train routes india, luxury train india | `/trains/scenic-train-routes-india` | Inspirational | Low-Medium | Blog post |

## Visas

| # | Page | Target keyword | URL | Intent | Priority | Type |
|---|------|-----------------|-----|--------|----------|------|
| 9 | ✅ **Built** — OCI Card vs Indian Visa for NRIs | oci card vs indian visa, oci vs visa for india | `/visas/oci-vs-indian-visa-for-nris` | Informational→Transactional | High | Landing page |
| 10 | Schengen Visa for Indians — Requirements & Processing Time | schengen visa for indians 2026, schengen visa processing time india | `/visas/schengen-visa-for-indians` | Informational→Transactional | High | Landing page |
| 11 | US Tourist Visa for Indians — Documents & Wait Times | us tourist visa for indians, us visa appointment wait time india | `/visas/us-tourist-visa-for-indians` | Informational→Transactional | High | Landing page |
| 12 | Visa-Free & Visa-on-Arrival Countries for Indian Passport Holders | visa free countries for indians 2026, visa on arrival for indian passport | `/visas/visa-free-countries-for-indians` | Informational | Medium-High | Blog post (listicle, strong internal-link hub) |

## Tour Packages

| # | Page | Target keyword | URL | Intent | Priority | Type |
|---|------|-----------------|-----|--------|----------|------|
| 13 | Tour Packages from Delhi | tour packages from delhi | `/packages/tour-packages-from-delhi` | Transactional | High | Landing page |
| 14 | Tour Packages from Mumbai | tour packages from mumbai | `/packages/tour-packages-from-mumbai` | Transactional | Medium | Landing page |
| 15 | Kashmir Tour Packages — Itinerary & Best Time to Visit | kashmir tour package from delhi/mumbai | `/packages/kashmir-tour-packages` | Transactional | Medium | Landing page |
| 16 | Honeymoon Packages — Domestic & International | honeymoon packages india, honeymoon packages from india | `/packages/honeymoon-packages` | Transactional | Medium | Landing page |

## Insurance

| # | Page | Target keyword | URL | Intent | Priority | Type |
|---|------|-----------------|-----|--------|----------|------|
| 17 | Travel Insurance for Parents Visiting the USA (Visitor Insurance) | travel insurance for parents visiting usa, visitor insurance for parents | `/insurance/travel-insurance-parents-visiting-usa` | Transactional | Medium-High | Landing page — big, underserved NRI need |
| 18 | Travel Insurance for Indians Traveling Abroad — What It Covers | travel insurance for indians going abroad | `/insurance/travel-insurance-for-indians-abroad` | Informational→Transactional | Medium | Blog post |

## Cross-vertical / pillar content

| # | Page | Target keyword | URL | Intent | Priority | Type |
|---|------|-----------------|-----|--------|----------|------|
| 19 | NRI Family Visiting India — Complete Travel Checklist | nri visiting india checklist, parents visiting india from usa | `/blog/nri-family-visiting-india-checklist` | Informational | Medium-High | Blog post — pillar page linking flights, OCI/visa, insurance, packages |
| 20 | Best Time to Visit India — Season-by-Season Guide | best time to visit india | `/packages/best-time-to-visit-india` | Inspirational | Medium | Blog post |

## Production pattern (for #2–20)

Each new page should follow the pattern established by the 3 built pages (`src/lib/structuredData.ts`,
`src/components/seo/JsonLd.tsx`):
- 800+ words of original content, one `<h1>`, logical `<h2>`/`<h3>` hierarchy.
- `breadcrumbJsonLd()` + `faqPageJsonLd()` (3–5 real Q&As per page).
- `alternates.canonical` + explicit `openGraph.title`/`description`.
- Internal links to the relevant vertical search page, `/get-quote`, and at least one other landing/blog page.
- A CTA block linking to `/get-quote` and WhatsApp.
- Added to `LANDING_PAGE_ROUTES` in `src/app/sitemap.ts`.

## Sources consulted

- [NRI OCI Cardholder Travel Rules 2026](https://www.happyfares.in/blog/nri-oci-cardholder-travel-rules-2026/)
- [OCI Card vs Indian Visa: Which Is Better for NRIs](https://www.myflyyatra.com/blog/oci-card-vs-indian-visa-which-is-better-for-nris-traveling-to-india)
- [Best Flights USA To India: Airlines, Routes & Prices (2026)](https://www.myflyyatra.com/blog/best-flights-usa-to-india-airlines-routes-prices-compared-2026-guide)
- [Travel SEO Keywords: 2026 Data-Driven Guide](https://www.causalfunnel.com/blog/travel-seo-keywords-the-complete-data-driven-guide-to-ranking-in-2026/)
- [Guide to IRCTC Senior Citizen Discount & Rules 2026](https://irctconline.in/guides/guide-to-irctc-senior-citizen-discount-rules-2026)
- [Budget 2026: Will Senior Citizen Railway Concessions Return?](https://www.angelone.in/news/budget/budget-2026-will-senior-citizen-railway-concessions-finally-return)
- [Schengen Visa Processing Time Country-Wise: 2026 Guide for Indians](https://travelsagaholidays.in/blog/schengen-visa-processing-time-country-wise/)
- [Visa requirements for Indian citizens — Wikipedia](https://en.wikipedia.org/wiki/Visa_requirements_for_Indian_citizens)
- [Top Travel Trends for Travelers in 2026 — IndianHoliday](https://www.indianholiday.com/blog/upcoming-travel-trends/)

Note: keyword clusters around "dummy flight ticket" / "flight itinerary for visa" generators were excluded
deliberately — several results promoting them raise real questions about facilitating visa-application
misrepresentation, which isn't something to build organic content around.
