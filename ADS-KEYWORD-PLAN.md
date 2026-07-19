# Google Ads Keyword Plan — Ticketing-Info

Buyer-intent keywords for the 5 paid-traffic landing pages (`/lp/*`), grouped into tight ad-group themes.
These are deliberately narrower and more transactional than `SEO-CONTENT-PLAN.md` — that document targets
research-stage searchers Google should rank organically over months; this one targets people typing a query
with a credit card in hand, right now, that we bid on directly. Built on the same market research validated
in `SEO-CONTENT-PLAN.md` (NRI/diaspora audience, Delhi/Mumbai routes, IRCTC, OCI/visa) plus standard PPC
buyer-intent keyword construction — live web search for this pass hit a rate limit mid-session, so treat the
keyword *list* as a strong starting point to validate against Google Ads Keyword Planner's actual volume/CPC
data before launch, not as a final locked list.

**Intent level key**: 🔴 High = ready to buy this week · 🟡 Medium = actively comparing, close to booking ·
🟢 Low = early research, cheaper clicks but lower conversion — good for remarketing lists, not exact-match spend.

## Ad Group 1 — Flight Booking (`/lp/flight-booking`)

| Keyword | Match type to start | Intent |
|---|---|---|
| book flight tickets online | Phrase | 🔴 |
| flight booking agent | Phrase | 🔴 |
| flight ticket booking near me | Phrase | 🔴 |
| cheap flight tickets [city] to [city] | Phrase (per active route) | 🔴 |
| usa to india flight tickets booking | Phrase | 🔴 |
| last minute flight booking india | Phrase | 🔴 |
| international flight ticket agent | Broad-match modifier / Phrase | 🟡 |
| domestic flight booking offers | Phrase | 🟡 |
| flight ticket price today | Exact | 🟡 |
| cheap flights | Broad | 🟢 (high volume, low intent — cap budget) |

## Ad Group 2 — Visa Assistance (`/lp/visa-assistance`)

| Keyword | Match type to start | Intent |
|---|---|---|
| visa agent near me | Phrase | 🔴 |
| visa consultant for [country] | Phrase (per country you actively serve) | 🔴 |
| us visa appointment help india | Phrase | 🔴 |
| schengen visa agent india | Phrase | 🔴 |
| oci card application help | Phrase | 🔴 |
| visa application assistance | Phrase | 🟡 |
| tourist visa consultant | Phrase | 🟡 |
| visa documents checklist help | Broad-match modifier | 🟢 |
| [country] visa requirements for indians | Broad | 🟢 (informational-leaning — send this traffic to the SEO page instead, not paid) |

## Ad Group 3 — Tour Packages (`/lp/tour-packages`)

| Keyword | Match type to start | Intent |
|---|---|---|
| tour package booking | Phrase | 🔴 |
| honeymoon package [destination] | Phrase (per destination you sell) | 🔴 |
| group tour booking | Phrase | 🔴 |
| tour packages from delhi | Phrase | 🔴 |
| tour packages from mumbai | Phrase | 🔴 |
| family tour package all inclusive | Phrase | 🟡 |
| customized tour package agent | Phrase | 🟡 |
| best tour package deals | Broad-match modifier | 🟡 |
| holiday package india | Broad | 🟢 |

## Ad Group 4 — Train & Bus Tickets (`/lp/train-bus-tickets`)

| Keyword | Match type to start | Intent |
|---|---|---|
| train ticket booking agent | Phrase | 🔴 |
| tatkal ticket booking help | Phrase | 🔴 |
| irctc booking agent | Phrase | 🔴 |
| senior citizen train ticket booking | Phrase | 🔴 |
| bus ticket booking online | Phrase | 🔴 |
| train ticket confirmation help | Phrase | 🟡 |
| waitlist ticket confirmation chances | Broad-match modifier | 🟡 |
| train seat availability check | Broad | 🟢 |

## Ad Group 5 — Cruise Deals (`/lp/cruise-deals`)

U.S.-audience group (unlike groups 1–4, which skew NRI/India routes). Serve U.S. geo-targets, daytime
bid adjustments, and **call extensions on every ad** — the whole point of this vertical is inbound phone
calls (see `CRUISE-CALL-ENGINE.md`).

| Keyword | Match type to start | Intent |
|---|---|---|
| cruise travel agent | Phrase | 🔴 |
| cruise travel agent near me | Phrase | 🔴 |
| book a cruise by phone | Phrase | 🔴 |
| [destination] cruise deals (Caribbean, Bahamas, Alaska…) | Phrase (per destination hub) | 🔴 |
| cruises from [port] (Miami, Fort Lauderdale, Galveston…) | Phrase (per port hub) | 🔴 |
| last minute cruise deals | Phrase | 🔴 |
| [cruise line] cruise deals (Royal Caribbean, Carnival…) | Phrase (per line hub) | 🟡 |
| cheap caribbean cruises all inclusive | Phrase | 🟡 |
| first time cruise advice | Broad | 🟢 (remarketing feed for the hub pages) |
| cruises | Broad | 🟢 (high volume — cap budget hard or skip) |

Destination/port/line template keywords should deep-link to the matching SEO hub
(`/cruises/destination/*`, `/cruises/from/*`, `/cruises/line/*`) rather than the generic LP — message
match lifts Quality Score and the hubs carry the same call CTAs with full attribution.

## Notes for the first two weeks

- Start every group on **Phrase match**, not Broad — Broad on a small starter budget burns spend on
  irrelevant traffic before you have enough conversion data to let Smart Bidding correct itself.
- The bracketed terms (`[city]`, `[country]`, `[destination]`) are templates — expand each into 3-5 concrete
  keywords for routes/destinations/countries you actually and currently serve well. Don't bid on a country
  or route you can't actually deliver a fast quote for; it wastes spend and damages Quality Score when people
  bounce.
- One 🟢-tagged informational query above ("[country] visa requirements for indians") is flagged to send to
  the *organic* SEO page instead of paid — bidding on it would just pay for traffic your SEO work already
  earns for free once it ranks.
- See `GOOGLE-ADS-SETUP.md` for campaign structure, negative keywords, and budget guidance built on top of
  this list.
