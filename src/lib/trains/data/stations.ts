import type { StationFacility, TrainCountry, TrainStation } from '../types';
import { isOperatorEnabled } from './operators';

export function trainSlugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[().’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Major staffed terminus: everything a big-city station offers. */
const MAJOR: StationFacility[] = ['parking', 'wifi', 'lounge', 'food', 'luggage_storage', 'accessible', 'restrooms', 'waiting_room', 'charging', 'taxi', 'checked_baggage'];
/** Staffed regional station. */
const STAFFED: StationFacility[] = ['parking', 'food', 'accessible', 'restrooms', 'waiting_room', 'taxi'];

function st(
  code: string,
  name: string,
  city: string,
  region: string,
  country: TrainCountry,
  lat: number,
  lon: number,
  operators: string[],
  connections: string[],
  facilities: StationFacility[] = STAFFED,
): TrainStation {
  return { code, name, city, region, country, slug: trainSlugify(name), citySlug: trainSlugify(city), lat, lon, facilities, connections, operators };
}

const US_STATIONS: TrainStation[] = [
  // --- Northeast Corridor & New York State ---
  st('NYP', 'New York Moynihan Train Hall', 'New York', 'New York', 'US', 40.7519, -73.9935, ['amtrak'], ['NYC Subway (1·2·3·A·C·E at 34 St)', 'LIRR & NJ Transit', 'JFK/EWR/LGA via transit'], MAJOR),
  st('WAS', 'Washington Union Station', 'Washington DC', 'District of Columbia', 'US', 38.8977, -77.0065, ['amtrak'], ['WMATA Metro (Red Line)', 'MARC & VRE commuter rail', 'DCA via Metro'], MAJOR),
  st('PHL', 'Philadelphia 30th Street Station', 'Philadelphia', 'Pennsylvania', 'US', 39.9566, -75.1819, ['amtrak'], ['SEPTA Metro & Regional Rail', 'PHL Airport Line'], MAJOR),
  st('BOS', 'Boston South Station', 'Boston', 'Massachusetts', 'US', 42.3519, -71.0552, ['amtrak'], ['MBTA Red Line & commuter rail', 'Logan Airport via Silver Line'], MAJOR),
  st('PVD', 'Providence Station', 'Providence', 'Rhode Island', 'US', 41.8295, -71.4133, ['amtrak'], ['MBTA commuter rail', 'RIPTA buses']),
  st('NHV', 'New Haven Union Station', 'New Haven', 'Connecticut', 'US', 41.2973, -72.9268, ['amtrak'], ['Metro-North to NYC', 'CT Transit']),
  st('NWK', 'Newark Penn Station', 'Newark', 'New Jersey', 'US', 40.7347, -74.1644, ['amtrak'], ['PATH to Manhattan', 'NJ Transit', 'EWR AirTrain connection']),
  st('BAL', 'Baltimore Penn Station', 'Baltimore', 'Maryland', 'US', 39.3074, -76.6155, ['amtrak'], ['MARC Penn Line', 'Baltimore Light Rail']),
  st('ALB', 'Albany-Rensselaer Station', 'Albany', 'New York', 'US', 42.6412, -73.7413, ['amtrak'], ['CDTA buses'], STAFFED),
  st('BFX', 'Buffalo Exchange Street Station', 'Buffalo', 'New York', 'US', 42.8763, -78.8747, ['amtrak'], ['NFTA Metro Rail'], STAFFED),
  // --- Midwest ---
  st('CHI', 'Chicago Union Station', 'Chicago', 'Illinois', 'US', 41.8789, -87.6397, ['amtrak'], ['CTA L (Blue Line at Clinton)', 'Metra commuter rail', 'ORD/MDW via CTA'], MAJOR),
  st('MKE', 'Milwaukee Intermodal Station', 'Milwaukee', 'Wisconsin', 'US', 43.0345, -87.9169, ['amtrak'], ['MCTS buses', 'The Hop streetcar']),
  st('MSP', 'St. Paul Union Depot', 'Minneapolis-St. Paul', 'Minnesota', 'US', 44.9477, -93.0857, ['amtrak'], ['METRO Green Line to Minneapolis']),
  st('STL', 'St. Louis Gateway Station', 'St. Louis', 'Missouri', 'US', 38.6229, -90.2044, ['amtrak'], ['MetroLink light rail']),
  st('KCY', 'Kansas City Union Station', 'Kansas City', 'Missouri', 'US', 39.0845, -94.5857, ['amtrak'], ['KC Streetcar']),
  st('DET', 'Detroit Station', 'Detroit', 'Michigan', 'US', 42.3689, -83.0741, ['amtrak'], ['QLine streetcar', 'DDOT buses']),
  st('CLE', 'Cleveland Lakefront Station', 'Cleveland', 'Ohio', 'US', 41.5065, -81.6956, ['amtrak'], ['RTA Rapid Transit']),
  st('PGH', 'Pittsburgh Union Station', 'Pittsburgh', 'Pennsylvania', 'US', 40.4444, -79.9926, ['amtrak'], ['Pittsburgh Regional Transit']),
  st('CIN', 'Cincinnati Union Terminal', 'Cincinnati', 'Ohio', 'US', 39.1101, -84.5375, ['amtrak'], ['Metro buses']),
  // --- South & Florida (Amtrak) ---
  st('ATL', 'Atlanta Peachtree Station', 'Atlanta', 'Georgia', 'US', 33.7995, -84.3963, ['amtrak'], ['MARTA buses']),
  st('CLT', 'Charlotte Gateway Station', 'Charlotte', 'North Carolina', 'US', 35.2331, -80.8515, ['amtrak'], ['LYNX Blue Line nearby']),
  st('RGH', 'Raleigh Union Station', 'Raleigh', 'North Carolina', 'US', 35.7773, -78.6459, ['amtrak'], ['GoRaleigh buses']),
  st('RVR', 'Richmond Staples Mill Road', 'Richmond', 'Virginia', 'US', 37.6055, -77.4895, ['amtrak'], ['GRTC buses']),
  st('SAV', 'Savannah Station', 'Savannah', 'Georgia', 'US', 32.0879, -81.1444, ['amtrak'], ['CAT buses']),
  st('JAX', 'Jacksonville Station', 'Jacksonville', 'Florida', 'US', 30.3653, -81.7212, ['amtrak'], ['JTA buses']),
  st('ORL', 'Orlando Health Amtrak Station', 'Orlando', 'Florida', 'US', 28.5245, -81.3819, ['amtrak'], ['SunRail commuter rail', 'Lynx buses']),
  st('TPA', 'Tampa Union Station', 'Tampa', 'Florida', 'US', 27.9539, -82.4515, ['amtrak'], ['TECO streetcar', 'HART buses']),
  st('MIA', 'Miami Amtrak Station', 'Miami', 'Florida', 'US', 25.8479, -80.2593, ['amtrak'], ['Metrorail (Tri-Rail transfer)']),
  st('NOL', 'New Orleans Union Passenger Terminal', 'New Orleans', 'Louisiana', 'US', 29.9465, -90.0782, ['amtrak'], ['RTA streetcars']),
  st('MEM', 'Memphis Central Station', 'Memphis', 'Tennessee', 'US', 35.1325, -90.0596, ['amtrak'], ['MATA trolley']),
  // --- Texas & Mountain West ---
  st('DAL', 'Dallas Union Station', 'Dallas', 'Texas', 'US', 32.7767, -96.8078, ['amtrak'], ['DART light rail', 'TRE to Fort Worth']),
  st('FTW', 'Fort Worth Central Station', 'Fort Worth', 'Texas', 'US', 32.7515, -97.3268, ['amtrak'], ['TEXRail to DFW Airport', 'TRE to Dallas']),
  st('AUS', 'Austin Station', 'Austin', 'Texas', 'US', 30.2653, -97.7563, ['amtrak'], ['CapMetro buses']),
  st('SAS', 'San Antonio Station', 'San Antonio', 'Texas', 'US', 29.4197, -98.4797, ['amtrak'], ['VIA buses']),
  st('HOS', 'Houston Station', 'Houston', 'Texas', 'US', 29.7683, -95.3702, ['amtrak'], ['METRORail nearby']),
  st('DEN', 'Denver Union Station', 'Denver', 'Colorado', 'US', 39.7539, -105.0021, ['amtrak'], ['RTD A Line to DEN Airport', 'RTD light rail'], MAJOR),
  st('SLC', 'Salt Lake City Central', 'Salt Lake City', 'Utah', 'US', 40.7608, -111.9098, ['amtrak'], ['TRAX light rail', 'FrontRunner']),
  st('ABQ', 'Albuquerque Alvarado Transportation Center', 'Albuquerque', 'New Mexico', 'US', 35.0819, -106.6481, ['amtrak'], ['NM Rail Runner Express']),
  st('FLG', 'Flagstaff Station', 'Flagstaff', 'Arizona', 'US', 35.1975, -111.6488, ['amtrak'], ['Grand Canyon shuttles']),
  // --- West Coast ---
  st('LAX', 'Los Angeles Union Station', 'Los Angeles', 'California', 'US', 34.056, -118.2367, ['amtrak'], ['Metro B/D/A/E lines', 'FlyAway bus to LAX Airport', 'Metrolink'], MAJOR),
  st('SAN', 'San Diego Santa Fe Depot', 'San Diego', 'California', 'US', 32.7163, -117.1699, ['amtrak'], ['San Diego Trolley', 'COASTER']),
  st('EMY', 'Emeryville Station', 'San Francisco Bay Area', 'California', 'US', 37.8404, -122.2916, ['amtrak'], ['Free shuttle to San Francisco', 'AC Transit']),
  st('SAC', 'Sacramento Valley Station', 'Sacramento', 'California', 'US', 38.5843, -121.5006, ['amtrak'], ['SacRT light rail']),
  st('PDX', 'Portland Union Station', 'Portland', 'Oregon', 'US', 45.5289, -122.6766, ['amtrak'], ['MAX Light Rail', 'Portland Streetcar']),
  st('SEA', 'Seattle King Street Station', 'Seattle', 'Washington', 'US', 47.5984, -122.33, ['amtrak'], ['Link light rail to Sea-Tac Airport', 'Sounder'], MAJOR),
  // --- Auto Train ---
  st('LOR', 'Lorton Auto Train Terminal', 'Lorton', 'Virginia', 'US', 38.7043, -77.2205, ['amtrak'], ['I-95 park-and-ride for vehicles'], STAFFED),
  st('SFA', 'Sanford Auto Train Terminal', 'Sanford', 'Florida', 'US', 28.8003, -81.2686, ['amtrak'], ['Central Florida road connections'], STAFFED),
  // --- New England / Downeaster ---
  st('BON', 'Boston North Station', 'Boston', 'Massachusetts', 'US', 42.3663, -71.0622, ['amtrak'], ['MBTA Orange & Green lines', 'MBTA commuter rail'], MAJOR),
  st('POR', 'Portland Transportation Center', 'Portland (Maine)', 'Maine', 'US', 43.6591, -70.2568, ['amtrak'], ['Concord Coach Lines', 'Metro buses']),
  st('BRK', 'Brunswick Maine Street Station', 'Brunswick', 'Maine', 'US', 43.9146, -69.9653, ['amtrak'], ['Downtown Brunswick', 'Bowdoin College shuttle']),
  st('SPG', 'Springfield Union Station', 'Springfield', 'Massachusetts', 'US', 42.1015, -72.5898, ['amtrak'], ['PVTA buses', 'CTrail Hartford Line']),
  st('RUD', 'Rutland Station', 'Rutland', 'Vermont', 'US', 43.6106, -72.9726, ['amtrak'], ['Marble Valley Regional Transit']),
  st('BTN', 'Burlington Union Station', 'Burlington', 'Vermont', 'US', 44.4759, -73.2121, ['amtrak'], ['GMT buses', 'Lake Champlain ferries']),
  st('SAB', 'St. Albans Station', 'St. Albans', 'Vermont', 'US', 44.8109, -73.0837, ['amtrak'], ['Northwest Vermont road connections']),
  // --- New York State / cross-border corridors (US portions) ---
  st('NFL', 'Niagara Falls Station', 'Niagara Falls', 'New York', 'US', 43.0962, -79.0377, ['amtrak'], ['NFTA buses', 'US–Canada border crossing']),
  st('PLB', 'Plattsburgh Station', 'Plattsburgh', 'New York', 'US', 44.6995, -73.4529, ['amtrak'], ['Adirondack Trailways', 'Lake Champlain ferry']),
  // --- Keystone (Pennsylvania) ---
  st('HAR', 'Harrisburg Transportation Center', 'Harrisburg', 'Pennsylvania', 'US', 40.2606, -76.8837, ['amtrak'], ['Capital Area Transit', 'Keystone/Pennsylvanian hub'], MAJOR),
  st('LNC', 'Lancaster Station', 'Lancaster', 'Pennsylvania', 'US', 40.0587, -76.3055, ['amtrak'], ['Red Rose Transit']),
  // --- Piedmont / Carolinian (North Carolina) ---
  st('GRO', 'Greensboro Depot', 'Greensboro', 'North Carolina', 'US', 36.0726, -79.792, ['amtrak'], ['Greensboro Transit Authority', 'PART regional buses']),
  // --- San Joaquins (California Central Valley) ---
  st('OKJ', 'Oakland Jack London Square', 'Oakland', 'California', 'US', 37.7949, -122.2769, ['amtrak'], ['BART (12th St shuttle)', 'AC Transit', 'SF Bay Ferry']),
  st('SKN', 'Stockton San Joaquin Street', 'Stockton', 'California', 'US', 37.9577, -121.2908, ['amtrak'], ['San Joaquin RTD buses']),
  st('FNO', 'Fresno Station', 'Fresno', 'California', 'US', 36.7395, -119.7889, ['amtrak'], ['Fresno Area Express']),
  st('BFD', 'Bakersfield Station', 'Bakersfield', 'California', 'US', 35.3733, -119.0187, ['amtrak'], ['Thruway bus to Los Angeles', 'GET buses']),
  // --- Heartland Flyer (Oklahoma–Texas) ---
  st('OKC', 'Oklahoma City Santa Fe Depot', 'Oklahoma City', 'Oklahoma', 'US', 35.4676, -97.5164, ['amtrak'], ['EMBARK streetcar & buses']),
  // --- Brightline (Florida) — disabled placeholder operator ---
  st('BLM', 'MiamiCentral (Brightline)', 'Miami', 'Florida', 'US', 25.7789, -80.1953, ['brightline'], ['Metrorail & Metromover at Government Center', 'Tri-Rail'], MAJOR),
  st('BLA', 'Aventura (Brightline)', 'Aventura', 'Florida', 'US', 25.9565, -80.1471, ['brightline'], ['Aventura Mall shuttle']),
  st('BLF', 'Fort Lauderdale (Brightline)', 'Fort Lauderdale', 'Florida', 'US', 26.1224, -80.1443, ['brightline'], ['Broward County Transit', 'FLL Airport rideshare']),
  st('BLB', 'Boca Raton (Brightline)', 'Boca Raton', 'Florida', 'US', 26.3505, -80.0866, ['brightline'], ['Palm Tran buses']),
  st('BLW', 'West Palm Beach (Brightline)', 'West Palm Beach', 'Florida', 'US', 26.7126, -80.0539, ['brightline'], ['Tri-Rail', 'Palm Tran']),
  st('BLO', 'Orlando International Airport (Brightline)', 'Orlando', 'Florida', 'US', 28.4179, -81.3041, ['brightline'], ['Inside MCO Terminal C', 'SunRail link planned'], MAJOR),
  // --- Alaska Railroad ---
  st('ANC', 'Anchorage Depot', 'Anchorage', 'Alaska', 'US', 61.2231, -149.8863, ['alaska-railroad'], ['ANC Airport shuttle']),
  st('TKA', 'Talkeetna Depot', 'Talkeetna', 'Alaska', 'US', 62.3209, -150.1066, ['alaska-railroad'], ['Denali flightseeing operators']),
  st('DNP', 'Denali Park Depot', 'Denali National Park', 'Alaska', 'US', 63.7283, -148.8863, ['alaska-railroad'], ['Park shuttle buses']),
  st('FAI', 'Fairbanks Depot', 'Fairbanks', 'Alaska', 'US', 64.8459, -147.7767, ['alaska-railroad'], ['FAI Airport taxi']),
  st('SEW', 'Seward Depot', 'Seward', 'Alaska', 'US', 60.1195, -149.4422, ['alaska-railroad'], ['Cruise port walkway']),
];

export const TRAIN_STATIONS: TrainStation[] = [...US_STATIONS];

const byCode = new Map(TRAIN_STATIONS.map((s) => [s.code, s]));
const bySlug = new Map(TRAIN_STATIONS.map((s) => [s.slug, s]));

export function stationByCode(code: string): TrainStation | undefined {
  return byCode.get(code.toUpperCase());
}

/**
 * Stations served by at least one enabled operator (Amtrak today). Pure /
 * DB-free — safe to import in client components for the search combobox.
 * Disabled placeholders (Brightline, Alaska Railroad) are excluded until their
 * operator is switched on.
 */
export function activeStationsList(): TrainStation[] {
  return TRAIN_STATIONS.filter((s) => s.operators.some(isOperatorEnabled));
}

export function stationBySlug(slug: string): TrainStation | undefined {
  return bySlug.get(slug.toLowerCase());
}

/** All stations sharing a city slug (e.g. 'boston' → BOS, BON). */
export function stationsByCitySlug(citySlug: string): TrainStation[] {
  const c = citySlug.toLowerCase();
  return TRAIN_STATIONS.filter((s) => s.citySlug === c);
}

/**
 * Resolve free text (station code, station slug, city slug, or partial
 * name/city) to candidate stations. Exact code/slug wins; otherwise falls back
 * to case-insensitive containment on name and city.
 */
export function resolveStations(query: string): TrainStation[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const code = byCode.get(q.toUpperCase());
  if (code) return [code];
  const slug = bySlug.get(q);
  if (slug) return [slug];
  const city = stationsByCitySlug(trainSlugify(q));
  if (city.length > 0) return city;
  return TRAIN_STATIONS.filter((s) => s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q));
}
