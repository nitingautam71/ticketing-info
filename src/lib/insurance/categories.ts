import type { PlanCategory } from './types';

/** Content model for /insurance/type/[slug] programmatic pages. Each entry is
 * a fully-written landing page: hero, why-it-matters, buying advice, FAQs. */
export interface CategoryPage {
  category: PlanCategory;
  slug: string;
  title: string;
  shortLabel: string;
  metaTitle: string;
  metaDescription: string;
  hero: string;
  whyItMatters: string[];
  buyingAdvice: string[];
  faqs: { question: string; answer: string }[];
}

export const CATEGORY_PAGES: CategoryPage[] = [
  {
    category: 'single_trip',
    slug: 'single-trip',
    title: 'Single Trip Travel Insurance',
    shortLabel: 'Single Trip',
    metaTitle: 'Single Trip Travel Insurance — Compare Plans for US & India Travellers',
    metaDescription:
      'Compare single-trip travel insurance from leading US and Indian insurers: medical cover, trip cancellation, baggage and evacuation. Instant indicative quotes.',
    hero: 'One trip, fully protected — medical emergencies, cancellations, delays and baggage on a single policy that starts when you leave and ends when you land home.',
    whyItMatters: [
      'A single hospital admission abroad can cost more than the entire holiday — in the USA a hospital day averages $11,000+.',
      'Airlines owe you very little when trips fall apart: cancellation and interruption cover refunds the prepaid money airlines and hotels keep.',
      'Single-trip policies are priced for exactly your dates and destination, so they are almost always cheaper than annual cover for one or two trips a year.',
    ],
    buyingAdvice: [
      'Buy within days of your first trip payment — early purchase unlocks pre-existing-condition waivers and Cancel For Any Reason eligibility on US plans.',
      'Insure the full non-refundable trip cost, not a round number: under-insuring voids proportional cancellation payouts on some wordings.',
      'Match medical cover to the destination: $250k+ for the USA/Canada, $100k for Europe/Asia long-haul, €30k minimum (by law) for Schengen visas.',
    ],
    faqs: [
      {
        question: 'When does single-trip cover start and end?',
        answer:
          'Cancellation cover starts the day the policy is issued; medical and baggage cover run from departure to return home (or the policy end date, whichever is first). Buying early therefore costs nothing extra and adds weeks of cancellation protection.',
      },
      {
        question: 'Can I extend my policy if I stay longer?',
        answer:
          'Most insurers allow one extension before the policy expires, subject to no pending claims — Indian insurers typically extend online or via the assistance line; World Nomads famously lets you extend from anywhere mid-trip.',
      },
      {
        question: 'Is single-trip insurance mandatory?',
        answer:
          'For Schengen visa applicants, yes — €30,000 medical cover is a visa condition. Cuba, Türkiye, the UAE and several other destinations also require proof of insurance. Everywhere else it is optional but strongly recommended.',
      },
    ],
  },
  {
    category: 'annual_multi_trip',
    slug: 'annual-multi-trip',
    title: 'Annual Multi-Trip Travel Insurance',
    shortLabel: 'Annual Multi-Trip',
    metaTitle: 'Annual Multi-Trip Travel Insurance — One Policy for Every Trip',
    metaDescription:
      'Compare annual multi-trip travel insurance for frequent flyers in the US and India: unlimited trips, per-trip caps, medical and cancellation cover on one yearly premium.',
    hero: 'Take three or more trips a year? One annual premium covers them all — no more buying (or forgetting to buy) a policy per trip.',
    whyItMatters: [
      'From roughly the third international trip a year, annual plans beat per-trip pricing — and the fourth trip travels free.',
      'The forgotten-policy problem disappears: every qualifying trip is automatically covered the moment you leave.',
      'Frequent business travellers get consistent limits and one certificate that works for visa applications all year.',
    ],
    buyingAdvice: [
      'Watch the per-trip cap — 30, 45 or 90 days per trip is the key difference between plans; a single long trip over the cap is uninsured for the excess days.',
      'Check whether domestic trips count: US annual plans often cover getaways 100+ miles from home; Indian annual plans are usually international-only.',
      'Cancellation limits on annual plans are yearly aggregates, not per-trip — size them against your typical prepaid costs.',
    ],
    faqs: [
      {
        question: 'How many trips does an annual policy cover?',
        answer: 'Usually unlimited trips within the policy year, as long as each trip stays under the per-trip day cap (commonly 30–90 days).',
      },
      {
        question: 'Does annual cover work for Schengen visas?',
        answer:
          'Yes — insurers issue Schengen-compliant certificates against annual policies, and one policy serves every application that year. Confirm the certificate shows the €30,000 medical minimum.',
      },
      {
        question: 'When does an annual plan beat single-trip policies?',
        answer:
          'Price the year both ways: at typical rates, three international trips (or two including the USA) usually cross the break-even. Our comparison shows both if you run an annual and a single-trip quote.',
      },
    ],
  },
  {
    category: 'schengen',
    slug: 'schengen',
    title: 'Schengen Travel Insurance',
    shortLabel: 'Schengen',
    metaTitle: 'Schengen Travel Insurance — Visa-Compliant €30,000 Plans',
    metaDescription:
      'Schengen visa insurance that embassies accept: €30,000+ medical cover, instant certificates, all 29 Schengen countries. Compare compliant plans for US and Indian travellers.',
    hero: 'Schengen visa rules are explicit: no insurance certificate, no visa. Every plan here meets the €30,000 medical minimum and covers all 29 Schengen states for your full stay.',
    whyItMatters: [
      'Article 15 of the Schengen Visa Code makes travel medical insurance a legal precondition — consulates refuse applications without a compliant certificate.',
      'The certificate must cover the entire Schengen area for the whole stay, including medical evacuation and repatriation of remains.',
      'Real European hospital bills routinely exceed the €30,000 floor — plans here start at $50,000 for exactly that reason.',
    ],
    buyingAdvice: [
      'Buy before your visa appointment and carry the certificate — consulates want policy dates matching your itinerary.',
      'If your dates shift after visa approval, ask the insurer to re-issue the certificate rather than buying a second policy.',
      'Frequent Schengen travellers should price an annual multi-trip policy — one certificate serves every application that year.',
    ],
    faqs: [
      {
        question: 'What exactly does a Schengen-compliant policy need?',
        answer:
          'Minimum €30,000 medical expenses cover, validity across the entire Schengen area for the entire requested stay, and cover for emergency treatment, hospitalisation, evacuation and repatriation. All plans listed on this page meet these conditions.',
      },
      {
        question: 'Do visa-free travellers to Europe need insurance?',
        answer:
          'US citizens (and other visa-free nationalities) are not legally required to hold insurance for short Schengen stays, but border officers may ask about means and cover — and European treatment costs make it strongly advisable regardless.',
      },
      {
        question: 'Which countries does Schengen insurance cover?',
        answer:
          'All 29 members, including Bulgaria and Romania (full members since 2025). Non-Schengen European stops (UK, Ireland, Türkiye, the Balkans) need a policy that covers Europe-wide or worldwide, which most plans here do.',
      },
    ],
  },
  {
    category: 'student',
    slug: 'student',
    title: 'Student Travel Insurance',
    shortLabel: 'Students',
    metaTitle: 'Student Travel Insurance — Study Abroad Cover That Universities Accept',
    metaDescription:
      'Student travel insurance for study abroad: up to 2 years of cover, university waiver support, study interruption, sponsor protection. Compare plans for Indian and US students.',
    hero: 'Long-stay cover built for degrees, not holidays — up to two years per policy, benefits for study interruption, and documentation that satisfies university insurance waivers.',
    whyItMatters: [
      'US universities auto-enrol internationals into campus health plans costing $1,500–3,000/year — a compliant travel-student policy can waive that at a fraction of the price.',
      'Student plans add academic benefits standard policies lack: study interruption refunds, sponsor protection if your fee-payer passes away, and family compassionate visits.',
      'Cover runs for the full academic year including holidays and internships, not just the flight dates.',
    ],
    buyingAdvice: [
      'Get your university’s waiver requirements first — deductible caps, mental-health and maternity requirements decide which plan qualifies.',
      'Buy for the whole academic year before departure; extending from abroad is possible but pricier and paperwork-heavy.',
      'Declare sports: intramural play is usually fine, but competitive/university sport often needs a rider.',
    ],
    faqs: [
      {
        question: 'Will my university accept an outside insurance plan?',
        answer:
          'Many US, UK, Canadian and Australian universities allow waivers when an outside plan meets their published minimums. The Indian student plans we list are designed around common waiver criteria — our consultants will check your university’s specific form before you buy.',
      },
      {
        question: 'What is study interruption cover?',
        answer:
          'If a covered event (serious illness, family bereavement) forces you to abandon a semester, the benefit refunds part of the prepaid, non-refundable tuition — a benefit ordinary travel policies do not carry.',
      },
      {
        question: 'How long can a student policy run?',
        answer: 'Typically 1–2 years continuously, renewable for the course duration. Cover includes semester breaks and OPT/internship periods on most wordings.',
      },
    ],
  },
  {
    category: 'senior',
    slug: 'senior-citizen',
    title: 'Senior Citizen Travel Insurance',
    shortLabel: 'Seniors',
    metaTitle: 'Senior Citizen Travel Insurance — Cover to Age 85, Pre-Existing Options',
    metaDescription:
      'Senior citizen travel insurance for travellers 60+: acceptance to age 85, pre-existing condition provisions, US-visit medical cover. Compare senior plans from Indian and US insurers.',
    hero: 'Age should change the plan, not cancel the trip. These plans accept travellers into their 70s and 80s, with pre-existing-condition provisions tuned for the trips seniors actually take.',
    whyItMatters: [
      'Standard plans quietly cap enrolment at 70; dedicated senior plans go to 75, 85, or beyond — often without medical tests.',
      'Medical risk (and US treatment pricing) makes uninsured senior travel a five-to-six-figure gamble; a fall or cardiac event in the USA can exceed $100,000.',
      'Senior plans carry pre-existing “acute onset” cover — the benefit most parents visiting children abroad actually end up using.',
    ],
    buyingAdvice: [
      'Declare all conditions honestly — non-disclosure is the #1 reason senior claims are rejected, and declared conditions are often coverable.',
      'For US family visits, prefer $100k+ medical with acute-onset pre-existing cover; check the age at which that benefit steps down.',
      'Longer visits (90–180 days) are normal for these plans — buy the full stay upfront; extensions after a diagnosis abroad are rarely granted.',
    ],
    faqs: [
      {
        question: 'Up to what age can seniors buy travel insurance?',
        answer:
          'From our catalog: ICICI Lombard issues to 85, Bajaj Allianz’s senior plan to 75, and visitor-medical plans like IMG Patriot enrol to 89 (with reduced sums at higher ages). Above those ages, our consultants source specialist cover case-by-case.',
      },
      {
        question: 'Are pre-existing conditions covered for seniors?',
        answer:
          'Life-threatening (acute onset) episodes of declared conditions are covered up to a sub-limit on the senior and visitor plans we list. Routine management, planned treatment and known instabilities remain excluded — read the sub-limit before relying on it.',
      },
      {
        question: 'Do seniors need a medical test to buy cover?',
        answer: 'Generally no for trip-length policies — insurers use health declarations instead. Answer them precisely; they are the contract.',
      },
    ],
  },
  {
    category: 'family',
    slug: 'family',
    title: 'Family Travel Insurance',
    shortLabel: 'Family',
    metaTitle: 'Family Travel Insurance — Plans Where Kids Travel Covered Free',
    metaDescription:
      'Family travel insurance compared: plans covering children free with parents, family cancellation protection and baggage cover for the whole crew — US and India options.',
    hero: 'One policy for the whole crew — several plans here insure children 17 and under free with a parent, and price the rest of the family as a bundle.',
    whyItMatters: [
      'Allianz OneTrip Prime and Travelex Travel Select cover kids 17 and under at no extra premium — a structural saving no per-person pricing matches.',
      'Family trips concentrate risk: one child’s ear infection before departure can cancel four non-refundable tickets. Family cancellation cover refunds them all.',
      'Shared baggage and delay benefits mean one lost duffel doesn’t consume the whole family’s limit.',
    ],
    buyingAdvice: [
      'Quote both ways: “kids-free” US plans usually win for families of 3–5; Indian insurers often discount family floats instead.',
      'Insure every traveller on one policy — split policies create claim-coordination pain when one event affects everyone.',
      'Check per-person vs. per-family limits on cancellation: high-cost trips need per-person limits.',
    ],
    faqs: [
      {
        question: 'Are children really free on some plans?',
        answer:
          'Yes — on Allianz OneTrip Prime and Travelex Travel Select (US market), children 17 and under are covered at no charge when travelling with an insured parent. Indian plans price children at child rates instead.',
      },
      {
        question: 'If one family member falls ill, is everyone’s cancellation covered?',
        answer:
          'When all travellers are on the same policy, a covered event affecting one insured traveller triggers cancellation/interruption benefits for the accompanying insured family members too.',
      },
      {
        question: 'Do grandparents need a separate plan?',
        answer:
          'Travellers over the plan’s age limit (often 70) need a senior-specific policy even when the rest of the family shares one — see our senior citizen page; we can coordinate both under one enquiry.',
      },
    ],
  },
  {
    category: 'business',
    slug: 'business',
    title: 'Business Travel Insurance',
    shortLabel: 'Business',
    metaTitle: 'Business Travel Insurance — Annual & Single-Trip Corporate Cover',
    metaDescription:
      'Business travel insurance for professionals and teams: annual multi-trip cover, equipment protection, trip curtailment and 24×7 assistance. Compare US and India corporate plans.',
    hero: 'Meetings move, laptops disappear, connections misconnect. Business-tuned plans put money behind rebooking, equipment and the schedule risks leisure policies ignore.',
    whyItMatters: [
      'Frequent flyers are exactly who annual multi-trip plans were built for — one premium, every trip, consistent limits for visa letters.',
      'Business equipment (laptops, samples, presentation kit) needs the higher per-item limits standard baggage cover lacks.',
      'Missed-connection and delay benefits fund the last-minute rebooking that salvages the meeting.',
    ],
    buyingAdvice: [
      'Two or fewer trips a year: single-trip plans. Three or more: annual. Mixed personal/business travel is fine on retail annual plans.',
      'Carrying employer equipment? Check whether the employer’s property policy already covers it abroad before buying gadget riders.',
      'Teams of 10+ should ask about corporate group policies — our desk arranges employer-paid group cover with insurers directly.',
    ],
    faqs: [
      {
        question: 'Does business travel insurance cover my laptop?',
        answer:
          'Within baggage per-item limits by default (often $250–500 per item) — genuinely valuable equipment needs a gadget/electronics add-on (HDFC ERGO, World Nomads gear cover) or an employer property policy.',
      },
      {
        question: 'Can I use one policy for both business and leisure trips?',
        answer: 'Retail annual multi-trip policies cover both. Cover for manual/hazardous work is excluded — desk-based business travel is fine.',
      },
      {
        question: 'Is client-caused cancellation covered?',
        answer:
          'Standard cancellation covers listed events (illness, bereavement, disasters) — not a client moving the meeting. That commercial risk needs CFAR (Cancel For Any Reason) upgrades where available.',
      },
    ],
  },
  {
    category: 'cruise',
    slug: 'cruise',
    title: 'Cruise Travel Insurance',
    shortLabel: 'Cruise',
    metaTitle: 'Cruise Travel Insurance — Missed Port, Evacuation & Cabin Confinement Cover',
    metaDescription:
      'Cruise insurance compared: medical evacuation at sea, missed connection to embarkation, itinerary change and cabin confinement benefits for US and Indian cruisers.',
    hero: 'At sea, small problems get expensive fast — helicopter evacuations, missed embarkations, skipped ports. Cruise-fit plans put specific benefits behind each.',
    whyItMatters: [
      'Medical evacuation from a ship (helicopter + nearest adequate hospital) is the classic six-figure claim — the $500k–$1M evacuation limits on plans here exist for exactly this.',
      'Miss the ship because your flight was late and you must self-fund the catch-up to the next port — unless missed-connection cover pays it.',
      'Cruise lines’ own protection mostly refunds in future-cruise credit; real insurance refunds money and covers medical, which line waivers do not.',
    ],
    buyingAdvice: [
      'Fly in a day early AND carry missed-connection cover — the combination, not either alone, protects embarkation.',
      'Check cancellation limits against the full cruise fare including excursions and pre-paid drinks packages.',
      'For expedition itineraries (Antarctica, Arctic), verify the evacuation limit and any latitude exclusions — operators often mandate $100k+ evacuation cover.',
    ],
    faqs: [
      {
        question: 'Does regular travel insurance cover cruises?',
        answer:
          'Comprehensive plans (Allianz OneTrip Prime/Premier, Travel Guard Preferred/Deluxe, Seven Corners Choice) cover cruising including shipboard medical and evacuation. What needs checking is benefit size — evacuation at sea is costlier than on land.',
      },
      {
        question: 'What is cabin confinement benefit?',
        answer:
          'A per-day payment when the ship’s doctor confines you to your cabin for illness — compensation for lost cruise days. Found on cruise-specific upgrades of several US plans.',
      },
      {
        question: 'Am I covered at port stops and on excursions?',
        answer:
          'Yes for medical and baggage benefits, worldwide. Adventure excursions (jet ski, zip-line, diving) follow the plan’s activity list — check before you book the excursion, not after.',
      },
    ],
  },
  {
    category: 'adventure',
    slug: 'adventure-sports',
    title: 'Adventure Sports Travel Insurance',
    shortLabel: 'Adventure',
    metaTitle: 'Adventure Sports Travel Insurance — Trekking, Diving, Skiing Covered',
    metaDescription:
      'Adventure travel insurance that actually covers the activity: trekking altitude limits, scuba depths, winter sports and evacuation. Compare adventure-ready plans.',
    hero: 'The fine print decides whether your trek, dive or descent is insured. These plans cover named adventure activities — with the altitude, depth and terrain limits stated upfront.',
    whyItMatters: [
      'Standard policies exclude most adventure activities by default — the claim is denied not because you were reckless but because the activity wasn’t listed.',
      'Mountain and remote-area rescue is the expensive part: Nepal helicopter evacuations bill $5,000–20,000+, and trekking permits increasingly require evacuation cover.',
      'World Nomads covers 150–200+ activities as standard; US comprehensive plans need their adventure bundle added — same trip, very different defaults.',
    ],
    buyingAdvice: [
      'List your actual activities against the plan’s covered list before buying — “trekking” may be capped at 4,500m or 6,000m depending on plan and tier.',
      'Scuba typically requires certification (or an instructor) and respects depth limits — dive within them or the cover is void.',
      'Skiing needs winter-sports cover (World Nomads Explorer standard; add-on elsewhere); off-piste and heli-ski usually need the highest tier.',
    ],
    faqs: [
      {
        question: 'Is trekking to Everest Base Camp covered?',
        answer:
          'On plans whose altitude limit clears 5,364m — World Nomads Explorer covers trekking to 6,000m; several standard plans stop at 4,500m and would exclude EBC’s final days. Always match the route’s maximum altitude to the plan tier.',
      },
      {
        question: 'What adventure activities do standard plans exclude?',
        answer:
          'Typical exclusions: mountaineering with ropes, off-piste skiing, diving beyond 30m or uncertified, paragliding, racing of any kind, and professional/competitive sport. Named-activity adventure cover exists precisely to buy these back.',
      },
      {
        question: 'Does adventure cover include search and rescue?',
        answer:
          'Emergency evacuation benefits cover medically necessary rescue and transport. Pure search operations (locating a missing person) are covered only on some plans — expedition itineraries should verify this line item.',
      },
    ],
  },
  {
    category: 'backpacker',
    slug: 'backpacker',
    title: 'Backpacker & Long-Stay Travel Insurance',
    shortLabel: 'Backpacker',
    metaTitle: 'Backpacker Travel Insurance — Multi-Country, Long-Stay, Buy Mid-Trip',
    metaDescription:
      'Backpacker insurance for multi-country, months-long trips: buy or extend after departure, adventure activities included, gear cover options. Compare long-stay plans.',
    hero: 'Six countries, five months, one policy. Backpacker-grade plans handle multi-country routes, extend from the road, and cover the activities hostels talk you into.',
    whyItMatters: [
      'Most standard policies must be bought before departure and cover one destination “region” — backpacker plans are multi-country by design and purchasable mid-trip.',
      'Long durations change the maths: per-day rates taper on long-stay plans, where standard plans simply stop at 30–60 days.',
      'The spontaneous stuff — surf lessons, moped days, jungle treks — is exactly what backpacker plans cover as standard and others exclude.',
    ],
    buyingAdvice: [
      'Already abroad? World Nomads and Seven Corners Travel Medical Global enrol travellers who forgot to buy before flying.',
      'Carrying a laptop/camera worth real money? Standard per-item limits are low — add gear cover or accept the gap.',
      'Crossing into the USA mid-route? Ensure the plan’s region includes US/Canada or add a separate visitor-medical policy for that leg.',
    ],
    faqs: [
      {
        question: 'Can I buy travel insurance after leaving home?',
        answer:
          'Yes — World Nomads and several travel-medical plans (Seven Corners Global, IMG Patriot) enrol mid-trip, usually with a short waiting period for illness cover to prevent buy-after-symptom claims.',
      },
      {
        question: 'Does one policy cover multiple countries?',
        answer: 'Backpacker and travel-medical plans cover whole regions or worldwide — list your route once at purchase; border-hopping within the covered region needs no notification.',
      },
      {
        question: 'What about working while travelling?',
        answer:
          'Remote/laptop work is fine on all plans here. Physical work (bar work, construction, dive-mastering) is excluded or needs declared cover — check before you say yes to the job.',
      },
    ],
  },
  {
    category: 'digital_nomad',
    slug: 'digital-nomad',
    title: 'Digital Nomad Travel Insurance',
    shortLabel: 'Digital Nomad',
    metaTitle: 'Digital Nomad Insurance — Long-Stay Medical Cover That Renews Abroad',
    metaDescription:
      'Insurance for digital nomads: 6–12 month renewable travel medical plans, buy from abroad, laptop cover, telemedicine and visa-compliant certificates for nomad visas.',
    hero: 'Home is a Wi-Fi password. Nomad-fit plans renew from anywhere, cover the laptop your income depends on, and satisfy the insurance clauses in digital-nomad visa programmes.',
    whyItMatters: [
      'Domestic health insurance stops at the border (or after 30–90 days abroad) — nomads need travel-medical cover as their primary protection for months at a time.',
      'Digital-nomad visas (Spain, Portugal, Estonia, Costa Rica…) require proof of health cover for the visa term — a renewable travel-medical policy is the standard way to satisfy it.',
      'Telemedicine matters more when your GP is nine time zones away; the assistance apps on these plans include 24×7 tele-consults.',
    ],
    buyingAdvice: [
      'Choose renewable plans (IMG Patriot, Seven Corners Global run to 364 days and re-up) rather than chaining 30-day tourist policies.',
      'US citizens abroad: “worldwide excl. US” pricing is far cheaper — add US cover only for home visits.',
      'Nomad-visa applicants: get the insurer’s certificate stating cover amount, territory and dates in the format the consulate asks for.',
    ],
    faqs: [
      {
        question: 'What insurance do digital nomad visas require?',
        answer:
          'Typically health/medical cover valid in the host country for the full visa period, with minimums from €30,000 upward depending on the country. The travel-medical plans listed here issue compliant certificates; our desk matches plan to visa programme.',
      },
      {
        question: 'Travel insurance vs. international health insurance — which do I need?',
        answer:
          'Under ~12 months: renewable travel-medical (listed here) is the cost-effective answer for emergencies. Settling abroad long-term or wanting routine care, maternity and chronic management: step up to expat health insurance (IMG Global Medical and similar) — ask us for a quote.',
      },
      {
        question: 'Is my laptop covered?',
        answer: 'Base baggage per-item limits are low — add gear/electronics cover (World Nomads upgrade, HDFC gadget add-on) for equipment your income depends on.',
      },
    ],
  },
  {
    category: 'visitors_usa',
    slug: 'visitors-insurance-usa',
    title: 'Visitors Insurance for the USA',
    shortLabel: 'Visitors → USA',
    metaTitle: 'Visitors Insurance USA — Medical Cover for Parents & Guests Visiting America',
    metaDescription:
      'Visitor medical insurance for the USA: cover for parents visiting children, tourists and B1/B2 visitors. Compare IMG, Seven Corners and Indian insurer plans with US network billing.',
    hero: 'US healthcare is the most expensive on earth and visitors pay list price. Visitor-medical plans put a US hospital network and real limits between your guests and those bills.',
    whyItMatters: [
      'An uninsured ER visit averages $2,000–3,000; an appendectomy $30,000+; a cardiac admission can clear $100,000 — visitors are billed full list price.',
      'US-network plans (IMG, Seven Corners) direct-bill hospitals so families aren’t fronting five-figure sums and chasing reimbursement.',
      'Acute-onset pre-existing cover is the decisive feature for visiting parents — it covers the sudden diabetic/cardiac episodes standard exclusions would deny.',
    ],
    buyingAdvice: [
      'Buy $100k minimum for visitors under 60, $250k for parents 60+ — US costs justify the gap over the cheapest tier.',
      'Compare fixed-benefit vs. comprehensive plans: fixed plans look cheap but cap each line item (e.g. $50/doctor visit) far below US prices; every plan we list is comprehensive.',
      'Longer stays: buy the full stay upfront — these plans extend easily, but a new policy after a diagnosis excludes it as pre-existing.',
    ],
    faqs: [
      {
        question: 'Which visitor insurance is best for parents visiting the USA from India?',
        answer:
          'For parents under 70: IMG Patriot America Plus or Seven Corners Travel Medical USA with $100k–250k cover and acute-onset pre-existing benefits. Indian senior plans (ICICI Lombard Senior, Bajaj Allianz Senior) are alternatives purchasable in India in INR. Our comparison quotes both routes side by side.',
      },
      {
        question: 'Do visitor plans cover pre-existing conditions?',
        answer:
          'They cover the acute onset — a sudden, unexpected flare-up requiring emergency care — up to a sub-limit and age cap (usually 69 or 79). Routine management, medication refills and known instabilities are not covered by any visitor plan.',
      },
      {
        question: 'Can visitor insurance be bought after arriving in the USA?',
        answer: 'Yes — IMG and Seven Corners enrol post-arrival, sometimes with a short waiting period for illness benefits. Buying before departure avoids the gap.',
      },
    ],
  },
  {
    category: 'visitors_india',
    slug: 'visitors-insurance-india',
    title: 'Visitors Insurance for India',
    shortLabel: 'Visitors → India',
    metaTitle: 'Visitors Insurance for India — Medical Cover for Foreign Visitors & NRIs',
    metaDescription:
      'Travel medical insurance for visitors to India: cover for tourists, NRI family visits and business travellers, with evacuation and hospital cover at Indian private hospitals.',
    hero: 'Private healthcare in India is excellent and affordable by Western standards — but evacuation, repatriation and extended admissions still justify real cover for every visitor.',
    whyItMatters: [
      'Top private hospitals (Apollo, Fortis, Max) bill international patients at premium tariffs — an ICU week can still reach $10,000+.',
      'Medical evacuation home (US/Europe) from India is a $50,000–150,000 event — the benefit that matters most for serious cases.',
      'Standard US/EU domestic health plans cover little or nothing in India; Medicare covers nothing outside the USA.',
    ],
    buyingAdvice: [
      'Worldwide-excl-US travel medical (IMG Patriot International, Seven Corners Global) is the right shape and price band for India trips.',
      'NRIs visiting family: your US employer plan almost certainly doesn’t cover India — a per-day travel-medical plan closes the gap cheaply.',
      'Check adventure riders for Himalayan treks and motorbike touring — both are standard-exclusion territory.',
    ],
    faqs: [
      {
        question: 'Do foreign visitors need insurance for India?',
        answer:
          'It is not an entry requirement for tourist e-visas, but medical treatment, evacuation and trip disruption are real risks — and some long-stay visa categories do ask for cover. It is inexpensive for India-only trips.',
      },
      {
        question: 'Does US health insurance work in India?',
        answer:
          'Employer PPO plans rarely cover non-emergency care abroad and Medicare covers nothing outside the USA. Travel-medical plans exist precisely to fill this gap and cost a few dollars a day.',
      },
      {
        question: 'Are Indian hospitals cashless for visitor plans?',
        answer:
          'IMG and Seven Corners work through international assistance networks with direct settlement at major private hospitals; elsewhere you pay and claim reimbursement with itemised bills.',
      },
    ],
  },
  {
    category: 'domestic_india',
    slug: 'domestic-india',
    title: 'Domestic Travel Insurance (India)',
    shortLabel: 'Domestic India',
    metaTitle: 'Domestic Travel Insurance India — Flights, Trains & Holiday Cover',
    metaDescription:
      'Domestic travel insurance for trips within India: flight delay auto-payouts, accident hospitalisation, baggage and cancellation cover from a few hundred rupees.',
    hero: 'Within India, the risks are delays, cancellations and accidents — domestic covers price them from a few hundred rupees, with flight-delay payouts that arrive automatically.',
    whyItMatters: [
      'Indian domestic flight disruption is common in fog and monsoon seasons; auto-payout delay covers (Digit) compensate without claim forms.',
      'Accident hospitalisation cover travels with you even where your health policy’s network is thin.',
      'Non-refundable holiday bookings (flights + hotel + Char Dham/wedding blocks) are protected by cancellation cover for a tiny premium.',
    ],
    buyingAdvice: [
      'Skip the airline checkout checkbox and buy a real policy — per-trip domestic covers include hospitalisation and baggage, not just delay vouchers.',
      'For pilgrimage circuits with elderly travellers, prioritise accident hospitalisation and evacuation benefits over baggage.',
      'Frequent domestic flyers: a yearly domestic cover beats ticking the checkbox 20 times.',
    ],
    faqs: [
      {
        question: 'Is domestic travel insurance worth it in India?',
        answer:
          'For a ₹129–300 premium, you get lakhs in accident cover plus delay/cancellation benefits — worth it whenever the trip involves non-refundable bookings or elderly travellers.',
      },
      {
        question: 'Does it cover train travel?',
        answer: 'Yes — domestic covers apply to trips by air, rail or road; IRCTC’s ₹0.45 scheme covers rail accidents only, not delays, baggage or hospitalisation.',
      },
      {
        question: 'How do flight-delay auto-payouts work?',
        answer: 'Insurers like Digit track your flight; qualifying delays trigger an automatic payout to your account, no claim form or proof needed.',
      },
    ],
  },
  {
    category: 'medical_travel',
    slug: 'medical-travel',
    title: 'Medical Travel Insurance',
    shortLabel: 'Medical Travel',
    metaTitle: 'Medical Travel Insurance — Cover Around Planned Treatment Abroad',
    metaDescription:
      'Travelling for medical treatment? Understand what travel insurance covers around medical tourism — complications cover, companion travel, and the exclusions that matter.',
    hero: 'Standard travel insurance excludes the treatment you are travelling FOR — but the trip around it, your companion, and (via specialist covers) complications can all be protected.',
    whyItMatters: [
      'Every standard policy excludes planned/elective treatment — buying one and expecting surgery cover is the most common medical-tourism mistake.',
      'What IS insurable: the journey, companion travellers, trip disruption, lost documents, and unrelated emergencies during the trip.',
      'Specialist medical-complications insurance exists (a separate product class) for the surgery itself — our consultants arrange it case-by-case with the treating hospital.',
    ],
    buyingAdvice: [
      'Insure companions on full plans — their risks are ordinary travel risks and fully coverable.',
      'Tell the insurer travel is for treatment: non-disclosure voids even the benefits you were entitled to.',
      'Ask our desk about complications cover early — underwriters need the procedure, hospital and medical history before quoting.',
    ],
    faqs: [
      {
        question: 'Does travel insurance cover surgery abroad?',
        answer:
          'No standard policy covers planned treatment — that requires specialist medical-travel/complications insurance underwritten per procedure. Standard plans still cover unrelated emergencies, companions and the trip logistics around treatment.',
      },
      {
        question: 'What if complications arise after the procedure?',
        answer:
          'Complications of an excluded procedure are also excluded on standard plans. Specialist complications policies (arranged via our consultants) cover readmission, corrective treatment and extended stay.',
      },
      {
        question: 'Is my companion covered normally?',
        answer: 'Yes — a companion not receiving treatment buys any standard plan here and is fully covered for their own risks, including cutting the trip short if your treatment schedule changes for a covered reason.',
      },
    ],
  },
  {
    category: 'pilgrimage',
    slug: 'pilgrimage',
    title: 'Pilgrimage Travel Insurance',
    shortLabel: 'Pilgrimage',
    metaTitle: 'Pilgrimage Travel Insurance — Char Dham, Umrah, Kailash & More',
    metaDescription:
      'Insurance for pilgrimage travel: Char Dham and high-altitude yatras, Umrah and international circuits — accident, evacuation and health cover for pilgrims of all ages.',
    hero: 'Pilgrimage routes combine remote terrain, altitude and senior travellers — the exact profile where evacuation and accident cover earn their premium.',
    whyItMatters: [
      'Char Dham, Amarnath and Kailash routes reach 3,500–5,600m with limited medical facilities — helicopter evacuation is the critical benefit.',
      'Saudi Arabia mandates insurance for Umrah/Hajj pilgrims (bundled with visas); international circuits (Israel-Jordan, Vatican tours) carry ordinary travel risks needing ordinary cover.',
      'Many pilgrims are seniors — pair this page’s plans with senior-plan eligibility rather than hoping a standard plan accepts an 78-year-old.',
    ],
    buyingAdvice: [
      'High-altitude yatras: confirm the plan’s altitude limit covers the route and that evacuation includes helicopter rescue.',
      'Group organisers: one group policy with a passenger manifest beats collecting 40 individual purchases — our desk arranges group quotes.',
      'Domestic circuits: a domestic cover (Digit Domestic) handles delays, baggage and accident hospitalisation for a few hundred rupees.',
    ],
    faqs: [
      {
        question: 'Is insurance required for Umrah or Hajj?',
        answer: 'Saudi Arabia bundles mandatory basic insurance into Umrah/Hajj visas. It is minimal — comprehensive travel cover on top protects flights, baggage and non-medical risks the mandatory scheme ignores.',
      },
      {
        question: 'Are high-altitude yatras like Kedarnath covered?',
        answer:
          'Standard domestic covers handle the trip; the altitude question matters for trek-based routes — check the activity/altitude terms, and for Kailash Mansarovar (via Tibet/Nepal) use an international plan with trekking cover to 5,600m+.',
      },
      {
        question: 'Can elderly pilgrims get covered?',
        answer: 'Yes — domestic covers typically issue to 70, and senior international plans to 75–85. Group organisers should flag travellers above 70 so we quote the right plan mix.',
      },
    ],
  },
  {
    category: 'group',
    slug: 'group',
    title: 'Group Travel Insurance',
    shortLabel: 'Group',
    metaTitle: 'Group Travel Insurance — Tours, Schools, Corporate & Wedding Groups',
    metaDescription:
      'Group travel insurance for 10+ travellers: tour groups, school trips, corporate offsites and destination weddings — one policy, one certificate, group pricing.',
    hero: 'Ten or more travelling together? One group policy beats a pile of individual purchases — group rates, one certificate, one claims contact when something affects everyone.',
    whyItMatters: [
      'Group events concentrate risk: one delayed inbound flight or one outbreak affects the whole manifest — group policies handle mass claims coherently.',
      'Group pricing typically undercuts the sum of individual policies from ~10 travellers.',
      'Organisers get one certificate for visas/venues and one renewal to manage.',
    ],
    buyingAdvice: [
      'Collect the manifest early: full names, DOBs and passport numbers are needed to bind group cover.',
      'Mixed ages are fine — insurers rate each traveller’s band but issue one policy; seniors above the cap get a paired senior policy.',
      'Corporate organisers: employer-paid group travel cover can be annual — one policy for every offsite and business trip that year.',
    ],
    faqs: [
      {
        question: 'How many people make a “group”?',
        answer: 'Usually 10+ travelling on the same itinerary. Smaller parties simply buy on one multi-traveller policy — our comparison quotes up to 9 travellers directly.',
      },
      {
        question: 'Can group members have different cover levels?',
        answer: 'Group policies apply one benefit schedule to everyone; travellers wanting higher limits top up individually. We structure the split so nobody is double-insured.',
      },
      {
        question: 'How do group claims work?',
        answer: 'One claims contact (the organiser or our desk) coordinates documentation for all affected members — significantly less painful than 30 parallel individual claims.',
      },
    ],
  },
];

const bySlug = new Map(CATEGORY_PAGES.map((c) => [c.slug, c]));
const byCategory = new Map(CATEGORY_PAGES.map((c) => [c.category, c]));

export function categoryPageBySlug(slug: string): CategoryPage | undefined {
  return bySlug.get(slug.toLowerCase());
}

export function categoryPage(category: PlanCategory): CategoryPage | undefined {
  return byCategory.get(category);
}
