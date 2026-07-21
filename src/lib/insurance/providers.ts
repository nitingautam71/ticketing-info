import type { InsuranceProviderInfo } from './types';

/**
 * Provider directory — factual profiles compiled from insurers' public pages.
 * Claim links/phones are the insurers' published intake channels; we always
 * route claim filing to the insurer, never pretend to settle claims ourselves.
 */
export const INSURANCE_PROVIDERS: InsuranceProviderInfo[] = [
  // ---- US market ----
  {
    id: 'allianz',
    slug: 'allianz-travel',
    name: 'Allianz Travel',
    group: 'Allianz Partners (AGA Service Company)',
    headquarters: 'Richmond, Virginia, USA',
    founded: 1890,
    markets: ['US'],
    about:
      'One of the largest travel insurers in the United States, part of the global Allianz group. Known for the OneTrip single-trip range and AllTrips annual plans, app-based claims with fast electronic payment, and epidemic-coverage endorsements on most retail plans.',
    claims: {
      url: 'https://www.allianztravelinsurance.com/claims',
      phone: '+1-866-884-3556',
      note: 'Claims are filed online or in the Allyz TravelSmart app; most document-complete claims are decided within days.',
    },
    support247: true,
    website: 'https://www.allianztravelinsurance.com',
    productFamilies: ['OneTrip Basic', 'OneTrip Prime', 'OneTrip Premier', 'AllTrips Basic/Prime/Premier'],
  },
  {
    id: 'travel-guard',
    slug: 'travel-guard',
    name: 'Travel Guard',
    group: 'AIG (American International Group)',
    headquarters: 'Stevens Point, Wisconsin, USA',
    founded: 1982,
    markets: ['US'],
    about:
      'AIG’s travel insurance brand and one of the most widely distributed US travel protection lines, sold directly and through advisors and airlines. The Essential / Preferred / Deluxe ladder covers most leisure trips, with strong optional bundles (adventure sports, name-your-family, pet, wedding).',
    claims: {
      url: 'https://www.travelguard.com/claims',
      phone: '+1-866-478-8222',
      note: 'File online with receipts and proof of loss; assistance hotline coordinates emergencies 24×7.',
    },
    support247: true,
    website: 'https://www.travelguard.com',
    productFamilies: ['Essential', 'Preferred', 'Deluxe', 'Annual Travel Insurance', 'Pack N’ Go'],
  },
  {
    id: 'seven-corners',
    slug: 'seven-corners',
    name: 'Seven Corners',
    headquarters: 'Carmel, Indiana, USA',
    founded: 1993,
    markets: ['US', 'GLOBAL'],
    about:
      'Specialist in international travel medical and visitor insurance. Trip Protection plans serve US residents; the Travel Medical (formerly Liaison) series is a market standard for visitors to the USA, students and long-stay travellers worldwide.',
    claims: {
      url: 'https://www.sevencorners.com/help/claims',
      phone: '+1-800-335-0611',
      note: 'Claims filed through the Seven Corners portal; visitor-medical claims are paid directly to US network providers where possible.',
    },
    support247: true,
    website: 'https://www.sevencorners.com',
    productFamilies: ['Trip Protection Basic/Choice/Elite', 'Travel Medical USA', 'Travel Medical Global', 'Annual Multi-Trip'],
  },
  {
    id: 'img',
    slug: 'img-global',
    name: 'IMG (International Medical Group)',
    group: 'SiriusPoint',
    headquarters: 'Indianapolis, Indiana, USA',
    founded: 1990,
    markets: ['US', 'GLOBAL'],
    about:
      'Global medical benefits specialist best known for the Patriot travel medical series covering visitors to the USA and travellers worldwide, plus long-term Global Medical plans for expats and iTravelInsured trip protection for US residents.',
    claims: {
      url: 'https://www.imglobal.com/member/claims-center',
      phone: '+1-800-628-4664',
      note: 'Claims submitted via the MyIMG portal; the PPO network enables direct billing at many US hospitals.',
    },
    support247: true,
    website: 'https://www.imglobal.com',
    productFamilies: ['Patriot America Plus', 'Patriot Platinum', 'iTravelInsured Travel LX', 'Global Medical Insurance'],
  },
  {
    id: 'world-nomads',
    slug: 'world-nomads',
    name: 'World Nomads',
    group: 'nib Group / underwritten in the US by Nationwide',
    headquarters: 'Sydney, Australia (US operations: New York)',
    founded: 2002,
    markets: ['US'],
    about:
      'Built for independent, adventurous travellers: 150+ adventure activities covered as standard on the Explorer plan, buy or extend mid-trip from anywhere, and a claims flow designed for backpackers and digital nomads.',
    claims: {
      url: 'https://www.worldnomads.com/claims',
      note: 'Claims are lodged fully online with photo evidence; emergency assistance teams operate 24×7 worldwide.',
    },
    support247: true,
    website: 'https://www.worldnomads.com',
    productFamilies: ['Standard', 'Explorer', 'Epic (annual)'],
  },
  {
    id: 'travelex',
    slug: 'travelex-insurance',
    name: 'Travelex Insurance Services',
    group: 'Zurich Insurance Group',
    headquarters: 'Omaha, Nebraska, USA',
    founded: 1996,
    markets: ['US'],
    about:
      'Family-friendly US trip protection: the Travel Select plan insures children 17 and under at no extra cost with an adult, with solid cancellation/interruption limits and optional CFAR and adventure upgrades.',
    claims: {
      url: 'https://www.travelexinsurance.com/claims',
      phone: '+1-855-205-6054',
      note: 'Claims administered by Zurich Travel Claims; file online with trip invoices and proof of loss.',
    },
    support247: true,
    website: 'https://www.travelexinsurance.com',
    productFamilies: ['Travel Basic', 'Travel Select', 'Travel America'],
  },
  // ---- India market ----
  {
    id: 'tata-aig',
    slug: 'tata-aig',
    name: 'Tata AIG General Insurance',
    group: 'Joint venture: Tata Group & AIG',
    headquarters: 'Mumbai, India',
    founded: 2001,
    markets: ['IN'],
    about:
      'One of India’s most popular overseas travel insurers. The Travel Guard range spans Silver to Platinum with high US-ready medical sums, automatic trip-delay payouts on some variants, and a large international assistance network.',
    claims: {
      url: 'https://www.tataaig.com/claims',
      phone: '1800-266-7780',
      note: 'Cashless hospitalisation via the international assistance partner; reimbursement claims filed online with bills and reports.',
    },
    support247: true,
    website: 'https://www.tataaig.com',
    productFamilies: ['Travel Guard Silver/Gold/Platinum', 'Annual Multi-Trip', 'Student Guard'],
  },
  {
    id: 'icici-lombard',
    slug: 'icici-lombard',
    name: 'ICICI Lombard',
    headquarters: 'Mumbai, India',
    founded: 2001,
    markets: ['IN'],
    about:
      'India’s largest private general insurer. International travel plans (Round Trip / Gold / Platinum tiers) with strong Schengen-compliant options, senior-citizen variants to age 85, and an established cashless hospital network abroad.',
    claims: {
      url: 'https://www.icicilombard.com/claims',
      phone: '1800-2666',
      note: 'Intimate claims on the toll-free line or app; overseas hospitalisation is coordinated cashless where the network allows.',
    },
    support247: true,
    website: 'https://www.icicilombard.com',
    productFamilies: ['International Travel Insurance', 'Student Travel', 'Senior Citizen Travel', 'Gold Multi-Trip'],
  },
  {
    id: 'hdfc-ergo',
    slug: 'hdfc-ergo',
    name: 'HDFC ERGO General Insurance',
    group: 'HDFC Bank & ERGO (Munich Re)',
    headquarters: 'Mumbai, India',
    founded: 2002,
    markets: ['IN'],
    about:
      'Major Indian insurer with a well-regarded Travel range: single-trip and annual multi-trip international covers, Schengen-compliant certificates issued instantly, and add-ons for adventure sports and gadget cover.',
    claims: {
      url: 'https://www.hdfcergo.com/claims',
      phone: '022-6234-6234',
      note: 'Overseas assistance via partner network; claims filed online or through the HDFC ERGO app with supporting documents.',
    },
    support247: true,
    website: 'https://www.hdfcergo.com',
    productFamilies: ['Travel Insurance (Silver/Gold/Platinum)', 'Annual Multi-Trip', 'Student Suraksha'],
  },
  {
    id: 'bajaj-allianz',
    slug: 'bajaj-allianz',
    name: 'Bajaj Allianz General Insurance',
    group: 'Bajaj Finserv & Allianz SE',
    headquarters: 'Pune, India',
    founded: 2001,
    markets: ['IN'],
    about:
      'Long-running Travel Prime range with strong worldwide options (incl. USA/Canada tiers), a dedicated senior-citizen plan to age 75+, and one of the more generous home-burglary and trip-curtailment benefit sets in the Indian market.',
    claims: {
      url: 'https://www.bajajallianz.com/claim-assistance.html',
      phone: '1800-209-5858',
      note: 'In-house travel assistance desk; many small overseas medical claims are settled on a fast-track documents-light process.',
    },
    support247: true,
    website: 'https://www.bajajallianz.com',
    productFamilies: ['Travel Prime Individual', 'Travel Prime Senior', 'Travel Prime Student', 'Travel Elite'],
  },
  {
    id: 'reliance-general',
    slug: 'reliance-general',
    name: 'Reliance General Insurance',
    headquarters: 'Mumbai, India',
    founded: 2000,
    markets: ['IN'],
    about:
      'Competitive Indian travel insurer with sharply priced standard/gold/platinum international covers and a straightforward digital purchase flow — often among the lowest premiums for Schengen and Asia trips.',
    claims: {
      url: 'https://www.reliancegeneral.co.in/insurance/claims.aspx',
      phone: '1800-3009',
      note: 'Claims intimated via the toll-free line or portal; overseas emergencies handled by the international assistance partner.',
    },
    support247: true,
    website: 'https://www.reliancegeneral.co.in',
    productFamilies: ['Travel Care Standard/Gold/Platinum', 'Student Travel Care', 'Annual Multi-Trip'],
  },
  {
    id: 'care-health',
    slug: 'care-health',
    name: 'Care Health Insurance',
    group: 'Religare group heritage',
    headquarters: 'Gurugram, India',
    founded: 2012,
    markets: ['IN'],
    about:
      'Health-insurance specialist whose Explore travel range is popular for high medical sums at student-friendly prices, with region-specific variants (Asia, Europe, Worldwide) and strong pre-existing condition options for seniors.',
    claims: {
      url: 'https://www.careinsurance.com/claim.html',
      phone: '1800-102-4488',
      note: 'Cashless via international network hospitals; reimbursement claims filed through the Care portal.',
    },
    support247: true,
    website: 'https://www.careinsurance.com',
    productFamilies: ['Explore Asia', 'Explore Europe', 'Explore Worldwide', 'Explore Student'],
  },
  {
    id: 'digit',
    slug: 'digit-insurance',
    name: 'Go Digit General Insurance',
    headquarters: 'Bengaluru, India',
    founded: 2017,
    markets: ['IN'],
    about:
      'Digital-first Indian insurer known for a paperless purchase and claims experience: flight-delay payouts triggered automatically from flight data, missed-call claim intimation, and simple region-priced international covers.',
    claims: {
      url: 'https://www.godigit.com/claim',
      phone: '1800-258-5956',
      note: 'Smartphone-first claims — upload documents in the app; several delay benefits pay out proactively without a claim form.',
    },
    support247: true,
    website: 'https://www.godigit.com',
    productFamilies: ['International Travel Insurance', 'Domestic Travel Insurance', 'Flight Delay Cover'],
  },
];

const byId = new Map(INSURANCE_PROVIDERS.map((p) => [p.id, p]));
const bySlug = new Map(INSURANCE_PROVIDERS.map((p) => [p.slug, p]));

export function providerById(id: string): InsuranceProviderInfo | undefined {
  return byId.get(id);
}

export function providerBySlug(slug: string): InsuranceProviderInfo | undefined {
  return bySlug.get(slug.toLowerCase());
}
