/** Educational content hub — /insurance/guides/[slug]. Written once, rendered
 * statically with Article + FAQ JSON-LD. Internal links use plain paths. */

export interface InsuranceGuide {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  sections: { heading: string; paragraphs: string[] }[];
  faqs: { question: string; answer: string }[];
  related: { label: string; href: string }[];
}

export const INSURANCE_GUIDES: InsuranceGuide[] = [
  {
    slug: 'why-travel-insurance-matters',
    title: 'Why Travel Insurance Matters: What It Actually Pays For',
    metaTitle: 'Why Travel Insurance Matters — Real Costs, Real Claims',
    metaDescription:
      'What travel insurance actually pays for: medical emergencies abroad, cancellations, delays and baggage — with the real numbers that make the premium rational.',
    intro:
      'Travel insurance is one of the few purchases priced in single dollars that protects against five- and six-figure losses. This guide walks through what the main benefits actually do, with the real-world costs behind each.',
    sections: [
      {
        heading: 'The medical math',
        paragraphs: [
          'The core of every travel policy is emergency medical cover. Outside your home country, your domestic health insurance mostly stops working: US employer plans cover little abroad, Medicare covers nothing outside the USA, and Indian health policies are domestic by definition. Abroad, you pay list price — and in the USA that means roughly $2,000–3,000 for an ER visit and $11,000+ per hospital day.',
          'Medical evacuation is the quiet giant. Air ambulances bill $25,000–200,000 depending on distance and equipment. It is the single benefit where the difference between a $50,000 limit and a $500,000 limit genuinely matters, especially for cruises, islands and mountain regions.',
        ],
      },
      {
        heading: 'Cancellation: protecting money you already spent',
        paragraphs: [
          'Trip cancellation refunds prepaid, non-refundable costs when a listed event — illness, injury, a death in the family, natural disaster — stops the trip before it starts. Trip interruption does the same after departure and typically adds the cost of getting home early.',
          'The key discipline is insuring the real number: add flights, hotels, tours and cruise fares, and update the figure if you add bookings. Under-insured trips can see proportionally reduced payouts on some wordings.',
        ],
      },
      {
        heading: 'The everyday benefits you will statistically use',
        paragraphs: [
          'Medical claims are rare; delay and baggage claims are common. Delay benefits pay for meals and a hotel when you are stranded past a waiting period; baggage delay funds emergency clothes; baggage loss pays out when the bag never appears. These are small-dollar benefits, but they are the ones most travellers actually experience.',
          'Modern plans add practical services that never show on a benefits table: 24×7 assistance lines that find English-speaking doctors, telemedicine consults, and help replacing lost passports.',
        ],
      },
      {
        heading: 'What insurance does not do',
        paragraphs: [
          'Travel insurance covers listed, unforeseen events. It does not refund a trip you cancel because you changed your mind (that needs a Cancel For Any Reason upgrade), does not cover known events (a storm already named when you bought), and excludes planned medical treatment, most adventure sports without riders, and losses you can recover elsewhere first.',
          'Reading the exclusions once before buying prevents most claim disappointments. Our plan pages list them plainly for every plan we compare.',
        ],
      },
    ],
    faqs: [
      { question: 'Is travel insurance worth it for a cheap trip?', answer: 'The medical and evacuation risk is independent of trip price — a $300 flight to a country with expensive healthcare still carries the six-figure tail risk. For cheap domestic trips with refundable bookings, the case is genuinely weaker.' },
      { question: 'What percentage of the trip cost should insurance be?', answer: 'US comprehensive plans typically run 4–8% of the insured trip cost, rising with age. Duration-priced plans (India-market, travel medical) commonly work out to $1–4 per travel day for younger travellers.' },
      { question: 'Does my credit card already cover this?', answer: 'Premium cards carry real but partial benefits — usually rental car damage and some delay/baggage cover, rarely meaningful medical or evacuation limits. Treat card cover as a supplement, not a substitute; check its medical limit before relying on it.' },
    ],
    related: [
      { label: 'Compare travel insurance plans', href: '/insurance' },
      { label: 'What travel insurance does not cover', href: '/insurance/guides/what-is-not-covered' },
      { label: 'How travel insurance claims work', href: '/insurance/guides/how-claims-work' },
    ],
  },
  {
    slug: 'schengen-travel-insurance-guide',
    title: 'Schengen Travel Insurance: The Complete Visa Compliance Guide',
    metaTitle: 'Schengen Travel Insurance Guide — €30,000 Rule Explained',
    metaDescription:
      'Everything about Schengen visa insurance: the €30,000 requirement, what consulates check, certificate format, all 29 countries, and how to choose a compliant plan.',
    intro:
      'Schengen visa applications are refused daily for defective insurance certificates. The rule itself is simple; this guide covers exactly what consulates check and how to satisfy it the first time.',
    sections: [
      {
        heading: 'The legal requirement',
        paragraphs: [
          'The Schengen Visa Code (Article 15) requires every visa applicant to hold travel medical insurance with at least €30,000 of cover, valid in all Schengen states for the entire requested stay, including emergency treatment, hospitalisation and repatriation (medical and of remains).',
          'Since 2025 the area counts 29 members — Bulgaria and Romania joined fully — so an older certificate listing 26 or 27 states is still fine as long as it says "Schengen area", which compliant certificates do.',
        ],
      },
      {
        heading: 'What the consulate actually checks',
        paragraphs: [
          'Officers verify four things: the €30,000 (or higher) medical limit stated explicitly; policy dates that cover every day of the itinerary; territorial validity naming the Schengen area; and the applicant’s name matching the passport. Certificates from recognised insurers pass without discussion; screenshots of app dashboards do not.',
          'Multiple-entry visa applicants sign a declaration to hold insurance for later trips too — an annual multi-trip policy is the clean way to honour it.',
        ],
      },
      {
        heading: 'Choosing a compliant plan',
        paragraphs: [
          'Any plan on our Schengen page meets the floor with margin — most carry $50,000+ medical, which converts safely above €30,000 and reflects what European hospital stays actually cost.',
          'Indian applicants: insurers issue the consulate-format certificate instantly on purchase (Tata AIG, ICICI Lombard, HDFC ERGO, Care, Reliance all do). US and visa-free travellers are not legally required to hold cover for short stays but face the same hospital bills.',
        ],
      },
      {
        heading: 'If your plans change',
        paragraphs: [
          'Dates moved after visa issuance? Have the insurer re-issue the certificate for the new dates rather than buying a fresh policy — free with most insurers before the start date.',
          'Trip cancelled entirely? Schengen policies bought for a visa are refundable with proof of visa refusal with most Indian insurers — one of the few full-refund situations in travel insurance.',
        ],
      },
    ],
    faqs: [
      { question: 'Which countries require Schengen insurance?', answer: 'All 29 Schengen members require it for visa-required nationalities: Austria, Belgium, Bulgaria, Croatia, Czechia, Denmark, Estonia, Finland, France, Germany, Greece, Hungary, Iceland, Italy, Latvia, Liechtenstein, Lithuania, Luxembourg, Malta, Netherlands, Norway, Poland, Portugal, Romania, Slovakia, Slovenia, Spain, Sweden and Switzerland.' },
      { question: 'Is €30,000 enough cover for Europe?', answer: 'It is the legal minimum, not a recommendation — surgeries with complications and extended ICU stays exceed it. Plans with $50,000–100,000 cost only marginally more and are what we list by default.' },
      { question: 'Does the UK count as Schengen?', answer: 'No — the UK and Ireland are outside Schengen. A Europe-region or worldwide policy covers both; a strictly-Schengen certificate may not.' },
    ],
    related: [
      { label: 'Schengen-compliant plans', href: '/insurance/type/schengen' },
      { label: 'Check Schengen visa requirements', href: '/visas' },
      { label: 'Annual multi-trip insurance', href: '/insurance/type/annual-multi-trip' },
    ],
  },
  {
    slug: 'best-usa-travel-insurance',
    title: 'Best Travel Insurance for USA Trips: Why Limits Matter More Than Price',
    metaTitle: 'Best USA Travel Insurance — Medical Limits That Match US Costs',
    metaDescription:
      'Choosing travel insurance for a USA trip: why $250,000 medical cover is the sensible floor, visitor plans vs. Indian insurer plans, and network billing explained.',
    intro:
      'The USA is the one destination where the cheapest adequate policy is genuinely expensive — because American medicine is. This guide sets the coverage floor, then compares the two ways to buy it.',
    sections: [
      {
        heading: 'Why the USA is different',
        paragraphs: [
          'American hospitals bill uninsured foreigners at list price: roughly $2,500 for an ER visit, $11,000+ per inpatient day, $30,000+ for an appendectomy, and six figures for cardiac events or trauma. No other destination turns a routine mishap into bankruptcy-scale numbers this reliably.',
          'That is why our recommendation engine treats $250,000 medical as the recommended level for US trips, and why $50,000 plans that are generous for Asia look thin in New York.',
        ],
      },
      {
        heading: 'Two ways to insure a US trip from India',
        paragraphs: [
          'Route one: Indian insurer plans (Tata AIG Travel Guard Gold/Platinum, ICICI Lombard Gold and similar) — bought in INR, US-ready sums up to $500,000, and familiar claim support at home. Best for tourists and family visits up to 180 days.',
          'Route two: US visitor-medical plans (IMG Patriot America Plus, Seven Corners Travel Medical USA) — bought in USD from anywhere, with the decisive advantage of US PPO network direct billing: the hospital bills the insurer, not your family. Best for parents visiting children and long stays.',
        ],
      },
      {
        heading: 'What US-bound travellers should check',
        paragraphs: [
          'Acute-onset pre-existing cover matters most for travellers over 50 — it is what pays when a known condition flares suddenly. Check the sub-limit and the age at which it steps down (often 70).',
          'Deductible choices change premiums meaningfully on visitor plans: a $250 deductible cuts premiums sharply versus $0 while keeping catastrophic protection identical. For US residents insuring their own trips, comprehensive plans (Allianz, Travel Guard, Seven Corners, Travelex) bundle cancellation with medical — see our single-trip page.',
        ],
      },
    ],
    faqs: [
      { question: 'How much medical cover do I need for the USA?', answer: '$100,000 is a reasonable minimum for young, healthy visitors; $250,000 is the sensible standard; parents 60+ visiting for months justify $250,000–500,000. The premium difference between tiers is small relative to the protection gap.' },
      { question: 'Is travel insurance mandatory for a US visa?', answer: 'No — B1/B2 and ESTA entry do not require insurance. It is optional and, given US medical pricing, more valuable than anywhere it is mandatory.' },
      { question: 'What is network direct billing?', answer: 'US visitor plans from IMG and Seven Corners plug into PPO hospital networks: show your insurance ID, the hospital bills the insurer directly, and you pay only your deductible instead of fronting thousands and claiming back.' },
    ],
    related: [
      { label: 'Visitors insurance for the USA', href: '/insurance/type/visitors-insurance-usa' },
      { label: 'Senior citizen plans', href: '/insurance/type/senior-citizen' },
      { label: 'US visa requirements checker', href: '/visas' },
    ],
  },
  {
    slug: 'best-india-travel-insurance',
    title: 'Best Travel Insurance for India Trips: Visitors, NRIs and Domestic Travellers',
    metaTitle: 'Best India Travel Insurance — Visitors, NRI & Domestic Cover',
    metaDescription:
      'Travel insurance for India trips: what foreign visitors and NRIs should buy, why evacuation cover matters, and domestic options for travel within India.',
    intro:
      'India trips span three very different insurance situations: foreigners visiting India, NRIs coming home, and residents travelling domestically. Each has a right-shaped product — this guide sorts them.',
    sections: [
      {
        heading: 'Foreign visitors and NRIs visiting India',
        paragraphs: [
          'Private Indian healthcare is world-class and, by Western standards, inexpensive — but not free: international-patient tariffs at Apollo/Fortis/Max-class hospitals can reach $1,000+ per day for ICU care. The bigger line item is evacuation home, a $50,000–150,000 event for serious cases.',
          'The right product is worldwide-excl-US travel medical (IMG Patriot International, Seven Corners Travel Medical Global): $100,000 cover for a few dollars a day, purchasable from any country. NRIs should assume US employer health plans and Medicare cover nothing in India.',
        ],
      },
      {
        heading: 'Trips within India',
        paragraphs: [
          'Domestic covers (Digit Domestic and peers) price from a few hundred rupees per trip and bundle accident hospitalisation, flight-delay auto-payouts, baggage and cancellation — a different product class from the ₹45–₹500 checkbox covers airlines upsell, which are typically delay-voucher schemes.',
          'For pilgrimage circuits and elderly travellers, prioritise the accident hospitalisation and evacuation lines; for metro weekend trips, the delay payouts are what you will actually use.',
        ],
      },
      {
        heading: 'Adventure and the Himalayas',
        paragraphs: [
          'Trekking above 4,500m, motorbiking Ladakh, and river sports sit in standard exclusions. Use plans with adventure riders (HDFC ERGO add-on, World Nomads for foreigners) and confirm altitude limits cover the route — helicopter rescue from the Indian Himalaya bills in lakhs.',
        ],
      },
    ],
    faqs: [
      { question: 'Do tourists need insurance to enter India?', answer: 'Not for standard e-tourist visas. Some long-stay categories ask for it, and it is inexpensive and advisable for everyone given evacuation costs.' },
      { question: 'What should NRIs visiting family buy?', answer: 'A worldwide-excl-US travel medical plan for the India stay — US health plans rarely cover India, and these plans cost a few dollars a day at younger ages.' },
      { question: 'Is IRCTC travel insurance enough for train trips?', answer: 'The ₹0.45 IRCTC scheme covers rail accidents only. A proper domestic policy adds hospitalisation anywhere, delays, baggage and cancellation for a few hundred rupees.' },
    ],
    related: [
      { label: 'Visitors insurance for India', href: '/insurance/type/visitors-insurance-india' },
      { label: 'Domestic India cover', href: '/insurance/type/domestic-india' },
      { label: 'India visa requirements', href: '/visas/destination/india' },
    ],
  },
  {
    slug: 'cruise-insurance-explained',
    title: 'Cruise Travel Insurance Explained: Evacuation, Missed Ports and the Fine Print',
    metaTitle: 'Cruise Insurance Explained — What Cruisers Actually Need',
    metaDescription:
      'Cruise travel insurance explained: medical evacuation at sea, missed embarkation, itinerary changes, cabin confinement and why cruise-line waivers are not insurance.',
    intro:
      'Cruises concentrate three risks land trips spread out: you are far from hospitals, locked to a schedule, and prepaid in full. Cruise-fit insurance answers each — this guide shows where to look in the wording.',
    sections: [
      {
        heading: 'The evacuation problem',
        paragraphs: [
          'Ship infirmaries stabilise; they do not treat. Serious cases are evacuated by helicopter or at the next port and billed accordingly — sea evacuations run $50,000–250,000. This is why cruise-suitable plans carry $500,000–$1,000,000 evacuation limits, and why that line matters more than the medical limit itself for cruisers.',
        ],
      },
      {
        heading: 'Schedule risks: embarkation and ports',
        paragraphs: [
          'Miss the ship at embarkation (late inbound flight) and you must catch it at the next port at your own cost — unless missed-connection cover pays. Fly in a day early and carry the benefit; the combination is cheap insurance against the classic cruise disaster.',
          'Itinerary change and missed-port benefits compensate when weather skips your must-see stop; cabin-confinement benefits pay per day if the ship’s doctor isolates you. These appear on cruise upgrades of US comprehensive plans — worth the small premium on port-intensive itineraries.',
        ],
      },
      {
        heading: 'Cruise line “protection” vs. insurance',
        paragraphs: [
          'Line-sold protection plans mostly refund in future cruise credit, cover little medical, and evaporate if the line itself fails. Real travel insurance refunds cash, covers medical and evacuation at sea, and is portable across whatever you book. Book the cruise anywhere; insure it independently.',
        ],
      },
    ],
    faqs: [
      { question: 'Do I need special cruise insurance?', answer: 'You need a comprehensive plan with high evacuation limits and ideally missed-connection cover — Allianz OneTrip Prime/Premier, Travel Guard Preferred/Deluxe and Seven Corners Choice all qualify. “Cruise” upgrades add port/confinement benefits.' },
      { question: 'Are shore excursions covered?', answer: 'Medical and baggage benefits apply ashore worldwide. Adventure excursions follow the plan’s activity list — check before booking that zip-line.' },
      { question: 'What about river cruises?', answer: 'Same logic, lower evacuation exposure — you are never far from land hospitals in Europe. Standard comprehensive limits are comfortably adequate.' },
    ],
    related: [
      { label: 'Cruise-ready plans', href: '/insurance/type/cruise' },
      { label: 'Browse cruises', href: '/cruises' },
      { label: 'How claims work', href: '/insurance/guides/how-claims-work' },
    ],
  },
  {
    slug: 'covid-coverage-explained',
    title: 'COVID-19 Travel Insurance Coverage in 2026: What Is Still Covered',
    metaTitle: 'COVID Travel Insurance Coverage 2026 — Current State Explained',
    metaDescription:
      'How travel insurance treats COVID-19 now: medical cover as any illness, cancellation rules, quarantine benefits, and what pandemic exclusions still exist.',
    intro:
      'COVID coverage stabilised after 2022: mainstream insurers now treat COVID-19 like any other illness, and the exotic “COVID plans” era is over. Here is the current state of play and the corners where it still gets nuanced.',
    sections: [
      {
        heading: 'Medical treatment: covered as any illness',
        paragraphs: [
          'Every plan in our catalog treats COVID medical expenses like any other sickness: hospitalisation, treatment and evacuation apply normally. Allianz formalises this via its Epidemic Coverage Endorsement; Indian insurers simply state COVID medical expenses are covered.',
        ],
      },
      {
        heading: 'Cancellation: you sick = covered; world closed = not',
        paragraphs: [
          'Testing positive before departure is a covered cancellation reason (you are ill). Fear of travel, destination case counts, or a new variant closing borders are NOT covered reasons on standard plans — those are exactly the scenarios Cancel For Any Reason upgrades exist for.',
          'Quarantine benefits — extra hotel nights when you test positive abroad and cannot fly home — survive on several plans as delay/quarantine allowances. Check the daily amount and cap.',
        ],
      },
      {
        heading: 'What to verify before relying on it',
        paragraphs: [
          'Confirm three lines in any plan you buy elsewhere: COVID medical treated as illness (not excluded as pandemic), quarantine accommodation allowance if that risk matters to you, and no destination-advisory exclusion that voids cover when official travel warnings exist.',
        ],
      },
    ],
    faqs: [
      { question: 'Is COVID still covered by travel insurance?', answer: 'Yes — mainstream plans cover COVID medical expenses as ordinary illness, and pre-departure positive tests as ordinary cancellation. Pandemic-specific exclusions have largely disappeared from retail plans.' },
      { question: 'What if I test positive abroad and must quarantine?', answer: 'Plans with quarantine/delay allowances pay a daily amount toward extra accommodation and rebooking. Verify the daily cap — typical allowances run $150–250 per day for up to 7–14 days.' },
      { question: 'Will insurance refund my trip if borders close again?', answer: 'No — government actions and travel advisories are standard exclusions. Only CFAR (Cancel For Any Reason) upgrades, refunding 50–75%, address that scenario.' },
    ],
    related: [
      { label: 'Compare plans', href: '/insurance' },
      { label: 'What is not covered', href: '/insurance/guides/what-is-not-covered' },
      { label: 'CFAR explained in our FAQ', href: '/faq' },
    ],
  },
  {
    slug: 'how-claims-work',
    title: 'How Travel Insurance Claims Work: A Step-by-Step Playbook',
    metaTitle: 'How Travel Insurance Claims Work — Step-by-Step Guide',
    metaDescription:
      'How to file a travel insurance claim that gets paid: emergency procedures, cashless hospitalisation, documentation checklists per claim type, timelines and appeals.',
    intro:
      'Most rejected claims fail on process, not coverage: late notification, missing paper, unauthorised admissions. This playbook is the process, claim type by claim type.',
    sections: [
      {
        heading: 'Rule zero: call the assistance line first',
        paragraphs: [
          'For anything medical, call the 24×7 assistance number on your policy before or at admission. They direct you to network hospitals (enabling cashless treatment where available), authorise procedures, and open the case file the claim will live in. Unauthorised non-emergency admissions are the most avoidable benefit reduction in the industry.',
          'Genuine emergencies: get treated first, have someone call within 24–48 hours. No insurer penalises life-threatening urgency — they penalise silence.',
        ],
      },
      {
        heading: 'The paper each claim type needs',
        paragraphs: [
          'Medical: itemised bills, discharge summary, prescriptions, and the treating doctor’s report. Cancellation: proof of the triggering event (medical certificate, death certificate) plus booking invoices and the supplier’s refund/no-refund confirmation. Baggage: airline Property Irregularity Report (file it before leaving the airport), tags, and receipts for valuables. Delay: airline delay confirmation and receipts for meals/hotel.',
          'Photograph everything as you go — the habit of shooting every receipt and report into a phone folder is what separates two-week settlements from three-month correspondence chains.',
        ],
      },
      {
        heading: 'Timelines, payment and appeals',
        paragraphs: [
          'Notify within the policy window (commonly 30 days of the event or return). Document-complete claims settle in 5–15 business days with US insurers and 7–30 days with Indian insurers; incomplete files sit in request-more-information loops indefinitely.',
          'Rejected? Ask for the specific policy clause in writing, then appeal with targeted evidence. India: escalate to the insurer’s grievance cell, then the Insurance Ombudsman (free, binding on the insurer for amounts up to ₹50 lakh). US: your state insurance commissioner takes complaints that concentrate insurer minds. Our consultants help clients assemble claim files at no charge — it is part of the service.',
        ],
      },
    ],
    faqs: [
      { question: 'How long do travel insurance claims take?', answer: 'Document-complete: 5–15 business days (US insurers), 7–30 days (Indian insurers). The variable is your file completeness, not insurer mood.' },
      { question: 'What is cashless hospitalisation?', answer: 'The assistance company settles the hospital directly so you never front the bill — available at network hospitals when the admission is routed through the assistance line. Outside networks, you pay and claim reimbursement.' },
      { question: 'Can I claim without receipts?', answer: 'Small fixed benefits (delay allowances on some plans) pay without receipts; everything else is reimbursement against documents. No paper, no payout — keep everything.' },
    ],
    related: [
      { label: 'What is not covered', href: '/insurance/guides/what-is-not-covered' },
      { label: 'Compare plans with clear claim processes', href: '/insurance' },
      { label: 'Contact our claims-help desk', href: '/contact' },
    ],
  },
  {
    slug: 'what-is-not-covered',
    title: 'What Travel Insurance Does NOT Cover: The Exclusions That Deny Claims',
    metaTitle: 'Travel Insurance Exclusions — What Is Not Covered',
    metaDescription:
      'The exclusions behind most denied travel insurance claims: pre-existing conditions, alcohol, adventure activities, unattended baggage, known events and more — explained plainly.',
    intro:
      'Every denied-claim horror story traces to an exclusion the buyer never read. Here are the ones that actually deny claims, in plain language, with the workaround for each where one exists.',
    sections: [
      {
        heading: 'The big five',
        paragraphs: [
          'Pre-existing conditions: anything diagnosed, treated or symptomatic in the look-back period (60 days–3 years by plan) is excluded — unless you buy within the waiver window (US plans) or use plans with acute-onset cover (visitor/senior plans). Alcohol and drugs: injuries while intoxicated are excluded industry-wide. Adventure activities: excluded unless listed — buy the rider. Known events: storms already named, strikes already announced, wars already started are uninsurable once public. Unattended belongings: the beach-bag theft is excluded; theft from a locked room or safe is covered.',
        ],
      },
      {
        heading: 'The subtle ones',
        paragraphs: [
          'Travelling against medical advice, or to obtain treatment (medical tourism needs specialist cover — see our medical travel page). Pregnancy: routine childbirth is excluded; complications before a cutoff week (usually 24–32) are covered — check the week. Mental health: coverage varies enormously; several US plans now cover it as any illness, many others exclude it. Business equipment beyond per-item limits. Missed flights from your own lateness — delay benefits need a covered cause.',
          'And the meta-exclusion: misrepresentation. Wrong age, undeclared conditions, or fudged trip dates void the whole policy, not just the related claim.',
        ],
      },
      {
        heading: 'How to make exclusions irrelevant',
        paragraphs: [
          'Three habits neutralise most exclusion risk: buy early (unlocks waivers), declare honestly (converts exclusions into priced cover), and match riders to your actual plans (adventure, gadgets, CFAR). The premium difference is small; the claims difference is total.',
        ],
      },
    ],
    faqs: [
      { question: 'Why do travel insurance claims get denied?', answer: 'Leading causes: pre-existing condition look-backs, missing documentation, late notification, alcohol involvement, and activities outside the covered list. Process failures and exclusions — rarely insurer whim.' },
      { question: 'What is a pre-existing condition look-back?', answer: 'The window before purchase (60 days to 3 years by plan) the insurer examines: conditions diagnosed, treated, or symptomatic in it are excluded unless waived. US plans waive it entirely when you buy within 14–21 days of your first trip payment.' },
      { question: 'Is theft always covered?', answer: 'Theft of attended or locked-away belongings, yes (within limits). Items left unattended in public, cash beyond small limits, and undeclared valuables are the standard carve-outs.' },
    ],
    related: [
      { label: 'How claims work', href: '/insurance/guides/how-claims-work' },
      { label: 'Adventure sports cover', href: '/insurance/type/adventure-sports' },
      { label: 'Compare plans and exclusions', href: '/insurance' },
    ],
  },
  {
    slug: 'student-travel-insurance-guide',
    title: 'Student Travel Insurance: Beating the University Plan on Price and Coverage',
    metaTitle: 'Student Travel Insurance Guide — University Waivers Explained',
    metaDescription:
      'Student travel insurance for study abroad: how university insurance waivers work, what Indian student plans cover, and when campus plans are actually better.',
    intro:
      'International students face a $1,500–3,000 annual bill for university health plans — often waivable with outside cover at a third of the price. This guide explains the waiver game and what student-specific policies add.',
    sections: [
      {
        heading: 'How university waivers work',
        paragraphs: [
          'US universities auto-enrol international students in campus health plans but publish waiver criteria: minimum sums, maximum deductibles, coverage for mental health, sports, and repatriation. An outside policy meeting every criterion can be substituted during the waiver window each semester.',
          'Indian student plans (Tata AIG Student Guard, Care Explore Student) are engineered around common waiver matrices — but criteria vary by university, so check the actual form before buying. Our consultants do this check free.',
        ],
      },
      {
        heading: 'What student plans add over regular cover',
        paragraphs: [
          'Study interruption: refunds part of prepaid tuition when serious illness or family bereavement forces a semester abandonment. Sponsor protection: continues funding if the fee-paying parent dies or is disabled. Compassionate visits: flies a family member to your bedside for extended hospitalisation. Bail bond and legal cover rounds out the set. Ordinary policies carry none of these.',
          'Duration is the other difference: student plans run up to two years continuously, covering breaks and internships, where standard plans stop at 180 days.',
        ],
      },
      {
        heading: 'When the campus plan wins',
        paragraphs: [
          'Campus plans include routine and preventive care, mental-health networks, and on-campus clinic access that travel-based student plans price out or exclude. Students with chronic conditions needing regular management are often better served on campus plans despite the price. The waiver decision is coverage-shape versus cost, not cost alone.',
        ],
      },
    ],
    faqs: [
      { question: 'Can I waive my US university insurance with an Indian plan?', answer: 'Frequently yes — if the plan meets every published waiver criterion. Tata AIG and Care student plans are designed for this. Check your university’s specific matrix; a single failed criterion (often mental-health cover) sinks the waiver.' },
      { question: 'How long can student policies run?', answer: 'Up to 2 years continuously, renewable through the course — including semester breaks, internships and OPT periods on most wordings.' },
      { question: 'Are student plans only for degree students?', answer: 'Exchange semesters, language programmes and vocational courses qualify with most insurers — the test is enrolment at a recognised institution, not degree length.' },
    ],
    related: [
      { label: 'Student plans compared', href: '/insurance/type/student' },
      { label: 'Student visa requirements', href: '/visas' },
      { label: 'Visitors insurance for parents attending graduation', href: '/insurance/type/visitors-insurance-usa' },
    ],
  },
  {
    slug: 'senior-citizen-travel-insurance-guide',
    title: 'Senior Citizen Travel Insurance: Getting Covered at 65, 75 and Beyond',
    metaTitle: 'Senior Travel Insurance Guide — Cover at 65, 75, 85',
    metaDescription:
      'Travel insurance for seniors: age limits by insurer, pre-existing condition rules, US-visit strategies for parents, and how premiums scale with age.',
    intro:
      'Insurance gets harder exactly when travel gets riskier. But “harder” is not “impossible” — the market covers travellers to 85+ if you know which doors to knock on. This guide maps them.',
    sections: [
      {
        heading: 'The age ladder',
        paragraphs: [
          'To 70: most standard plans issue normally, with premiums roughly 2–3× the young-adult rate. 71–75: dedicated senior plans (Bajaj Allianz Travel Prime Senior) and the standard plans that stretch (ICICI Lombard to 85). 76–85: ICICI Lombard Senior and visitor-medical plans (IMG/Seven Corners enrol to 89, with reduced sums at the top ages). Beyond 85: specialist case-by-case placement — our desk handles these manually.',
        ],
      },
      {
        heading: 'Pre-existing conditions: the real decision point',
        paragraphs: [
          'Seniors rarely have clean health declarations, so the acute-onset benefit is the load-bearing feature: it covers sudden, unexpected episodes of declared conditions (the cardiac event, the diabetic emergency) up to a sub-limit. Compare that sub-limit — not just the headline medical figure — across plans.',
          'Declare everything. A declared condition is priced and partially covered; an undeclared one voids the policy. This is the single most consequential form-filling seniors do all year.',
        ],
      },
      {
        heading: 'The parents-visiting-USA playbook',
        paragraphs: [
          'For 60–75-year-old parents visiting children in America: compare an Indian senior plan (INR pricing, home claims support) against a US visitor-medical plan (network direct billing, higher available sums, acute-onset to 69–79). Under 70 with long stays, the visitor plans usually win on network access; over 80, ICICI Lombard is frequently the only standard issuer left.',
          'Either way: buy the entire stay upfront, since post-arrival extensions after any medical event are declined; and size cover at $100k+ given US pricing.',
        ],
      },
    ],
    faqs: [
      { question: 'Can an 80-year-old get travel insurance?', answer: 'Yes — ICICI Lombard issues to 85 and IMG/Seven Corners visitor plans enrol to 89 with reduced sums. Premiums are significant; coverage is real. Above 85, specialist placement is required.' },
      { question: 'Why are senior premiums so high?', answer: 'Claims frequency and severity both rise steeply with age — a 75-year-old’s expected medical claim cost is several times a 35-year-old’s. Premium ratios of 3–5× reflect actuarial reality, not gouging.' },
      { question: 'Do seniors need medical tests to buy?', answer: 'For trip-length policies, generally no — health declarations substitute. Answer them precisely: they are contractual.' },
    ],
    related: [
      { label: 'Senior plans compared', href: '/insurance/type/senior-citizen' },
      { label: 'Visitors insurance for the USA', href: '/insurance/type/visitors-insurance-usa' },
      { label: 'How claims work', href: '/insurance/guides/how-claims-work' },
    ],
  },
  {
    slug: 'adventure-sports-coverage-guide',
    title: 'Adventure Sports Travel Insurance: Covering the Activities That Void Standard Plans',
    metaTitle: 'Adventure Sports Insurance Guide — Activity Lists, Altitudes, Depths',
    metaDescription:
      'Adventure travel insurance decoded: how activity lists work, altitude and depth limits, winter sports, and matching plans to treks, dives and rides.',
    intro:
      'Adventure claims are denied for a boring reason: the activity was not on the covered list. The fix is equally boring — match the list to your itinerary before buying. Here is how the lists work.',
    sections: [
      {
        heading: 'How activity lists work',
        paragraphs: [
          'Insurers tier activities by risk: tier one (hiking, snorkelling, city cycling) is covered by default nearly everywhere; tier two (trekking to stated altitudes, scuba to stated depths, kayaking, skiing on-piste) needs an adventure plan or rider; tier three (mountaineering with ropes, off-piste, paragliding, racing) needs the highest tiers or specialist policies; and tier four (BASE, solo unroped climbing) is uninsurable retail.',
          'World Nomads builds its brand on this: 150+ activities standard, 200+ on Explorer. US comprehensive plans invert the model — cheap base, adventure bundle added on demand (Travel Guard, Travelex, Seven Corners).',
        ],
      },
      {
        heading: 'The numbers that matter: altitude and depth',
        paragraphs: [
          'Trekking cover carries altitude ceilings — commonly 4,500m or 6,000m. Everest Base Camp (5,364m) sits between them, which is exactly why plan tier matters. Scuba carries depth limits (18–40m) and certification requirements: dive within card and limit, or the cover is void.',
          'Winter sports add their own conditions: on-piste standard, off-piste with guide on some plans, heli-ski rarely. Equipment and piste-closure benefits ride along on dedicated winter cover.',
        ],
      },
      {
        heading: 'Rescue economics',
        paragraphs: [
          'The benefit doing the heavy lifting is evacuation: Nepal helicopter rescues bill $5,000–20,000+, and Himalayan trekking permits increasingly require proof of evacuation cover. Verify the evacuation limit applies to your activity (some plans cover the activity’s medical costs but cap rescue) and whether search — locating you, not just transporting you — is included for remote routes.',
        ],
      },
    ],
    faqs: [
      { question: 'Does travel insurance cover scuba diving?', answer: 'Within depth and certification limits on adventure-inclusive plans (World Nomads standard; add-on bundles elsewhere). Uncertified diving without an instructor, or beyond the stated depth, is excluded everywhere.' },
      { question: 'Which plan covers Everest Base Camp?', answer: 'Plans with trekking cover to 6,000m — World Nomads Explorer is the retail standard. Plans capped at 4,500m exclude the trek’s upper days. Kilimanjaro (5,895m) has the same answer.' },
      { question: 'Is motorbiking abroad covered?', answer: 'Typically only when licensed for the bike at home, helmeted, and under engine-size caps (often 125–250cc). Unlicensed scooter rental accidents are among the most-denied claims in Southeast Asia.' },
    ],
    related: [
      { label: 'Adventure-ready plans', href: '/insurance/type/adventure-sports' },
      { label: 'Backpacker insurance', href: '/insurance/type/backpacker' },
      { label: 'What is not covered', href: '/insurance/guides/what-is-not-covered' },
    ],
  },
];

const bySlug = new Map(INSURANCE_GUIDES.map((g) => [g.slug, g]));

export function guideBySlug(slug: string): InsuranceGuide | undefined {
  return bySlug.get(slug.toLowerCase());
}
