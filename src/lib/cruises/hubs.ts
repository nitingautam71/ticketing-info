// Content and helpers for the cruise SEO hub pages:
//   /cruises/destination/[slug]  — one per catalog destination region (33)
//   /cruises/line/[slug]         — one per cruise line (25, from cruise-lines.ts)
//   /cruises/from/[slug]         — one per departure port with sailings (from ports.ts)
//
// Curated copy lives here; live numbers (price-from, sailing counts, top lines)
// come from getCruiseHubStats() in src/lib/providers/cruises.ts so FAQ answers and
// stat strips stay truthful as the catalog changes. Every hub exists to do one
// thing: turn a searcher into a phone call with a cruise consultant.

import type { CruiseLine, CruisePort } from './types';
import { CRUISE_LINES } from './cruise-lines';
import { PORTS } from './ports';

export interface DestinationHub {
  slug: string;
  destination: string; // exact CruiseCatalog.destination value
  intro: string[]; // 2 short unique paragraphs
  bestTime: string;
  callHook: string; // destination-specific reason to call instead of self-booking
}

/** Live aggregates for one hub, computed from the CruiseCatalog table. */
export interface CruiseHubStats {
  count: number;
  minPriceUSD: number;
  minNights: number;
  maxNights: number;
  topLines: string[]; // by sailing count, for destination/port hubs
  topDestinations: string[]; // for line/port hubs
}

export function destinationSlug(destination: string): string {
  return destination
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export const DESTINATION_HUBS: DestinationHub[] = [
  {
    slug: 'caribbean',
    destination: 'Caribbean',
    intro: [
      'The Caribbean is the busiest cruise region on earth for a reason: short flights from most U.S. cities, year-round warm water, and island-a-day itineraries that pack Jamaica, Cozumel, Grand Cayman, and private islands into a single week.',
      'It is also where cabin choice matters most — an interior cabin on a mega-ship and a balcony on the same sailing can differ by more than the airfare. A quick call usually surfaces a better cabin for less than the price you found online.',
    ],
    bestTime: 'December through April is the dry season sweet spot; hurricane season (June–November) brings the deepest discounts and the most flexible cancellation terms.',
    callHook: 'Caribbean pricing changes weekly and unsold balconies get quietly discounted — a consultant sees the current promo grid across Royal Caribbean, Carnival, NCL, and MSC in one place.',
  },
  {
    slug: 'bahamas',
    destination: 'Bahamas',
    intro: [
      'Bahamas cruises are the easiest way to test cruising: 3–5 night sailings from Florida that hit Nassau, private islands like Perfect Day at CocoCay, and back before the weekend is over.',
      'Because these are short, high-volume sailings, fare sales are frequent and cabin categories sell out in blocks — the difference between a good deal and a great one is usually timing.',
    ],
    bestTime: 'Sailings run year-round; November through April has the most comfortable temperatures, while summer brings family-heavy ships and frequent flash sales.',
    callHook: 'Short Bahamas sailings often bundle drinks, Wi-Fi, or kids-sail-free promos that never show on the headline price — ask what is running this week.',
  },
  {
    slug: 'alaska',
    destination: 'Alaska',
    intro: [
      'Alaska is the bucket-list cruise for scenery: calving glaciers in Glacier Bay, whales off Juneau, and the Inside Passage threading between rainforest islands. Most sailings run round-trip from Seattle or one-way from Vancouver.',
      'Cabin side, sailing direction, and shore excursion choices genuinely change the trip — this is the itinerary where ten minutes with someone who has actually done it saves the most regret.',
    ],
    bestTime: 'The season runs May through September. May and September sail cheapest; June–August gets the longest daylight and best wildlife viewing.',
    callHook: 'Balcony cabins on the glacier-facing side and the popular dome-car rail add-ons sell out months out — a consultant checks real inventory instead of guessing.',
  },
  {
    slug: 'mexican-riviera',
    destination: 'Mexican Riviera',
    intro: [
      'The Mexican Riviera is the West Coast answer to the Caribbean: Cabo San Lucas, Mazatlán, and Puerto Vallarta on week-long loops from Los Angeles, with no long flight for anyone west of the Rockies.',
      'These sailings compete hard on price with Caribbean departures, so the same week often has genuinely different value depending on which coast you sail from.',
    ],
    bestTime: 'October through May avoids both hurricane season and the summer heat; winter sailings pair well with whale-watching in Cabo.',
    callHook: 'If you are flexible between a Caribbean and Mexican Riviera week, a consultant can price both coasts in one call and tell you which one is actually cheaper that month.',
  },
  {
    slug: 'hawaii',
    destination: 'Hawaii',
    intro: [
      'Hawaii cruising solves the islands\' biggest logistics problem: seeing Oahu, Maui, Kauai, and the Big Island without four hotel check-ins and three inter-island flights. Sailings either loop the islands round-trip from Honolulu or cross the Pacific from the West Coast.',
      'The two styles are very different trips — island-intensive loops maximize port time, while Pacific crossings trade port days for deeply discounted fares and sea-day relaxation.',
    ],
    bestTime: 'Hawaii is a year-round destination; April–May and September–October combine the best weather with shoulder-season fares.',
    callHook: 'Choosing between the Honolulu loop and a West Coast crossing changes the price by thousands — talk it through before you book the wrong style.',
  },
  {
    slug: 'mediterranean',
    destination: 'Mediterranean',
    intro: [
      'The Mediterranean packs more famous ports per week than anywhere else afloat: Barcelona, Rome, Athens, and the French Riviera, often on a single itinerary with a sea day between them.',
      'Flights, pre-cruise hotel nights, and transfer logistics matter as much as the fare here — the cruise is often the cheapest part of the trip to get right.',
    ],
    bestTime: 'May–June and September–October offer warm weather without August crowds and peak-season pricing; winter sailings are rare but deeply discounted.',
    callHook: 'A consultant prices the cruise, the flights into Barcelona or Rome, and the pre-cruise hotel as one package — which is where most Mediterranean budgets go wrong.',
  },
  {
    slug: 'greek-islands',
    destination: 'Greek Islands',
    intro: [
      'Greek Islands itineraries string together Santorini sunsets, Mykonos harbors, and ancient ports like Rhodes and Katakolon (Olympia) — places that are genuinely painful to connect by ferry on your own.',
      'Ships range from mega-liners to small vessels that dock where the big ships tender, and that single choice defines the whole trip.',
    ],
    bestTime: 'Late April through October, with June and September the sweet spot — swimmable water, open tavernas, and lighter crowds than midsummer.',
    callHook: 'Tender ports like Santorini reward the right ship and the right arrival time — a consultant who knows the schedules can save you hours of queueing.',
  },
  {
    slug: 'norwegian-fjords',
    destination: 'Norwegian Fjords',
    intro: [
      'Norwegian Fjords cruises sail straight into UNESCO-listed Geirangerfjord and Nærøyfjord, past waterfalls that drop a thousand feet from the cliff to the ship\'s rail. It is the most dramatic coastal scenery in Europe, reachable without a single mountain drive.',
      'Departures run from Southampton, Amsterdam, and Copenhagen, which makes fly-cruise packaging the real pricing question for U.S. travelers.',
    ],
    bestTime: 'May through early September; June brings the midnight sun, while May and September sail noticeably cheaper.',
    callHook: 'The same fjords week can start in three different countries — a consultant prices all the fly-cruise combinations instead of the one you happened to find.',
  },
  {
    slug: 'northern-europe',
    destination: 'Northern Europe',
    intro: [
      'Northern Europe itineraries mix capital cities and coastal scenery — Copenhagen, Oslo, Amsterdam, and the German ports — on sailings that treat the ship as a floating hotel between cities.',
      'These routes shine for travelers who want Europe\'s highlights without repacking: one cabin, five countries, no train stations.',
    ],
    bestTime: 'May through September; midsummer offers 18-hour days, and shoulder months cut fares substantially.',
    callHook: 'Port-intensive itineraries make cabin location matter less and excursion planning matter more — a consultant helps spend the budget where it counts.',
  },
  {
    slug: 'baltic-sea',
    destination: 'Baltic Sea',
    intro: [
      'Baltic cruises are capital-hopping at its best: Stockholm\'s archipelago, Helsinki, Tallinn\'s medieval old town, and Copenhagen, connected by overnight sailing instead of budget flights.',
      'Multi-day port calls and long summer daylight make this one of the most sightseeing-dense itineraries in cruising.',
    ],
    bestTime: 'May through September, peaking in June–July when the Baltic capitals barely see night.',
    callHook: 'Baltic itineraries vary widely in which capitals get overnight stays — a consultant matches the itinerary to the cities you actually care about.',
  },
  {
    slug: 'british-isles',
    destination: 'British Isles',
    intro: [
      'British Isles cruises circle England, Scotland, Ireland, and Wales — Edinburgh, Dublin, the Scottish Highlands, and smaller ports like Cobh and Holyhead that road trips usually skip.',
      'It is the rare itinerary where weather is part of the charm and every port speaks English, making it a favorite first Europe cruise for U.S. travelers.',
    ],
    bestTime: 'May through September; expect changeable weather any month and pack layers regardless.',
    callHook: 'Round-Britain sailings from Southampton pair naturally with a London stay — a consultant builds the whole trip, not just the sea days.',
  },
  {
    slug: 'western-europe',
    destination: 'Western Europe',
    intro: [
      'Western Europe itineraries link Lisbon, Porto, Bordeaux, and the Atlantic coast of Spain and France — wine country by sea, with fewer crowds than the Mediterranean circuit.',
      'Many of these sailings are repositioning legs or one-ways, which means unusual routes and unusually good per-night pricing.',
    ],
    bestTime: 'April through October; spring and fall repositioning season brings the best fares.',
    callHook: 'One-way Atlantic coast itineraries need flight planning on both ends — exactly the logistics a consultant handles in one call.',
  },
  {
    slug: 'panama-canal',
    destination: 'Panama Canal',
    intro: [
      'A Panama Canal transit is engineering tourism at its finest: a full day climbing and descending the locks between two oceans, bookended by Costa Rican rainforest and Caribbean ports.',
      'Full transits reposition ships between coasts seasonally, so departures are limited and the best cabins — starboard for the approach, with a balcony — go early.',
    ],
    bestTime: 'Transit season runs roughly September through April, following the ships\' seasonal repositioning between Alaska and the Caribbean.',
    callHook: 'Full-transit sailings are limited each year and priced like the bucket-list trips they are — early access to inventory matters more here than almost anywhere.',
  },
  {
    slug: 'south-america',
    destination: 'South America',
    intro: [
      'South America cruising rounds Cape Horn, calls at Buenos Aires and Rio, and threads the Chilean fjords — expedition-grade scenery on mainstream ships.',
      'Distances are long and seasons are inverted, which makes this a route where itinerary reading skills genuinely pay off.',
    ],
    bestTime: 'November through March — the southern summer — is the season for Patagonia and Cape Horn sailings.',
    callHook: 'Southern-hemisphere seasons and long flight legs make timing tricky — a consultant who has routed this before saves real money on the air.',
  },
  {
    slug: 'antarctica',
    destination: 'Antarctica',
    intro: [
      'Antarctica is the last great expedition: Zodiac landings among penguin colonies, tabular icebergs, and the Drake Passage as a rite of passage. Sailings depart from Ushuaia at the tip of Argentina.',
      'Expedition ships carry under 500 passengers by treaty rules, and the difference between ships is the difference between watching Antarctica and landing on it.',
    ],
    bestTime: 'The season runs November through March: November for pristine ice, December–January for penguin chicks, February–March for whales.',
    callHook: 'Landing-permit rules mean smaller ships land more often — a consultant explains exactly what each fare does and does not include before you commit five figures.',
  },
  {
    slug: 'arctic',
    destination: 'Arctic',
    intro: [
      'Arctic expedition cruises chase polar bears in Svalbard, sail the Greenland fjords, and cross into the midnight sun — raw polar wilderness with expert guides aboard.',
      'Like Antarctica, the ship defines the experience: ice class, Zodiac fleet, and expedition team matter far more than cabin finishes.',
    ],
    bestTime: 'June through September, when the pack ice retreats and wildlife is most active.',
    callHook: 'Arctic itineraries are weather-dependent by design — a consultant sets honest expectations about what is guaranteed and what is expedition luck.',
  },
  {
    slug: 'world-cruises',
    destination: 'World Cruises',
    intro: [
      'World cruises are the ultimate itinerary: 90 to 180 nights circling the globe, with dozens of countries on one booking and your cabin as home the whole way.',
      'These sail once a year per ship and are sold like real estate — by segment, by full voyage, with early-booking benefits that expire long before departure.',
    ],
    bestTime: 'Most world cruises depart in January, sailing westward toward warm weather; segments can be joined year-round.',
    callHook: 'Full world cruises and their segments are quoted, negotiated, and held — not bought with a checkout button. This is precisely what a phone consultant is for.',
  },
  {
    slug: 'australia',
    destination: 'Australia',
    intro: [
      'Australia cruising pairs Sydney Harbour departures — sailing under the bridge, past the Opera House — with the Great Barrier Reef, Tasmania, and the tropical Queensland coast.',
      'For U.S. travelers the long-haul flight is the real cost, which makes longer itineraries and cruise-plus-stay packages the smart play.',
    ],
    bestTime: 'October through April, the southern summer, with December holidays commanding peak fares.',
    callHook: 'When the flight costs as much as the cruise, packaging matters — a consultant builds the fare, air, and pre-cruise Sydney stay as one price.',
  },
  {
    slug: 'new-zealand',
    destination: 'New Zealand',
    intro: [
      'New Zealand itineraries sail Milford Sound at dawn, call at Maori cultural capitals like Rotorua\'s port of Tauranga, and loop both islands without a single mountain road.',
      'Most sailings pair with Australia departures, making trans-Tasman itineraries the standard way to see both countries in one trip.',
    ],
    bestTime: 'November through March for the southern summer; Fiordland scenery is at its most dramatic year-round.',
    callHook: 'Trans-Tasman routes differ widely in how much of New Zealand they actually see — a consultant reads the fine print of port times so you do not have to.',
  },
  {
    slug: 'south-pacific',
    destination: 'South Pacific',
    intro: [
      'South Pacific cruises reach Bora Bora, Moorea, and Fiji — islands where the alternative is a string of expensive inter-island flights and overwater bungalows at four figures a night.',
      'A ship is genuinely the affordable way to see French Polynesia, and small-ship options sail straight from Tahiti year-round.',
    ],
    bestTime: 'May through October is the dry season across most of the South Pacific.',
    callHook: 'Tahiti-based small ships versus long sailings from the U.S. West Coast are completely different trips at completely different prices — compare both with someone who knows them.',
  },
  {
    slug: 'southeast-asia',
    destination: 'Southeast Asia',
    intro: [
      'Southeast Asia itineraries connect Singapore, Thai beaches, Vietnamese ports, and Malaysian cities — street food capitals and temple towns without the overland logistics.',
      'Sailings cluster around Singapore, one of the world\'s best cruise hubs, with easy pre-cruise city stays and excellent flight connections.',
    ],
    bestTime: 'November through March, the dry season in most of the region and escape season for U.S. winters.',
    callHook: 'Overnight port calls in Ho Chi Minh City or Bangkok make or break these itineraries — a consultant flags which sailings actually give you the time ashore.',
  },
  {
    slug: 'japan',
    destination: 'Japan',
    intro: [
      'Japan cruises circle from Tokyo through Kobe, Hiroshima, and southern islands, often timed to cherry blossom season — the country\'s greatest hits without navigating the rail network with luggage.',
      'Spring blossom and autumn foliage sailings sell out far ahead; the shoulder itineraries are the value plays.',
    ],
    bestTime: 'Late March–April for cherry blossoms, October–November for autumn color; both are peak-demand windows.',
    callHook: 'Blossom-season cabins are booked six to twelve months out — a consultant tells you honestly whether to wait for a sale or book now.',
  },
  {
    slug: 'china',
    destination: 'China',
    intro: [
      'China itineraries sail from Shanghai\'s dramatic Wusongkou terminal toward Korea, Japan, and the Chinese coast — big-ship cruising with some of the newest hardware afloat.',
      'These routes combine well with land stays in Shanghai or Beijing, which is where most of the planning complexity lives.',
    ],
    bestTime: 'April–May and September–October avoid both the summer humidity and winter cold.',
    callHook: 'Visa rules for China land stays versus visa-free transit are genuinely confusing — a consultant sorts your specific passport situation before you book.',
  },
  {
    slug: 'south-korea',
    destination: 'South Korea',
    intro: [
      'South Korea sailings call at Busan and Jeju Island — Korea\'s Hawaii — usually woven into itineraries with Japan across the strait.',
      'Jeju\'s volcanic coast and Busan\'s markets make these ports highlights of any East Asia loop rather than filler stops.',
    ],
    bestTime: 'April–June and September–November for mild weather and clear skies.',
    callHook: 'Korea rarely headlines an itinerary — a consultant finds the East Asia routes where it gets real port time instead of a drive-by call.',
  },
  {
    slug: 'india',
    destination: 'India',
    intro: [
      'India cruises sail from Mumbai\'s Ballard Pier toward Goa, Cochin, and the Arabian Sea — an utterly different way into a country most visitors only see by air and rail.',
      'Itineraries often continue toward the Middle East or Southeast Asia, making India a gateway leg on longer voyages.',
    ],
    bestTime: 'October through March, after the monsoon and before the heat.',
    callHook: 'Indian port formalities and visa requirements are stricter than most cruise regions — get them confirmed for your passport before booking, not after.',
  },
  {
    slug: 'middle-east',
    destination: 'Middle East',
    intro: [
      'Middle East itineraries loop Dubai, Abu Dhabi, and the Gulf — winter-sun cruising among skyscrapers, souks, and desert excursions, with some of the newest ships afloat based there seasonally.',
      'Short flight-inclusive packages from Europe make this a popular add-on region, and U.S. travelers benefit from the same packaging.',
    ],
    bestTime: 'October through April; summer Gulf heat is genuinely prohibitive.',
    callHook: 'Gulf itineraries are sold heavily as fly-cruise bundles — a consultant checks whether the bundle or separate booking wins for your dates.',
  },
  {
    slug: 'africa',
    destination: 'Africa',
    intro: [
      'Africa cruising spans Cape Town under Table Mountain, the Indian Ocean islands, and West African ports few travelers ever reach — often on repositioning voyages with rich sea-day programs.',
      'Safari add-ons before or after the cruise are the point for many travelers, and they need booking as one coordinated trip.',
    ],
    bestTime: 'November through March for southern Africa\'s summer; repositioning voyages cluster in spring and fall.',
    callHook: 'Cruise-plus-safari is a two-specialist trip rolled into one booking — exactly the itinerary to plan by phone rather than checkout page.',
  },
  {
    slug: 'amazon-river',
    destination: 'Amazon River',
    intro: [
      'Amazon River cruises sail deep into the rainforest from Manaus, with skiff excursions into flooded forest, pink dolphins, and villages unreachable by road.',
      'This is small-ship expedition territory: the vessel\'s draft, guides, and skiff fleet define what you actually see.',
    ],
    bestTime: 'High water (December–May) reaches deeper into the flooded forest by skiff; low water (June–November) means more walking trails and beaches.',
    callHook: 'High-water and low-water Amazon are two different trips — a consultant makes sure you book the one you are imagining.',
  },
  {
    slug: 'nile-river',
    destination: 'Nile River',
    intro: [
      'Nile cruises float between Luxor and Aswan past Karnak, the Valley of the Kings, and temples that have watched the river for three thousand years — with an Egyptologist aboard.',
      'The boat standard varies enormously on the Nile, and the guide makes or breaks the temples.',
    ],
    bestTime: 'October through April; Egyptian summer heat makes afternoon temple visits genuinely hard.',
    callHook: 'On the Nile, the Egyptologist and the boat category are everything — book through someone who knows which boats deliver.',
  },
  {
    slug: 'danube-river',
    destination: 'Danube River',
    intro: [
      'The Danube links Vienna, Budapest, and the vineyard-lined Wachau Valley — Europe\'s imperial capitals with your hotel floating between them.',
      'Christmas market season transforms these itineraries into some of the most in-demand river sailings in the world.',
    ],
    bestTime: 'April through October for classic sailings; late November–December for Christmas markets.',
    callHook: 'Christmas market cabins sell out by summer — a consultant knows which departures still have space and which lines do the markets best.',
  },
  {
    slug: 'rhine-river',
    destination: 'Rhine River',
    intro: [
      'Rhine itineraries sail the castle-studded gorge between Amsterdam and Basel, through the Lorelei and past vineyard villages like Rüdesheim — the classic first river cruise.',
      'Water levels can affect sailings in late summer; experienced lines handle it well, and knowing which ones do is genuine insider knowledge.',
    ],
    bestTime: 'April through October, with tulip-season Amsterdam extensions in spring and Christmas markets in December.',
    callHook: 'Low-water contingency handling differs sharply between river lines — a consultant steers you toward the operators who manage it gracefully.',
  },
  {
    slug: 'mekong-river',
    destination: 'Mekong River',
    intro: [
      'Mekong cruises drift between Vietnam and Cambodia — floating markets, silk villages, and Angkor Wat as the grand finale or opener.',
      'These itineraries are really cruise-tours: the land segments in Siem Reap and Ho Chi Minh City are half the trip.',
    ],
    bestTime: 'November through February is dry season with comfortable temperatures; water levels are highest August–October.',
    callHook: 'The Angkor Wat land portion varies from rushed to sublime depending on the operator — a consultant knows which programs give the temples the time they deserve.',
  },
  {
    slug: 'mississippi-river',
    destination: 'Mississippi River',
    intro: [
      'Mississippi River cruises paddle between New Orleans and Memphis through antebellum estates, Civil War sites, and blues country — American history at riverboat pace, with no passport required.',
      'Domestic river cruising books heavily with U.S. travelers and sells out further ahead than most ocean itineraries.',
    ],
    bestTime: 'March through May and September through November; New Orleans departures pair beautifully with spring and fall city weather.',
    callHook: 'With only a handful of boats on the river, real availability knowledge matters — a consultant checks actual cabin inventory across departure dates.',
  },
];

export const DESTINATION_HUBS_BY_SLUG: Record<string, DestinationHub> = Object.fromEntries(
  DESTINATION_HUBS.map((h) => [h.slug, h])
);

export const DESTINATION_HUBS_BY_NAME: Record<string, DestinationHub> = Object.fromEntries(
  DESTINATION_HUBS.map((h) => [h.destination, h])
);

// --- Cross-linking helpers between the three hub types ---

/** CruiseCatalog rows key ports by display name (e.g. 'PortMiami'); hub URLs use the port id. */
export const PORT_BY_CATALOG_NAME: Record<string, CruisePort> = Object.fromEntries(PORTS.map((p) => [p.name, p]));

const LINE_SLUG_BY_NAME: Record<string, string> = Object.fromEntries(CRUISE_LINES.map((l) => [l.name, l.slug]));

export function destinationHubPath(destination: string): string | null {
  const hub = DESTINATION_HUBS_BY_NAME[destination];
  return hub ? `/cruises/destination/${hub.slug}` : null;
}

export function lineHubPath(cruiseLineName: string): string | null {
  const slug = LINE_SLUG_BY_NAME[cruiseLineName];
  return slug ? `/cruises/line/${slug}` : null;
}

export function portHubPath(departurePortName: string): string | null {
  const port = PORT_BY_CATALOG_NAME[departurePortName];
  return port ? `/cruises/from/${port.id}` : null;
}

export interface HubFaq {
  question: string;
  answer: string;
}

const CALL_CLOSER =
  'Call Ticketing-Info and a licensed cruise consultant compares live fares, cabin categories, and current promotions for you — no online payment, nothing booked until you confirm.';

function formatUSD(n: number): string {
  return `$${n.toLocaleString('en-US')}`;
}

function joinList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

/** "an Alaska cruise", "a Caribbean cruise", "a world cruise" */
function aCruisePhrase(destination: string): string {
  if (destination === 'World Cruises') return 'a world cruise';
  const article = /^[aeiou]/i.test(destination) ? 'an' : 'a';
  return `${article} ${destination} cruise`;
}

export function buildDestinationFaqs(hub: DestinationHub, stats: CruiseHubStats): HubFaq[] {
  return [
    {
      question: `How much does ${aCruisePhrase(hub.destination)} cost?`,
      answer: `${hub.destination} cruises in our catalog start from ${formatUSD(stats.minPriceUSD)} per person for an interior cabin, with ${stats.count.toLocaleString('en-US')} sailings to compare. Balcony and suite fares vary week to week with promotions. ${CALL_CLOSER}`,
    },
    {
      question: `How long are ${hub.destination} cruises?`,
      answer: `Itineraries run from ${stats.minNights} to ${stats.maxNights} nights. Shorter sailings suit first-timers and long weekends, while longer voyages reach ports the week-long loops skip.`,
    },
    {
      question: `When is the best time to take ${aCruisePhrase(hub.destination)}?`,
      answer: hub.bestTime,
    },
    {
      question: `Which cruise lines sail ${hub.destination} itineraries?`,
      answer: `${joinList(stats.topLines)} all operate ${hub.destination} sailings in our current catalog, from family mega-ships to adults-only and luxury small ships. Which one fits you depends on budget, travel party, and how you like to spend sea days.`,
    },
    {
      question: `Why book ${aCruisePhrase(hub.destination)} by phone instead of online?`,
      answer: `${hub.callHook} ${CALL_CLOSER}`,
    },
  ];
}

export function buildLineFaqs(line: CruiseLine, stats: CruiseHubStats): HubFaq[] {
  const styleAnswer = line.adultsOnly
    ? `${line.name} ships are adults-only, which makes them a favorite for couples and friend groups who want a resort atmosphere without kids clubs and family pools.`
    : line.riverCruise
      ? `${line.name} specializes in river cruising: small vessels, included excursions, and itineraries built around ports rather than sea days — a very different rhythm from ocean cruising.`
      : line.luxuryLevel === 'luxury'
        ? `${line.name} sits at the luxury end of cruising — smaller ships, higher staff ratios, and fares that typically include far more than the mainstream lines.`
        : `${line.name} welcomes families and first-time cruisers alike; its ships carry the pools, dining variety, and entertainment that define modern big-ship cruising.`;

  return [
    {
      question: `What is ${line.name} known for?`,
      answer: `${line.description} Standouts include ${joinList(line.keySellingPoints.slice(0, 3))}.`,
    },
    {
      question: `How much do ${line.name} cruises cost?`,
      answer: `We track ${stats.count.toLocaleString('en-US')} ${line.name} sailings starting from ${formatUSD(stats.minPriceUSD)} per person. ${CALL_CLOSER}`,
    },
    {
      question: `Where does ${line.name} sail?`,
      answer: `Current ${line.name} itineraries in our catalog cover ${joinList(stats.topDestinations)}, on voyages from ${stats.minNights} to ${stats.maxNights} nights.`,
    },
    {
      question: `Is ${line.name} a good fit for my travel party?`,
      answer: styleAnswer,
    },
    {
      question: `Why book ${line.name} through Ticketing-Info?`,
      answer: `You pay the same or less than booking direct — we work on the line's commission, not on top of your fare — and you get a consultant who knows ${line.name}'s ships, cabin categories, and current promotions. ${CALL_CLOSER}`,
    },
  ];
}

export function buildPortFaqs(port: CruisePort, stats: CruiseHubStats): HubFaq[] {
  return [
    {
      question: `Where do cruises from ${port.name} go?`,
      answer: `Sailings from ${port.name} currently cover ${joinList(stats.topDestinations)} — ${stats.count.toLocaleString('en-US')} departures from ${stats.minNights} to ${stats.maxNights} nights.`,
    },
    {
      question: `How much do cruises from ${port.name} cost?`,
      answer: `Fares start from ${formatUSD(stats.minPriceUSD)} per person for an interior cabin. ${CALL_CLOSER}`,
    },
    {
      question: `How do I get to ${port.name}?`,
      answer: port.transportation,
    },
    {
      question: `What can I do in ${port.city} before or after my cruise?`,
      answer: `${port.city} is worth arriving a day early for. Highlights near the port include ${joinList(port.topAttractions.slice(0, 3))}. Plan on roughly ${formatUSD(port.estimatedBudgetUSD)} per person for a pre-cruise day including meals.`,
    },
    {
      question: `What travel documents do I need to sail from ${port.name}?`,
      answer: `${port.visaSummary} Requirements depend on your itinerary's ports as well as the departure country — confirm your specific passport situation with your consultant before booking.`,
    },
  ];
}
