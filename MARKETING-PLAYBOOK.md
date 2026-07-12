# Off-Site Marketing Playbook — Ticketing-Info

Everything in this document happens *outside* the codebase — accounts, listings, and outreach only you can
do. It assumes the business is Wyoming-registered with no public storefront (confirmed setup), so it's
framed as a **service-area / online travel agency**, not a walk-in local shop. Pair this with the technical
work in this PR: the FAQ page, testimonials section, `/get-quote` flow, and GA4 events all exist specifically
to make the actions below measurable.

## Week 1 — Foundation

**1. Fill in the environment variables this PR added placeholders for.** Nothing below works without these
live in Vercel production:
- `NEXT_PUBLIC_BUSINESS_PHONE`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_BUSINESS_EMAIL` — already set locally, confirm they're set in Vercel too.
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_GSC_VERIFICATION` — see step 3 below.
- `NEXT_PUBLIC_BUSINESS_STATE` / `NEXT_PUBLIC_BUSINESS_COUNTRY` — defaults to Wyoming/US.

**2. Google Business Profile — as a service-area business.**
GBP is built around a physical location by default, but it explicitly supports **service-area businesses**
(SABs) that serve customers without a public storefront — this is the right category for a Wyoming-registered
online travel agency:
1. Go to [business.google.com](https://business.google.com) and create a profile under "Ticketing-Info."
2. When asked "Do you serve customers at your business address?", choose **No** — this triggers the
   service-area flow and hides your address from the public listing (you'll still enter it privately for
   verification).
3. Set service areas to the regions you actually serve — e.g. "United States" plus any Indian metro areas you
   actively book from. You can list up to 20 areas.
4. Category: "Travel Agency." Add phone, website (ticketing-info.org), and hours.
5. Verification for SABs is usually done by phone or postcard to your registered Wyoming address — expect a
   1–2 week wait for the postcard option.
6. Once verified, the review-collection process in step 6 below starts feeding this profile — SAB profiles
   without any reviews are functionally invisible in local search, so this only pays off once you have real
   reviews attached.

**3. Google Analytics 4 + Search Console.**
- **GA4**: go to [analytics.google.com](https://analytics.google.com) → Admin → Create Property → name it
  "Ticketing-Info" → add a Web data stream for `https://www.ticketing-info.org` → copy the **Measurement ID**
  (format `G-XXXXXXXXXX`) → set it as `NEXT_PUBLIC_GA_MEASUREMENT_ID` in Vercel.
- **Search Console**: go to [search.google.com/search-console](https://search.google.com/search-console) →
  Add Property → enter `https://www.ticketing-info.org` (URL-prefix method) → choose the **HTML tag**
  verification option → copy the value inside `content="..."` → set it as `NEXT_PUBLIC_GSC_VERIFICATION` in
  Vercel → redeploy → click Verify in Search Console.
- Once verified, submit the sitemap: Search Console → Sitemaps → enter `sitemap.xml` → Submit. The sitemap
  this PR ships already includes every page plus every published blog post automatically.
- Once GA4 is live, the `generate_lead` and `whatsapp_click` events wired up in this PR (form submissions,
  WhatsApp clicks sitewide) start populating — check Reports → Engagement → Events after a day of traffic.

**4. WhatsApp Business + catalog.**
1. Download **WhatsApp Business** (not regular WhatsApp) on the number set as `NEXT_PUBLIC_WHATSAPP_NUMBER`.
2. Complete the Business Profile: name, category ("Travel Agency"), description, business hours, address
   (optional given the SAB setup), and website link.
3. Set up **Quick Replies** for the messages you'll get most from the site's WhatsApp buttons — e.g. a
   template for "flight ticket enquiry," one for "visa question," one for "tour package."
4. Build a **Catalog** (Business tools → Catalog) listing your core offerings — Flight Ticket Booking, Train
   Ticket Booking, Tour Packages, Visa Assistance, Travel Insurance — each as a catalog item with a short
   description and a representative image. This turns your WhatsApp chat into something closer to a
   storefront when people land there from the site's floating WhatsApp button.
5. Turn on the **Away Message** and **Greeting Message** so leads get an instant response outside business
   hours instead of silence.

## Week 1–2 — Directory listings

Free, relevant listings for an Indian-travel-focused online agency. Do these after GBP is live so your NAP
(Name/Address/Phone) is consistent everywhere — inconsistent business info across listings actively hurts
local SEO.

- **JustDial** and **Sulekha** — the two largest Indian local-business directories; both have free listing tiers and strong domestic-India search visibility.
- **IndiaMART** — B2B-leaning but has a travel-services category with real search traffic.
- **TripAdvisor** (Owners) — list as a Tour Operator / Travel Agency; even without hotel/attraction listings, you can list the agency itself.
- **Yelp for Business** — relevant given the US registration; category "Travel Services."
- **Trustpilot** — free business profile; start this alongside your review-collection push in step 6 so it isn't an empty shell.
- **Facebook Business Page**, **Instagram Business Profile**, **LinkedIn Company Page** — not directories in the traditional sense, but function as trust signals and secondary listing surfaces that Google indexes.
- **TAAI (Travel Agents Association of India)** or **ASTA (American Society of Travel Advisors)** — membership isn't free, but a directory listing from either is a strong trust/backlink signal if the budget allows later; not a Week 1–2 priority.

## Week 2–3 — Social proof

The `/admin/testimonials` panel already exists (this PR just made it render publicly on the homepage via
`TestimonialsSection` — with an honest empty state, no placeholder reviews, until you add real ones).

1. **Ask right after a booking is confirmed**, not weeks later — response rates drop fast after the trip is over. A WhatsApp template like: *"Glad we could get [destination] sorted for you! If you have 30 seconds, a quick review helps other travelers find us: [Google review link]"* works well.
2. **Generate your Google review link**: once GBP is verified, Google Business Profile → Ask for reviews → copy the short link. Share it via WhatsApp/email post-booking.
3. **Feed real reviews into the site**: copy strong reviews (with the customer's permission) into `/admin/testimonials`, mark them `published`. They immediately show on the homepage and — once you have at least one — the site starts emitting real `AggregateRating` structured data (see `src/lib/structuredData.ts`), which is only added when genuine published reviews exist.
4. Set a light cadence: aim for 2–3 review requests a week rather than a one-time bulk campaign — steady review growth reads better to both customers and Google than a burst.

## Week 3–4 — Backlinks

Realistic, not spammy:
- **Guest posts** on mid-tier travel and NRI-community blogs (not just aggregator link farms) — offer a genuinely useful piece (e.g. "OCI card renewal checklist," expanding on the landing page this PR built) in exchange for an author-bio link back.
- **NRI community forums and Facebook groups** (city-specific Indian-American groups are very active) — participate authentically, answer travel questions, and only link back when it's directly relevant, not as the first thing you post.
- **Local partnerships** — Indian cultural associations, temples/gurdwaras/mosques with active diaspora communities, and immigration/visa consultants are natural referral partners; a simple mutual-listing or referral-fee arrangement can be a steady lead source, not just a backlink.
- **HARO-style journalist outreach** (Connectively, formerly HARO, or Qwoted) — respond to reporter queries about NRI travel, IRCTC changes, or visa policy; a quote in a real publication is both a backlink and direct trust signal.
- **Digital PR hook**: your own data is a story — e.g. "we analyzed X leads and here's the cheapest month to book USA–India flights" — pitch that angle to travel or personal-finance blogs once you have a few months of real lead data from the new GA4 events.

## Paid ads — when and how much

Hold off on Google Ads until the organic + tracking foundation above is live — without GA4 conversion
tracking wired up (done in this PR) you can't tell which keywords actually produce leads, and you'll burn
budget optimizing blind.

**Start once**: GA4 is verified and showing `generate_lead` events, and you have at least 2–4 weeks of
organic traffic data to see which of the 20 content-plan keywords are gaining traction.

**Starter budget**: $300–500/month, exact-match on 8–10 of the highest-intent, lowest-competition terms from
`SEO-CONTENT-PLAN.md` — "usa to india flight tickets," "oci card vs indian visa," "tour packages from delhi,"
and similar — rather than broad-match on expensive head terms like "flights to india," which will drain
budget against much larger competitors. Track cost-per-lead against the GA4 `generate_lead` event weekly for
the first month before scaling spend up.

## This week — top 5 actions

1. Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` and `NEXT_PUBLIC_GSC_VERIFICATION` in Vercel and submit the sitemap to Search Console (step 3).
2. Create the Google Business Profile as a service-area business (step 2).
3. Set up WhatsApp Business with the catalog (step 4).
4. Confirm `NEXT_PUBLIC_WHATSAPP_NUMBER` / `NEXT_PUBLIC_BUSINESS_PHONE` / `NEXT_PUBLIC_BUSINESS_EMAIL` are correct in Vercel production, not just local — every CTA this PR added depends on them.
5. Send your first 3–5 review requests to recently completed bookings (step 6) so the homepage testimonials section and GBP profile aren't empty when people start finding the site.
