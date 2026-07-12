# Google Ads Setup Guide — Ticketing-Info

Everything here is a manual step in the Google Ads UI, paired with exactly where each ID goes in the code.
Pairs with `ADS-KEYWORD-PLAN.md` (keywords) and the 4 landing pages under `/lp/*` this PR ships.

## 1. Campaign structure

**One campaign per ad-group theme, not one big campaign with 4 ad groups.** Separate campaigns let you set
different budgets and bidding strategies per theme once you see which converts best — you can't do that with
ad groups sharing one campaign budget.

```
Campaign: Flight Booking          → Ad Group: Flight Booking        → landing page: /lp/flight-booking
Campaign: Visa Assistance         → Ad Group: Visa Assistance       → landing page: /lp/visa-assistance
Campaign: Tour Packages           → Ad Group: Tour Packages         → landing page: /lp/tour-packages
Campaign: Train & Bus Tickets     → Ad Group: Train & Bus Tickets   → landing page: /lp/train-bus-tickets
```

Each campaign: **Search** campaign type, **Manual CPC** to start (switch to Maximize Conversions once you
have 15-30 conversions per campaign — Smart Bidding needs data to work with, and starting on it blind burns
budget learning). Keep each ad group's keyword list under ~15-20 tightly related keywords from
`ADS-KEYWORD-PLAN.md` — a tighter ad group gets a better Quality Score, which lowers your cost per click.

## 2. Example responsive search ads (3 per ad group)

RSAs let you enter up to 15 headlines and 4 descriptions; Google mixes and tests combinations. These are
starting examples — replace anything bracketed, and don't submit a headline you can't actually back up.

### Flight Booking
1. **Headlines**: "Book Flight Tickets Today" / "Compare Fares, Real Consultant" / "Domestic & International Flights"
   **Description**: "Get a fare quote in minutes from a real consultant — not a bot. Domestic and international routes."
2. **Headlines**: "Flight Booking Made Simple" / "Talk to a Travel Consultant" / "Fast Fare Quotes"
   **Description**: "Tell us your route and dates. We compare fares across airlines and call you back."
3. **Headlines**: "USA to India Flight Tickets" / "Book With a Real Consultant" / "Get Your Fare Quote Free"
   **Description**: "Flying home or abroad? Get a personalized fare quote — no online payment required."

### Visa Assistance
1. **Headlines**: "Visa Assistance & Guidance" / "Document Checklist, Sorted" / "Talk to a Visa Consultant"
   **Description**: "Get clear guidance on your visa application and required documents. Hindi & English support."
2. **Headlines**: "Applying for a Visa?" / "Get Expert Application Help" / "OCI Card Guidance for NRIs"
   **Description**: "We help you apply correctly and completely. Free initial guidance call."
3. **Headlines**: "Visa Document Checklist" / "Avoid Common Application Errors" / "Free Consultation Call"
   **Description**: "Speak with a visa consultant before you apply. Support for tourist, business & family visas."

*(Do not use headlines like "Guaranteed Visa Approval" or "100% Approval Rate" — this violates Google Ads
policy on unrealistic claims and is untrue; no agency can guarantee a consulate's decision.)*

### Tour Packages
1. **Headlines**: "Custom Tour Packages" / "Flights, Hotels & Transfers Bundled" / "Get a Free Package Quote"
   **Description**: "Tell us your budget and dates — we build a package around you. Domestic & international."
2. **Headlines**: "Honeymoon Packages" / "Customized to Your Budget" / "Talk to a Travel Consultant"
   **Description**: "Planning a honeymoon or family trip? Get a personalized package quote today."
3. **Headlines**: "Group Tour Booking" / "Discounts for Group Travel" / "Free Custom Quote"
   **Description**: "Traveling as a group? Tell us your headcount for a tailored package and pricing."

### Train & Bus Tickets
1. **Headlines**: "Train Ticket Booking Help" / "Tatkal & Quota Handled" / "Talk to a Booking Agent"
   **Description**: "Tell us your route and date — we handle Tatkal timing and quota requests for you."
2. **Headlines**: "Senior Citizen Quota Booking" / "Correct ID Match, Every Time" / "Book With a Real Agent"
   **Description**: "We book with the right name/ID match so quota isn't denied mid-journey."
3. **Headlines**: "Train & Bus Ticket Booking" / "Waitlist & Availability Help" / "Get Booking Help Now"
   **Description**: "No train option that fits? We check bus alternatives for the same route too."

## 3. Negative keyword starter list

Add these at the **account** or **campaign** level before launch — they're broad enough to waste real budget
across every ad group if left unblocked:

```
free, jobs, job, salary, career, careers, internship, hiring, recruitment,
sample, template, format, course, training, tutorial, how to become,
government job, sarkari, exam, syllabus, admit card, result,
scholarship, loan, refund status only, complaint, complain against,
wikipedia, meaning, definition, ppt, pdf download
```

Review the **Search Terms Report** weekly for the first month and add anything irrelevant showing spend — no
starter list catches everything.

## 4. Budget, location & language targeting

**Starting budget**: ₹500-1,000/day (~$6-12/day) per campaign is a realistic entry point for the Indian
market on Phrase match with the keyword lists in `ADS-KEYWORD-PLAN.md` — enough to gather conversion data
within 2-3 weeks without overcommitting before you know your cost-per-lead. Split unevenly if one theme is
clearly your strongest offering; don't spread evenly across all 4 just because there are 4.

**Location targeting**: Target India nationally to start, or narrow to the specific cities/states you can
realistically serve fast — a narrower radius often converts better than "all of India" for a small team. If
you serve the NRI/diaspora audience (relevant given the USA-India flight and OCI-visa content already on the
site), add a second, separate campaign layer targeting the US with "United States" location targeting — do
not mix Indian and US location targeting in the same campaign, since bid amounts and competition differ
substantially between the two markets.

**Language targeting**: English + Hindi, matching the "support in Hindi & English" claim on the pages.

## 5. Reading results in the first 2 weeks

Don't judge performance on impressions or clicks — judge it on **cost per lead** (the `generate_lead`
conversion), which you can see once GA4/Ads conversion tracking (below) is live. In the first 2 weeks:
- Expect a "learning" period with noisier numbers — don't pause keywords after 2-3 days of data.
- Check the **Search Terms Report** every few days and add irrelevant terms to your negative list.
- If a whole ad group has spend but zero leads after ~50 clicks, the message match is likely off (ad promise
  doesn't match the landing page) — re-check ad copy against the specific landing page headline, not just
  the keyword.
- Once you have 15-30 conversions on a campaign, consider switching that campaign's bidding to **Maximize
  Conversions** (or Target CPA once you know a realistic cost-per-lead number).

## 6. Creating conversion actions + where the IDs go

1. Google Ads → **Tools & Settings → Conversions → + New conversion action → Website**.
2. Create **three** conversion actions: "Lead Form Submission" (primary), "Click to Call", "WhatsApp Click".
   For each: category "Submit lead form" / "Contact" as appropriate, value "Don't use a value" (or set one
   once you know average booking value), count "One" (don't count duplicate submits from the same visit).
3. For each conversion action, open it and copy two things: the **Conversion ID** (shared across your whole
   account, format `AW-123456789`) and that action's unique **Conversion Label**.
4. Set these in Vercel (Project Settings → Environment Variables), matching `.env.example`:
   - `NEXT_PUBLIC_GOOGLE_ADS_ID` = your `AW-XXXXXXXXX` conversion ID (same value for all three).
   - `NEXT_PUBLIC_GOOGLE_ADS_LABEL_LEAD` = the label from "Lead Form Submission".
   - `NEXT_PUBLIC_GOOGLE_ADS_LABEL_CALL` = the label from "Click to Call".
   - `NEXT_PUBLIC_GOOGLE_ADS_LABEL_WHATSAPP` = the label from "WhatsApp Click".
5. Redeploy (env var changes need a new build to take effect — same as the GA4 setup). Once live:
   - The lead-form conversion fires once, on `/lp/thank-you` after a successful submission.
   - Call/WhatsApp conversions fire immediately on click, from every `/lp/*` page (inline buttons + the
     mobile sticky bar).
6. Verify with Google Ads' own **Tag Assistant** or the **Google Tag Manager/Ads "Preview"** tool, or check
   **Google Ads → Conversions** for a "Recording conversions" status a few hours after your first real test
   submission — don't just trust that the code shipped; confirm a conversion actually recorded.

## Pre-launch checklist

- [ ] Replace all placeholder phone/WhatsApp numbers — confirm `NEXT_PUBLIC_BUSINESS_PHONE` and
      `NEXT_PUBLIC_WHATSAPP_NUMBER` are your real numbers in Vercel production (same vars the rest of the
      site already uses).
- [ ] Set all four `NEXT_PUBLIC_GOOGLE_ADS_*` env vars from step 6 above and redeploy.
- [ ] Submit one real test lead through each of the 4 `/lp/*` forms and confirm it appears in `/admin/leads`
      with `source: google_ads` and the right `theme`/UTM values in its payload.
- [ ] Click Call and WhatsApp on each landing page from a real phone and confirm the dialer/WhatsApp opens.
- [ ] Confirm conversions are recording in Google Ads (step 6.6) before turning on real budget — an
      unverified pixel means you're flying blind on cost-per-lead from day one.
- [ ] Replace the `XX+` placeholder stats in the Trust Signals section (`src/components/lp/TrustSignals.tsx`)
      with real figures once you have them — they're deliberately masked so nothing fake ships by accident.
- [ ] Read the negative keyword list above into every campaign before turning it on, not after.
- [ ] Double check each RSA's landing page URL actually points at the matching `/lp/<theme>` page —
      message-match mistakes are the single biggest silent killer of Quality Score and conversion rate.
