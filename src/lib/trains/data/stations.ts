import type { StationFacility, TrainCountry, TrainStation } from '../types';

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
  // --- Brightline (Florida) ---
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

const IN_STATIONS: TrainStation[] = [
  // --- Delhi NCR ---
  st('NDLS', 'New Delhi Railway Station', 'Delhi', 'Delhi', 'IN', 28.6431, 77.2197, ['indian-railways'], ['Delhi Metro Yellow & Airport Express Line', 'IGI Airport via Airport Express'], MAJOR),
  st('NZM', 'Hazrat Nizamuddin Railway Station', 'Delhi', 'Delhi', 'IN', 28.5883, 77.2545, ['indian-railways'], ['Delhi Metro Pink Line (Hazrat Nizamuddin)'], MAJOR),
  // --- Mumbai ---
  st('CSMT', 'Chhatrapati Shivaji Maharaj Terminus', 'Mumbai', 'Maharashtra', 'IN', 18.9398, 72.8355, ['indian-railways'], ['Mumbai Suburban (Central & Harbour lines)', 'Metro Line 3'], MAJOR),
  st('BCT', 'Mumbai Central', 'Mumbai', 'Maharashtra', 'IN', 18.9696, 72.8195, ['indian-railways'], ['Mumbai Suburban (Western line)', 'Metro Line 3'], MAJOR),
  // --- Metros & state capitals ---
  st('MAS', 'MGR Chennai Central', 'Chennai', 'Tamil Nadu', 'IN', 13.0827, 80.2757, ['indian-railways'], ['Chennai Metro (Blue & Green lines)', 'Chennai Suburban'], MAJOR),
  st('SBC', 'KSR Bengaluru City Junction', 'Bengaluru', 'Karnataka', 'IN', 12.9779, 77.5713, ['indian-railways'], ['Namma Metro (Green & Purple lines)'], MAJOR),
  st('HWH', 'Howrah Junction', 'Kolkata', 'West Bengal', 'IN', 22.5839, 88.3434, ['indian-railways'], ['Kolkata Metro Green Line (Howrah Maidan)', 'Hooghly ferries'], MAJOR),
  st('SC', 'Secunderabad Junction', 'Hyderabad', 'Telangana', 'IN', 17.4344, 78.5013, ['indian-railways'], ['Hyderabad Metro (Blue Line)', 'MMTS'], MAJOR),
  st('PUNE', 'Pune Junction', 'Pune', 'Maharashtra', 'IN', 18.5289, 73.8744, ['indian-railways'], ['Pune Metro', 'PMPML buses'], MAJOR),
  st('ADI', 'Ahmedabad Junction', 'Ahmedabad', 'Gujarat', 'IN', 23.0272, 72.6015, ['indian-railways'], ['Ahmedabad Metro', 'BRTS'], MAJOR),
  st('GNC', 'Gandhinagar Capital', 'Gandhinagar', 'Gujarat', 'IN', 23.223, 72.6493, ['indian-railways'], ['Hotel Leela above station', 'Ahmedabad Metro Phase 2']),
  st('JP', 'Jaipur Junction', 'Jaipur', 'Rajasthan', 'IN', 26.9196, 75.7878, ['indian-railways'], ['Jaipur Metro (Pink Line)'], MAJOR),
  st('LKO', 'Lucknow Charbagh', 'Lucknow', 'Uttar Pradesh', 'IN', 26.8312, 80.9218, ['indian-railways'], ['Lucknow Metro (Red Line)'], MAJOR),
  st('CNB', 'Kanpur Central', 'Kanpur', 'Uttar Pradesh', 'IN', 26.4536, 80.3508, ['indian-railways'], ['Kanpur Metro'], MAJOR),
  st('BPL', 'Bhopal Junction', 'Bhopal', 'Madhya Pradesh', 'IN', 23.2685, 77.4123, ['indian-railways'], ['BCLL buses'], MAJOR),
  st('RKMP', 'Rani Kamlapati Station', 'Bhopal', 'Madhya Pradesh', 'IN', 23.2233, 77.4344, ['indian-railways'], ['World-class redeveloped station', 'BCLL buses'], MAJOR),
  st('NGP', 'Nagpur Junction', 'Nagpur', 'Maharashtra', 'IN', 21.1525, 79.0821, ['indian-railways'], ['Nagpur Metro (Orange & Aqua lines)'], MAJOR),
  st('PNBE', 'Patna Junction', 'Patna', 'Bihar', 'IN', 25.6032, 85.1229, ['indian-railways'], ['Patna Metro (under construction)'], MAJOR),
  st('BBS', 'Bhubaneswar Railway Station', 'Bhubaneswar', 'Odisha', 'IN', 20.2665, 85.8438, ['indian-railways'], ['Mo Bus city services'], MAJOR),
  st('VSKP', 'Visakhapatnam Junction', 'Visakhapatnam', 'Andhra Pradesh', 'IN', 17.7228, 83.2913, ['indian-railways'], ['APSRTC buses'], MAJOR),
  // --- South ---
  st('TVC', 'Thiruvananthapuram Central', 'Thiruvananthapuram', 'Kerala', 'IN', 8.4875, 76.9525, ['indian-railways'], ['KSRTC hub adjacent'], MAJOR),
  st('ERS', 'Ernakulam Junction', 'Kochi', 'Kerala', 'IN', 9.9698, 76.2911, ['indian-railways'], ['Kochi Metro (Ernakulam South)'], MAJOR),
  st('CBE', 'Coimbatore Junction', 'Coimbatore', 'Tamil Nadu', 'IN', 10.9971, 76.9674, ['indian-railways'], ['TNSTC buses'], MAJOR),
  st('MYS', 'Mysuru Junction', 'Mysuru', 'Karnataka', 'IN', 12.3163, 76.6455, ['indian-railways'], ['KSRTC city buses']),
  st('MAO', 'Madgaon Junction', 'Goa', 'Goa', 'IN', 15.2708, 73.9797, ['indian-railways'], ['Kadamba buses', 'Dabolim Airport taxis']),
  // --- East & Northeast ---
  st('GHY', 'Guwahati Railway Station', 'Guwahati', 'Assam', 'IN', 26.1818, 91.7539, ['indian-railways'], ['ASTC buses'], MAJOR),
  st('NJP', 'New Jalpaiguri Junction', 'Siliguri', 'West Bengal', 'IN', 26.6906, 88.4285, ['indian-railways'], ['Darjeeling Himalayan Railway', 'Bagdogra Airport taxis']),
  // --- North ---
  st('JAT', 'Jammu Tawi Railway Station', 'Jammu', 'Jammu & Kashmir', 'IN', 32.7118, 74.8666, ['indian-railways'], ['JKSRTC buses'], MAJOR),
  st('SVDK', 'Shri Mata Vaishno Devi Katra', 'Katra', 'Jammu & Kashmir', 'IN', 32.9917, 74.9313, ['indian-railways'], ['Vaishno Devi yatra base', 'Helicopter bookings nearby']),
  st('ASR', 'Amritsar Junction', 'Amritsar', 'Punjab', 'IN', 31.6335, 74.8656, ['indian-railways'], ['Free Golden Temple bus'], MAJOR),
  st('CDG', 'Chandigarh Junction', 'Chandigarh', 'Chandigarh', 'IN', 30.6954, 76.8266, ['indian-railways'], ['CTU buses'], MAJOR),
  st('DDN', 'Dehradun Railway Station', 'Dehradun', 'Uttarakhand', 'IN', 30.3165, 78.0322, ['indian-railways'], ['Mussoorie taxis', 'Uttarakhand Roadways']),
  // --- UP / MP corridor ---
  st('VNS', 'Varanasi Junction', 'Varanasi', 'Uttar Pradesh', 'IN', 25.3298, 82.9862, ['indian-railways'], ['Ghats 4 km', 'UPSRTC buses'], MAJOR),
  st('PRYJ', 'Prayagraj Junction', 'Prayagraj', 'Uttar Pradesh', 'IN', 25.4443, 81.8253, ['indian-railways'], ['City buses'], MAJOR),
  st('AGC', 'Agra Cantt', 'Agra', 'Uttar Pradesh', 'IN', 27.1591, 77.9905, ['indian-railways'], ['Taj Mahal 6 km', 'UPSRTC buses'], MAJOR),
  st('GWL', 'Gwalior Junction', 'Gwalior', 'Madhya Pradesh', 'IN', 26.2124, 78.1772, ['indian-railways'], ['City buses']),
  st('VGLJ', 'Virangana Lakshmibai Jhansi Junction', 'Jhansi', 'Uttar Pradesh', 'IN', 25.4484, 78.5685, ['indian-railways'], ['Orchha taxis 16 km']),
  // --- West ---
  st('ST', 'Surat Railway Station', 'Surat', 'Gujarat', 'IN', 21.2049, 72.8411, ['indian-railways'], ['Surat BRTS'], MAJOR),
  st('BRC', 'Vadodara Junction', 'Vadodara', 'Gujarat', 'IN', 22.3105, 73.1812, ['indian-railways'], ['City buses'], MAJOR),
  st('KOTA', 'Kota Junction', 'Kota', 'Rajasthan', 'IN', 25.1792, 75.8443, ['indian-railways'], ['City buses']),
];

export const TRAIN_STATIONS: TrainStation[] = [...US_STATIONS, ...IN_STATIONS];

const byCode = new Map(TRAIN_STATIONS.map((s) => [s.code, s]));
const bySlug = new Map(TRAIN_STATIONS.map((s) => [s.slug, s]));

export function stationByCode(code: string): TrainStation | undefined {
  return byCode.get(code.toUpperCase());
}

export function stationBySlug(slug: string): TrainStation | undefined {
  return bySlug.get(slug.toLowerCase());
}

/** All stations sharing a city slug (e.g. 'delhi' → NDLS, NZM, ANVT). */
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
