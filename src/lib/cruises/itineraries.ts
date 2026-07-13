export interface ItineraryTemplate {
  id: string;
  region: string;
  title: string;
  durationNights: number;
  departurePortId: string;
  departurePortName: string;
  arrivalPortId: string;
  arrivalPortName: string;
  portsSequence: {
    portId?: string;
    portName: string;
    arrivalTime: string;
    departureTime: string;
    distanceKm: number;
    activities: string[];
    suggestedExcursions: string[];
    diningRecommendations: string[];
    eveningEntertainment: string[];
  }[];
}

export const ITINERARY_TEMPLATES: ItineraryTemplate[] = [
  // 7-Night Caribbean Itineraries
  {
    id: '7n-western-caribbean',
    region: 'Caribbean',
    title: 'Western Caribbean Fun & Sun',
    durationNights: 7,
    departurePortId: 'miami',
    departurePortName: 'Miami',
    arrivalPortId: 'miami',
    arrivalPortName: 'Miami',
    portsSequence: [
      {
        portId: 'miami',
        portName: 'Miami',
        arrivalTime: 'Embarkation',
        departureTime: '04:30 PM',
        distanceKm: 0,
        activities: ['Sailaway party on pool deck', 'Welcome buffet dinner', 'Explore ship amenities'],
        suggestedExcursions: [],
        diningRecommendations: ['Main Dining Room - Prime Rib', 'Windjammer Buffet'],
        eveningEntertainment: ['Welcome Aboard Show in Royal Theater']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 450,
        activities: ['Poolside games & sunbathing', 'Art auction', 'Onboard surf simulator classes'],
        suggestedExcursions: [],
        diningRecommendations: ['Chops Grille Steakhouse', 'Solarium Bistro'],
        eveningEntertainment: ['Broadway Musical Production', 'Casino tournament']
      },
      {
        portId: 'cozumel',
        portName: 'Cozumel',
        arrivalTime: '08:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 600,
        activities: ['Snorkeling at Palancar Reef', 'Visit ancient Mayan ruins', 'Mexican cooking class'],
        suggestedExcursions: ['Palancar Reef Catamaran & Snorkel', 'San Gervasio Mayan Ruins Tour'],
        diningRecommendations: ['Casa Mission (local fish)', 'Main Dining Room'],
        eveningEntertainment: ['Outdoor Movie under the Stars', 'Karaoke in Schooner Bar']
      },
      {
        portName: 'Roatan',
        arrivalTime: '08:00 AM',
        departureTime: '05:00 PM',
        distanceKm: 320,
        activities: ['Ziplining through tropical jungle', 'Relaxing at West Bay Beach', 'Snorkeling barrier reefs'],
        suggestedExcursions: ['Gumbalimba Park Monkeys & Zipline', 'West Bay Beach Resort Day Pass'],
        diningRecommendations: ['Bando Beach Grill', 'Main Dining Room'],
        eveningEntertainment: ['Latin Dance Night in Boleros Lounge']
      },
      {
        portName: 'Costa Maya',
        arrivalTime: '07:00 AM',
        departureTime: '04:00 PM',
        distanceKm: 180,
        activities: ['Explore Mayan Ruins of Chacchoben', 'Swim in the Blue Lagoon', 'Beach club relaxation'],
        suggestedExcursions: ['Chacchoben Mayan Ruins Guided Tour', 'All-Inclusive Beach Club Day'],
        diningRecommendations: ['Cantina El Local', 'Main Dining Room'],
        eveningEntertainment: ['Captain\'s Gala Dinner & Theater Show']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 550,
        activities: ['Spa treatments', 'Trivia contests', 'Fitness class', 'Wine tasting seminar'],
        suggestedExcursions: [],
        diningRecommendations: ['Izumi Sushi & Hibachi', 'Main Dining Room'],
        eveningEntertainment: ['Comedy Club Show', 'Farewell Glow Party on deck']
      },
      {
        portId: 'miami',
        portName: 'Miami',
        arrivalTime: '06:00 AM',
        departureTime: 'Disembarkation',
        distanceKm: 300,
        activities: ['Breakfast onboard', 'Customs clearance', 'Depart for airport'],
        suggestedExcursions: [],
        diningRecommendations: ['Park Cafe breakfast'],
        eveningEntertainment: []
      }
    ]
  },
  {
    id: '7n-eastern-caribbean',
    region: 'Caribbean',
    title: 'Eastern Caribbean Escape',
    durationNights: 7,
    departurePortId: 'fort-lauderdale',
    departurePortName: 'Fort Lauderdale',
    arrivalPortId: 'fort-lauderdale',
    arrivalPortName: 'Fort Lauderdale',
    portsSequence: [
      {
        portId: 'fort-lauderdale',
        portName: 'Fort Lauderdale',
        arrivalTime: 'Embarkation',
        departureTime: '04:00 PM',
        distanceKm: 0,
        activities: ['Embark and settle into cabins', 'Safety briefing', 'Sailaway deck party'],
        suggestedExcursions: [],
        diningRecommendations: ['Main Dining Room', 'Specialty Italian Restaurant'],
        eveningEntertainment: ['Acrobatic / Aerialist Theater Show']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 480,
        activities: ['Relaxing by the pools', 'Onboard shopping specials', 'Mini-golf tournament'],
        suggestedExcursions: [],
        diningRecommendations: ['Coastal Kitchen', 'Seafood Shack'],
        eveningEntertainment: ['Comedy Night', 'Nightclub dancing']
      },
      {
        portName: 'San Juan',
        arrivalTime: '02:00 PM',
        departureTime: '10:00 PM',
        distanceKm: 980,
        activities: ['Tour historic El Morro Fort', 'Walk the cobblestone streets of Old San Juan', 'Salsa dancing lesson'],
        suggestedExcursions: ['Old San Juan Walking Tour & El Morro Fort', 'El Yunque Rainforest Hiking Tour'],
        diningRecommendations: ['Barrachina (birthplace of Piña Colada)', 'Main Dining Room'],
        eveningEntertainment: ['Late night Salsa bar crawl', 'Movies on Deck']
      },
      {
        portName: 'St. Thomas',
        arrivalTime: '08:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 120,
        activities: ['Sunbathing at Magens Bay Beach', 'Ride tramway to Paradise Point', 'Duty-free shopping in Charlotte Amalie'],
        suggestedExcursions: ['Magens Bay Beach Escape', 'St. Thomas Island Tour & Mountaintop'],
        diningRecommendations: ['Gladys\' Cafe', 'Main Dining Room'],
        eveningEntertainment: ['Caribbean steel drum party on pool deck']
      },
      {
        portId: 'nassau',
        portName: 'Nassau',
        arrivalTime: '10:00 AM',
        departureTime: '07:00 PM',
        distanceKm: 850,
        activities: ['Visit Atlantis Waterpark', 'Climb Queen\'s Staircase', 'Straw Market shopping'],
        suggestedExcursions: ['Atlantis Aquaventure Day Pass', 'Pearl Island Beach Day & Lunch'],
        diningRecommendations: ['Graycliff Chocolatier lunch', 'Main Dining Room'],
        eveningEntertainment: ['White-Hot Deck Party', 'Adult comedy night']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 310,
        activities: ['Galley tour', 'Spa luxury massage', 'Bingo games', 'Packing bags'],
        suggestedExcursions: [],
        diningRecommendations: ['Specialty Steakhouse', 'Main Dining Room'],
        eveningEntertainment: ['Farewell Variety Show', 'Live Jazz in the lounge']
      },
      {
        portId: 'fort-lauderdale',
        portName: 'Fort Lauderdale',
        arrivalTime: '06:00 AM',
        departureTime: 'Disembarkation',
        distanceKm: 50,
        activities: ['Final breakfast', 'Express walk-off departure'],
        suggestedExcursions: [],
        diningRecommendations: ['Buffet breakfast'],
        eveningEntertainment: []
      }
    ]
  },

  // Mediterranean Itineraries
  {
    id: '7n-classic-mediterranean',
    region: 'Mediterranean',
    title: 'Classic Mediterranean Wonders',
    durationNights: 7,
    departurePortId: 'barcelona',
    departurePortName: 'Barcelona',
    arrivalPortId: 'barcelona',
    arrivalPortName: 'Barcelona',
    portsSequence: [
      {
        portId: 'barcelona',
        portName: 'Barcelona',
        arrivalTime: 'Embarkation',
        departureTime: '05:00 PM',
        distanceKm: 0,
        activities: ['Sail past Barcelona harbor front', 'Cabin check-in', 'Explore ship deck plans'],
        suggestedExcursions: [],
        diningRecommendations: ['Tapabar onboard', 'Main Dining Room'],
        eveningEntertainment: ['Welcome Aboard Gala Concert']
      },
      {
        portName: 'Cannes',
        arrivalTime: '08:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 420,
        activities: ['Walk along La Croisette boulevard', 'Take ferry to Sainte-Marguerite Island', 'Tour historic Grasse perfumeries'],
        suggestedExcursions: ['Scenic French Riviera & Monaco Tour', 'Cannes Walking Tour & Perfume Making'],
        diningRecommendations: ['Le Grain de Sel (French bistro)', 'Main Dining Room'],
        eveningEntertainment: ['Opera Under the Stars', 'Piano Bar classical music']
      },
      {
        portName: 'Genoa',
        arrivalTime: '07:00 AM',
        departureTime: '05:00 PM',
        distanceKm: 180,
        activities: ['Explore Genoa aquarium', 'Walk in the medieval old town', 'Visit palaces of Rolli'],
        suggestedExcursions: ['Historic Genoa & Aquarium Tour', 'Portofino Yacht Excursion'],
        diningRecommendations: ['Eataly Genoa lunch', 'Main Dining Room'],
        eveningEntertainment: ['Retro disco dance party']
      },
      {
        portId: 'civitavecchia',
        portName: 'La Spezia (Florence/Pisa)',
        arrivalTime: '07:00 AM',
        departureTime: '07:00 PM',
        distanceKm: 120,
        activities: ['Day trip to Florence Renaissance sights', 'See the Leaning Tower of Pisa', 'Explore Cinque Terre villages'],
        suggestedExcursions: ['Florence & Pisa in One Day Tour', 'Cinque Terre Hiking & Boat Excursion'],
        diningRecommendations: ['Trattoria in Florence', 'Main Dining Room'],
        eveningEntertainment: ['Broadway-style Magic Show']
      },
      {
        portId: 'civitavecchia',
        portName: 'Rome (Civitavecchia)',
        arrivalTime: '07:00 AM',
        departureTime: '07:00 PM',
        distanceKm: 210,
        activities: ['Visit Colosseum and Roman Forum', 'Tour Vatican City & Sistine Chapel', 'Throw coin in Trevi Fountain'],
        suggestedExcursions: ['Rome & Vatican Imperial Tour', 'Civitavecchia Castle & Wine Tasting'],
        diningRecommendations: ['Local Roman Osteria lunch', 'Main Dining Room'],
        eveningEntertainment: ['Classic Movie Night on Pool Deck']
      },
      {
        portName: 'Naples (Pompeii)',
        arrivalTime: '07:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 260,
        activities: ['Tour ruins of historic Pompeii', 'See Mount Vesuvius volcano crater', 'Enjoy authentic Neapolitan pizza'],
        suggestedExcursions: ['Pompeii Ruins & Mount Vesuvius Hike', 'Amalfi Coast Scenic Coastal Drive'],
        diningRecommendations: ['Pizzeria Brandi (Naples)', 'Main Dining Room'],
        eveningEntertainment: ['Comedy show in main theater', 'Latin dance music']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 650,
        activities: ['Spa treatments', 'Duty-free shopping spree', 'Art auction gallery', 'Farewell packing'],
        suggestedExcursions: [],
        diningRecommendations: ['Specialty French Bistro', 'Main Dining Room'],
        eveningEntertainment: ['Farewell Theater Gala Production', 'Karaoke nights']
      },
      {
        portId: 'barcelona',
        portName: 'Barcelona',
        arrivalTime: '06:00 AM',
        departureTime: 'Disembarkation',
        distanceKm: 100,
        activities: ['Final breakfast', 'Customs & bags off', 'Onward travel'],
        suggestedExcursions: [],
        diningRecommendations: ['Breakfast buffet'],
        eveningEntertainment: []
      }
    ]
  },

  // 10-Night Mediterranean / Greek Islands
  {
    id: '10n-greek-islands',
    region: 'Greek Islands',
    title: 'Aegean & Greek Islands Explorer',
    durationNights: 10,
    departurePortId: 'piraeus',
    departurePortName: 'Athens (Piraeus)',
    arrivalPortId: 'piraeus',
    arrivalPortName: 'Athens (Piraeus)',
    portsSequence: [
      {
        portId: 'piraeus',
        portName: 'Athens (Piraeus)',
        arrivalTime: 'Embarkation',
        departureTime: '06:00 PM',
        distanceKm: 0,
        activities: ['Aboard check-in', 'Welcome drink on top deck', 'Safety drills'],
        suggestedExcursions: [],
        diningRecommendations: ['Main Dining Room', 'Specialty Sushi Bar'],
        eveningEntertainment: ['Greek folklore dance show on deck']
      },
      {
        portName: 'Santorini',
        arrivalTime: '07:00 AM',
        departureTime: '08:00 PM',
        distanceKm: 230,
        activities: ['Walk historic pathways in Oia village', 'Photograph blue-domed churches', 'Wine tasting with volcano views'],
        suggestedExcursions: ['Best of Oia Village & Wine Tasting', 'Santorini Volcano Caldera Boat Tour'],
        diningRecommendations: ['Taverna Sunset (Oia)', 'Main Dining Room'],
        eveningEntertainment: ['Santorini Sunset Cocktails on Deck']
      },
      {
        portName: 'Mykonos',
        arrivalTime: '07:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 110,
        activities: ['Explore white-washed Mykonos town streets', 'See historic windmills', 'Beach party at Paradise Beach'],
        suggestedExcursions: ['Delos Island Archaeological Tour', 'Mykonos Scenic Walking & Beach Tour'],
        diningRecommendations: ['Kiki\'s Tavern (beachfront grill)', 'Main Dining Room'],
        eveningEntertainment: ['Deck poolside dance party']
      },
      {
        portName: 'Kusadasi (Ephesus)',
        arrivalTime: '08:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 190,
        activities: ['Explore ruins of ancient Ephesus city', 'See House of Virgin Mary', 'Bargain at Turkish Grand Bazaar'],
        suggestedExcursions: ['Ancient Ephesus & House of Virgin Mary Tour', 'Ephesus Terrace Houses Archaeological Walk'],
        diningRecommendations: ['Bizim Ev (local Turkish home)', 'Main Dining Room'],
        eveningEntertainment: ['Traditional Turkish night with belly dancing']
      },
      {
        portName: 'Rhodes',
        arrivalTime: '08:00 AM',
        departureTime: '05:00 PM',
        distanceKm: 170,
        activities: ['Explore medieval Palace of the Grand Master', 'Walk down Street of the Knights', 'Visit Lindos Acropolis'],
        suggestedExcursions: ['Lindos Acropolis & Medieval Town Tour', 'Palace of the Grand Master Guided Walk'],
        diningRecommendations: ['Taverna Mavrikos (Lindos)', 'Main Dining Room'],
        eveningEntertainment: ['Classic rock live band concert']
      },
      {
        portName: 'Chania (Crete)',
        arrivalTime: '08:00 AM',
        departureTime: '05:00 PM',
        distanceKm: 290,
        activities: ['Stroll around Venetian Harbor of Chania', 'Sample local cheese at public market', 'Hike Samaria Gorge'],
        suggestedExcursions: ['Chania Venetian Port and Tasting Tour', 'Ancient Aptera & Botanical Garden'],
        diningRecommendations: ['Thalassino Ageri (seafood)', 'Main Dining Room'],
        eveningEntertainment: ['Comedy night in theater']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 420,
        activities: ['Pool relaxation', 'Culinary masterclass', 'Bridge tournament'],
        suggestedExcursions: [],
        diningRecommendations: ['Chef\'s Table Dining', 'Main Dining Room'],
        eveningEntertainment: ['Magician & illusionist performance']
      },
      {
        portName: 'Dubrovnik',
        arrivalTime: '08:00 AM',
        departureTime: '07:00 PM',
        distanceKm: 850,
        activities: ['Walk historic Dubrovnik City Walls', 'Ride cable car to Mount Srd', 'See Game of Thrones filming locations'],
        suggestedExcursions: ['Dubrovnik Old Town Walls Walking Tour', 'Game of Thrones Filming Sites Walk'],
        diningRecommendations: ['Proto Fish Restaurant', 'Main Dining Room'],
        eveningEntertainment: ['Acoustic guitarist in the lounge']
      },
      {
        portName: 'Kotor',
        arrivalTime: '07:00 AM',
        departureTime: '03:00 PM',
        distanceKm: 80,
        activities: ['Sail through scenic Bay of Kotor', 'Climb Castle of San Giovanni', 'Visit old cathedrals of Kotor'],
        suggestedExcursions: ['Kotor Old Town Walking Tour', 'Our Lady of the Rocks Boat Excursion'],
        diningRecommendations: ['Galion Restaurant', 'Main Dining Room'],
        eveningEntertainment: ['Outdoor Cinema under Stars']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 580,
        activities: ['Onboard trivia', 'Duty-free trunk shows', 'Packing luggage'],
        suggestedExcursions: [],
        diningRecommendations: ['Specialty Teppanyaki', 'Main Dining Room'],
        eveningEntertainment: ['Farewell Theater Spectacular']
      },
      {
        portId: 'piraeus',
        portName: 'Athens (Piraeus)',
        arrivalTime: '06:00 AM',
        departureTime: 'Disembarkation',
        distanceKm: 200,
        activities: ['Goodbye breakfast', 'Check-out of cruise cabin'],
        suggestedExcursions: [],
        diningRecommendations: ['Buffet breakfast'],
        eveningEntertainment: []
      }
    ]
  },

  // 7-Night Alaska Itineraries
  {
    id: '7n-alaska-inside-passage',
    region: 'Alaska',
    title: 'Alaska Inside Passage Voyage',
    durationNights: 7,
    departurePortId: 'seattle-port',
    departurePortName: 'Seattle',
    arrivalPortId: 'seattle-port',
    arrivalPortName: 'Seattle',
    portsSequence: [
      {
        portId: 'seattle-port',
        portName: 'Seattle',
        arrivalTime: 'Embarkation',
        departureTime: '04:00 PM',
        distanceKm: 0,
        activities: ['Cruise orientation', 'Enjoy Seattle skyline sailaway', 'Hot tub relaxation'],
        suggestedExcursions: [],
        diningRecommendations: ['Main Dining Room', 'Poolside grill'],
        eveningEntertainment: ['Welcome Aboard musical performance']
      },
      {
        portName: 'Cruising the Inside Passage',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 620,
        activities: ['Wildlife watching (binoculars provided)', 'Alaska naturalist presentation', 'Indoor warm pool swimming'],
        suggestedExcursions: [],
        diningRecommendations: ['Specialty Seafood Restaurant', 'Main Dining Room'],
        eveningEntertainment: ['Casino slots tournament', 'Acoustic lounge music']
      },
      {
        portId: 'juneau',
        portName: 'Juneau',
        arrivalTime: '12:00 PM',
        departureTime: '10:00 PM',
        distanceKm: 580,
        activities: ['See massive Mendenhall Glacier', 'Go whale watching for humpbacks', 'Ride Goldbelt Tramway to mountain tops'],
        suggestedExcursions: ['Mendenhall Glacier & Whale Watching Combo', 'Dog Sledding on Mendenhall Glacier by Helicopter'],
        diningRecommendations: ['Tracy\'s King Crab Shack', 'Main Dining Room'],
        eveningEntertainment: ['Red Dog Saloon historic tavern drinks']
      },
      {
        portName: 'Skagway',
        arrivalTime: '07:00 AM',
        departureTime: '08:30 PM',
        distanceKm: 150,
        activities: ['Ride historic White Pass & Yukon Route Railroad', 'Explore gold rush town shops', 'Tour historical brothel saloons'],
        suggestedExcursions: ['White Pass & Yukon Route Scenic Railroad', 'Gold Rush History and Sled Dog Camp Tour'],
        diningRecommendations: ['Red Onion Saloon lunch', 'Main Dining Room'],
        eveningEntertainment: ['Naturalist Q&A', 'Trivia night in lounge']
      },
      {
        portName: 'Endicott Arm & Dawes Glacier',
        arrivalTime: '05:00 AM',
        departureTime: '10:00 AM',
        distanceKm: 180,
        activities: ['Scenic glacier fjord cruising', 'Photograph icebergs and waterfalls', 'Naturalist talks on helicopter deck'],
        suggestedExcursions: [],
        diningRecommendations: ['Observation Lounge morning hot chocolate', 'Main Dining Room'],
        eveningEntertainment: ['Outdoor Movies on deck (wrapped in blankets)']
      },
      {
        portName: 'Ketchikan',
        arrivalTime: '07:00 AM',
        departureTime: '01:00 PM',
        distanceKm: 340,
        activities: ['Visit historic Creek Street boardwalk', 'See totem poles in Saxman Native Village', 'Hike through rainforests'],
        suggestedExcursions: ['Creek Street & Totem Heritage Center Tour', 'Great Alaskan Lumberjack Show Tour'],
        diningRecommendations: ['Alaska Fish House lunch', 'Main Dining Room'],
        eveningEntertainment: ['Karaoke and piano lounge music']
      },
      {
        portName: 'Victoria (British Columbia)',
        arrivalTime: '07:30 PM',
        departureTime: '11:59 PM',
        distanceKm: 980,
        activities: ['Explore illuminated Parliament Buildings', 'Walk around Inner Harbour', 'Visit Butchart Gardens (night tour)'],
        suggestedExcursions: ['Butchart Gardens at Night Excursion', 'Historic Victoria City Highlights Tour'],
        diningRecommendations: ['Empress Hotel afternoon high tea (early dinner)', 'Main Dining Room'],
        eveningEntertainment: ['Late night DJ dance party']
      },
      {
        portId: 'seattle-port',
        portName: 'Seattle',
        arrivalTime: '06:00 AM',
        departureTime: 'Disembarkation',
        distanceKm: 120,
        activities: ['Final breakfast', 'Customs and transfer to SeaTac airport'],
        suggestedExcursions: [],
        diningRecommendations: ['Breakfast buffet'],
        eveningEntertainment: []
      }
    ]
  },

  // 7-Night Danube River Itineraries
  {
    id: '7n-danube-cruise',
    region: 'Danube River',
    title: 'Danube River Classic Itinerary',
    durationNights: 7,
    departurePortId: 'vienna-port',
    departurePortName: 'Vienna',
    arrivalPortId: 'budapest-port',
    arrivalPortName: 'Budapest',
    portsSequence: [
      {
        portId: 'vienna-port',
        portName: 'Vienna',
        arrivalTime: 'Embarkation',
        departureTime: 'Overnight',
        distanceKm: 0,
        activities: ['Embarkation on river ship', 'Welcome cocktails with Captain', 'Evening tour of illuminated Vienna'],
        suggestedExcursions: [],
        diningRecommendations: ['Fine Dining Room - Austrian Specialties'],
        eveningEntertainment: ['Private Mozart & Strauss salon concert']
      },
      {
        portId: 'vienna-port',
        portName: 'Vienna',
        arrivalTime: 'Overnight',
        departureTime: '06:00 PM',
        distanceKm: 0,
        activities: ['Tour Schönbrunn Palace', 'Sample Viennese coffee and cakes', 'Bike tour along the Ringstrasse'],
        suggestedExcursions: ['Schönbrunn Palace Tour & Royal Gardens', 'Vienna Coffee House Culture Guided Walk'],
        diningRecommendations: ['Traditional Viennese Café', 'Danube Fine Dining Room'],
        eveningEntertainment: ['Live music in lounge, cruising overnight']
      },
      {
        portName: 'Dürnstein & Melk (Wachau Valley)',
        arrivalTime: '08:00 AM',
        departureTime: '07:00 PM',
        distanceKm: 85,
        activities: ['Hike up to Dürnstein Castle ruins', 'Taste Wachau Valley apricot specialties', 'Visit magnificent Melk Abbey'],
        suggestedExcursions: ['Melk Abbey Guided Tour', 'Wachau Valley Wine Tasting & Bike Tour'],
        diningRecommendations: ['Local Gasthof lunch', 'Fine Dining Room'],
        eveningEntertainment: ['Naturalist discussion of the Wachau wine region']
      },
      {
        portName: 'Linz (Salzburg)',
        arrivalTime: '07:00 AM',
        departureTime: '08:30 PM',
        distanceKm: 120,
        activities: ['Full day trip to Salzburg (Sound of Music sights)', 'See Linz Old Town square', 'Taste Linzer Torte cake'],
        suggestedExcursions: ['Full Day Excursion to Historic Salzburg', 'Linz Walking Tour & Cake Tasting Class'],
        diningRecommendations: ['Cafe Jindrak (Linz)', 'Fine Dining Room'],
        eveningEntertainment: ['Onboard Bavarian musical trio performance']
      },
      {
        portName: 'Bratislava',
        arrivalTime: '08:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 210,
        activities: ['Walk old town center of Bratislava', 'Visit coronation cathedrals', 'Take road train to Bratislava Castle'],
        suggestedExcursions: ['Bratislava Old Town Walking Tour', 'Castle Hill & Communist History Tour'],
        diningRecommendations: ['Slovak Pub lunch', 'Fine Dining Room'],
        eveningEntertainment: ['Onboard team trivia contest']
      },
      {
        portId: 'budapest-port',
        portName: 'Budapest',
        arrivalTime: '09:00 AM',
        departureTime: 'Overnight',
        distanceKm: 130,
        activities: ['Soak in Széchenyi thermal baths', 'Walk historic Castle Hill of Buda', 'Explore Great Market Hall'],
        suggestedExcursions: ['Budapest City Highlights & Buda Castle Tour', 'Széchenyi Thermal Baths Relaxation Excursion'],
        diningRecommendations: ['Great Market Hall food stalls', 'Fine Dining Room'],
        eveningEntertainment: ['Illuminated Danube Night Cruise']
      },
      {
        portId: 'budapest-port',
        portName: 'Budapest',
        arrivalTime: 'Overnight',
        departureTime: 'Overnight',
        distanceKm: 0,
        activities: ['See Parliament building interior', 'Visit Hospital in the Rock nuclear bunker museum', 'Relax in Margitsziget park'],
        suggestedExcursions: ['Hungarian Parliament Guided Tour', 'Jewish Quarter Synagogue & Ruin Bar Tour'],
        diningRecommendations: ['Borkonyha Winekitchen dinner', 'Fine Dining Room'],
        eveningEntertainment: ['Local gypsy band music performance in lounge']
      },
      {
        portId: 'budapest-port',
        portName: 'Budapest',
        arrivalTime: '06:00 AM',
        departureTime: 'Disembarkation',
        distanceKm: 0,
        activities: ['Breakfast on ship', 'Disembark and transfer to airport'],
        suggestedExcursions: [],
        diningRecommendations: ['Breakfast buffet'],
        eveningEntertainment: []
      }
    ]
  },
  // 4-Night Bahamas Itinerary
  {
    id: '4n-bahamas-getaway',
    region: 'Bahamas',
    title: 'Bahamas Island Getaway',
    durationNights: 4,
    departurePortId: 'miami',
    departurePortName: 'Miami',
    arrivalPortId: 'miami',
    arrivalPortName: 'Miami',
    portsSequence: [
      {
        portId: 'miami',
        portName: 'Miami',
        arrivalTime: 'Embarkation',
        departureTime: '05:00 PM',
        distanceKm: 0,
        activities: ['Sailaway deck party', 'Cabin check-in', 'Muster safety drill'],
        suggestedExcursions: [],
        diningRecommendations: ['Main Dining Room', 'Lido Buffet'],
        eveningEntertainment: ['Welcome Aboard Show']
      },
      {
        portId: 'nassau',
        portName: 'Nassau',
        arrivalTime: '08:00 AM',
        departureTime: '05:00 PM',
        distanceKm: 290,
        activities: ['Aquaventure water park day pass', 'Climb the Queen\'s Staircase', 'Straw Market shopping'],
        suggestedExcursions: ['Atlantis Aquaventure Day Pass', 'Blue Lagoon Island Beach Escape'],
        diningRecommendations: ['Twin Brothers Fish Fry', 'Main Dining Room'],
        eveningEntertainment: ['Caribbean steel drum deck party']
      },
      {
        portName: 'Half Moon Cay (Private Island)',
        arrivalTime: '08:00 AM',
        departureTime: '04:00 PM',
        distanceKm: 220,
        activities: ['Relax on private-island beach', 'Snorkeling off the sandbar', 'Horseback riding on the beach'],
        suggestedExcursions: ['Private Island Beach Cabana Rental', 'Glass-Bottom Kayak Tour'],
        diningRecommendations: ['Beach BBQ Grill', 'Main Dining Room'],
        eveningEntertainment: ['Sail-away sunset party on deck']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 480,
        activities: ['Pool games and trivia', 'Spa treatments', 'Farewell packing'],
        suggestedExcursions: [],
        diningRecommendations: ['Specialty Steakhouse', 'Main Dining Room'],
        eveningEntertainment: ['Farewell Variety Show']
      },
      {
        portId: 'miami',
        portName: 'Miami',
        arrivalTime: '06:00 AM',
        departureTime: 'Disembarkation',
        distanceKm: 0,
        activities: ['Final breakfast', 'Customs clearance'],
        suggestedExcursions: [],
        diningRecommendations: ['Breakfast buffet'],
        eveningEntertainment: []
      }
    ]
  },

  // 7-Night Northern Europe Itinerary
  {
    id: '7n-northern-europe-highlights',
    region: 'Northern Europe',
    title: 'Northern Europe Capitals',
    durationNights: 7,
    departurePortId: 'southampton',
    departurePortName: 'Southampton',
    arrivalPortId: 'southampton',
    arrivalPortName: 'Southampton',
    portsSequence: [
      {
        portId: 'southampton',
        portName: 'Southampton',
        arrivalTime: 'Embarkation',
        departureTime: '05:00 PM',
        distanceKm: 0,
        activities: ['Cabin check-in', 'Ship orientation tour', 'Safety muster drill'],
        suggestedExcursions: [],
        diningRecommendations: ['Main Dining Room', 'Pub-style gastro bar'],
        eveningEntertainment: ['Welcome Aboard Show']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 520,
        activities: ['Afternoon tea service', 'Deck quoits tournament', 'Enrichment lecture on Dutch history'],
        suggestedExcursions: [],
        diningRecommendations: ['Specialty Grill', 'Main Dining Room'],
        eveningEntertainment: ['West End style theater production']
      },
      {
        portId: 'amsterdam-port',
        portName: 'Amsterdam',
        arrivalTime: '07:00 AM',
        departureTime: '11:00 PM',
        distanceKm: 590,
        activities: ['Canal boat cruise', 'Visit the Van Gogh Museum', 'Cycle through the Jordaan district'],
        suggestedExcursions: ['Amsterdam Canal Cruise & Rijksmuseum Tour', 'Windmills of Zaanse Schans Day Trip'],
        diningRecommendations: ['Rijks restaurant', 'Main Dining Room'],
        eveningEntertainment: ['Overnight in port - optional shore nightlife']
      },
      {
        portName: 'Hamburg',
        arrivalTime: '08:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 460,
        activities: ['Explore the historic Speicherstadt warehouse district', 'Tour Elbphilharmonie concert hall', 'Harbor boat tour'],
        suggestedExcursions: ['Speicherstadt & Warehouse District Walking Tour', 'Hamburg Harbor Boat Cruise'],
        diningRecommendations: ['Fischmarkt seafood stalls', 'Main Dining Room'],
        eveningEntertainment: ['Comedy Club Show']
      },
      {
        portName: 'Zeebrugge (Bruges)',
        arrivalTime: '07:00 AM',
        departureTime: '07:00 PM',
        distanceKm: 380,
        activities: ['Canal boat tour of medieval Bruges', 'Belgian chocolate and beer tasting', 'Climb the Belfry of Bruges'],
        suggestedExcursions: ['Bruges Canals & Old Town Tour', 'Belgian Beer & Chocolate Tasting Tour'],
        diningRecommendations: ['Bruges chocolate house cafe', 'Main Dining Room'],
        eveningEntertainment: ['Live jazz trio in the lounge']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 410,
        activities: ['Culinary demonstration', 'Bridge and card tournaments', 'Farewell packing'],
        suggestedExcursions: [],
        diningRecommendations: ['Chef\'s Table Dining', 'Main Dining Room'],
        eveningEntertainment: ['Farewell Gala Show']
      },
      {
        portId: 'southampton',
        portName: 'Southampton',
        arrivalTime: '06:00 AM',
        departureTime: 'Disembarkation',
        distanceKm: 260,
        activities: ['Final breakfast', 'Customs & departure transfers'],
        suggestedExcursions: [],
        diningRecommendations: ['Breakfast buffet'],
        eveningEntertainment: []
      }
    ]
  },

  // 7-Night Baltic Sea Itinerary
  {
    id: '7n-baltic-capitals',
    region: 'Baltic Sea',
    title: 'Baltic Sea Capitals Explorer',
    durationNights: 7,
    departurePortId: 'copenhagen-port',
    departurePortName: 'Copenhagen',
    arrivalPortId: 'copenhagen-port',
    arrivalPortName: 'Copenhagen',
    portsSequence: [
      {
        portId: 'copenhagen-port',
        portName: 'Copenhagen',
        arrivalTime: 'Embarkation',
        departureTime: '06:00 PM',
        distanceKm: 0,
        activities: ['Explore Nyhavn before boarding', 'Cabin check-in', 'Safety muster drill'],
        suggestedExcursions: [],
        diningRecommendations: ['Main Dining Room', 'Smørrebrød tasting station'],
        eveningEntertainment: ['Welcome Aboard Show']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 480,
        activities: ['Scandinavian design lecture', 'Sauna and spa relaxation', 'Deck games'],
        suggestedExcursions: [],
        diningRecommendations: ['Nordic Specialty Restaurant', 'Main Dining Room'],
        eveningEntertainment: ['Live piano lounge']
      },
      {
        portName: 'Stockholm',
        arrivalTime: '07:00 AM',
        departureTime: '11:00 PM',
        distanceKm: 520,
        activities: ['Explore Gamla Stan old town', 'Tour the Vasa Museum', 'Boat tour of the Stockholm archipelago'],
        suggestedExcursions: ['Vasa Museum & Gamla Stan Walking Tour', 'Stockholm Archipelago Boat Excursion'],
        diningRecommendations: ['Meatballs for the People', 'Main Dining Room'],
        eveningEntertainment: ['Overnight in port - optional shore excursion']
      },
      {
        portName: 'Helsinki',
        arrivalTime: '08:00 AM',
        departureTime: '05:00 PM',
        distanceKm: 390,
        activities: ['Visit the Rock Church (Temppeliaukio)', 'Explore Market Square', 'Design District shopping'],
        suggestedExcursions: ['Helsinki City Highlights Tour', 'Suomenlinna Sea Fortress Excursion'],
        diningRecommendations: ['Ravintola Nokka', 'Main Dining Room'],
        eveningEntertainment: ['Trivia night in the lounge']
      },
      {
        portName: 'Tallinn',
        arrivalTime: '07:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 85,
        activities: ['Walk the medieval Tallinn Old Town walls', 'Visit Alexander Nevsky Cathedral', 'Sample Estonian craft beer'],
        suggestedExcursions: ['Tallinn Medieval Old Town Walking Tour', 'Kadriorg Palace & Park Excursion'],
        diningRecommendations: ['Olde Hansa medieval tavern', 'Main Dining Room'],
        eveningEntertainment: ['Baltic folklore performance on deck']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 430,
        activities: ['Amber jewelry workshop', 'Farewell packing', 'Art auction'],
        suggestedExcursions: [],
        diningRecommendations: ['Specialty Seafood Restaurant', 'Main Dining Room'],
        eveningEntertainment: ['Farewell Gala Show']
      },
      {
        portId: 'copenhagen-port',
        portName: 'Copenhagen',
        arrivalTime: '06:00 AM',
        departureTime: 'Disembarkation',
        distanceKm: 480,
        activities: ['Final breakfast', 'Customs & departure transfers'],
        suggestedExcursions: [],
        diningRecommendations: ['Breakfast buffet'],
        eveningEntertainment: []
      }
    ]
  },

  // 7-Night Norwegian Fjords Itinerary
  {
    id: '7n-norwegian-fjords',
    region: 'Norwegian Fjords',
    title: 'Norwegian Fjords Scenic Voyage',
    durationNights: 7,
    departurePortId: 'southampton',
    departurePortName: 'Southampton',
    arrivalPortId: 'southampton',
    arrivalPortName: 'Southampton',
    portsSequence: [
      {
        portId: 'southampton',
        portName: 'Southampton',
        arrivalTime: 'Embarkation',
        departureTime: '05:00 PM',
        distanceKm: 0,
        activities: ['Cabin check-in', 'Ship orientation', 'Safety muster drill'],
        suggestedExcursions: [],
        diningRecommendations: ['Main Dining Room', 'Observation Lounge cafe'],
        eveningEntertainment: ['Welcome Aboard Show']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 750,
        activities: ['Fjord photography workshop', 'Norwegian history lecture', 'Sauna relaxation'],
        suggestedExcursions: [],
        diningRecommendations: ['Nordic Specialty Restaurant', 'Main Dining Room'],
        eveningEntertainment: ['Live folk music trio']
      },
      {
        portName: 'Bergen',
        arrivalTime: '08:00 AM',
        departureTime: '05:00 PM',
        distanceKm: 460,
        activities: ['Ride the Fløibanen funicular for panoramic views', 'Explore the Bryggen Hanseatic wharf', 'Browse the historic Fish Market'],
        suggestedExcursions: ['Fløibanen Funicular & City Highlights', 'Norway in a Nutshell Rail Excursion'],
        diningRecommendations: ['Bryggeloftet & Stuene', 'Main Dining Room'],
        eveningEntertainment: ['Northern Lights lecture (seasonal)']
      },
      {
        portName: 'Geirangerfjord',
        arrivalTime: '07:00 AM',
        departureTime: '02:00 PM',
        distanceKm: 320,
        activities: ['Scenic sailing past the Seven Sisters waterfall', 'Kayaking on the fjord', 'Hike to the Eagle\'s Bend viewpoint'],
        suggestedExcursions: ['Geirangerfjord Kayak Adventure', 'Eagle Road & Dalsnibba Viewpoint Excursion'],
        diningRecommendations: ['Fjord-view Observation Deck lunch', 'Main Dining Room'],
        eveningEntertainment: ['Naturalist commentary during scenic cruising']
      },
      {
        portName: 'Ålesund',
        arrivalTime: '08:00 AM',
        departureTime: '04:00 PM',
        distanceKm: 110,
        activities: ['Explore Art Nouveau architecture', 'Climb Aksla viewpoint stairs', 'Visit the Atlantic Sea Park aquarium'],
        suggestedExcursions: ['Ålesund Art Nouveau Walking Tour', 'Aksla Viewpoint Hike'],
        diningRecommendations: ['Sjøbua Restaurant', 'Main Dining Room'],
        eveningEntertainment: ['Comedy night in the theater']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 780,
        activities: ['Farewell packing', 'Spa treatments', 'Trivia contest'],
        suggestedExcursions: [],
        diningRecommendations: ['Specialty Seafood Restaurant', 'Main Dining Room'],
        eveningEntertainment: ['Farewell Gala Show']
      },
      {
        portId: 'southampton',
        portName: 'Southampton',
        arrivalTime: '06:00 AM',
        departureTime: 'Disembarkation',
        distanceKm: 620,
        activities: ['Final breakfast', 'Customs & departure transfers'],
        suggestedExcursions: [],
        diningRecommendations: ['Breakfast buffet'],
        eveningEntertainment: []
      }
    ]
  },

  // 7-Night Western Europe Itinerary
  {
    id: '7n-western-europe-coastal',
    region: 'Western Europe',
    title: 'Western Europe Coastal Discovery',
    durationNights: 7,
    departurePortId: 'southampton',
    departurePortName: 'Southampton',
    arrivalPortId: 'southampton',
    arrivalPortName: 'Southampton',
    portsSequence: [
      {
        portId: 'southampton',
        portName: 'Southampton',
        arrivalTime: 'Embarkation',
        departureTime: '05:00 PM',
        distanceKm: 0,
        activities: ['Cabin check-in', 'Ship orientation', 'Safety muster drill'],
        suggestedExcursions: [],
        diningRecommendations: ['Main Dining Room', 'Wine bar tasting flight'],
        eveningEntertainment: ['Welcome Aboard Show']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 540,
        activities: ['Wine tasting seminar', 'Enrichment lecture on Iberian history', 'Deck yoga class'],
        suggestedExcursions: [],
        diningRecommendations: ['Specialty Steakhouse', 'Main Dining Room'],
        eveningEntertainment: ['Broadway-style musical production']
      },
      {
        portName: 'Bordeaux (Le Verdon)',
        arrivalTime: '07:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 660,
        activities: ['Tour a Médoc vineyard chateau', 'Explore the Cité du Vin museum', 'Stroll Place de la Bourse'],
        suggestedExcursions: ['Médoc Vineyard & Wine Tasting Tour', 'Bordeaux City Highlights Tour'],
        diningRecommendations: ['Le Bordeaux by Gordon Ramsay', 'Main Dining Room'],
        eveningEntertainment: ['French cabaret show']
      },
      {
        portName: 'Bilbao',
        arrivalTime: '08:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 350,
        activities: ['Tour the Guggenheim Museum Bilbao', 'Walk the Casco Viejo old quarter', 'Pintxos tasting crawl'],
        suggestedExcursions: ['Guggenheim Museum Guided Tour', 'Basque Pintxos Food Walking Tour'],
        diningRecommendations: ['Mercado de la Ribera stalls', 'Main Dining Room'],
        eveningEntertainment: ['Flamenco-inspired dance performance']
      },
      {
        portName: 'Lisbon',
        arrivalTime: '07:00 AM',
        departureTime: '07:00 PM',
        distanceKm: 610,
        activities: ['Ride historic Tram 28 through Alfama', 'Visit the Belém Tower and Jerónimos Monastery', 'Taste pastéis de nata'],
        suggestedExcursions: ['Alfama & Belém Historic District Tour', 'Sintra Palaces Day Trip'],
        diningRecommendations: ['Time Out Market Lisboa', 'Main Dining Room'],
        eveningEntertainment: ['Live Fado music performance']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 900,
        activities: ['Farewell packing', 'Culinary masterclass', 'Art auction'],
        suggestedExcursions: [],
        diningRecommendations: ['Chef\'s Table Dining', 'Main Dining Room'],
        eveningEntertainment: ['Farewell Gala Show']
      },
      {
        portId: 'southampton',
        portName: 'Southampton',
        arrivalTime: '06:00 AM',
        departureTime: 'Disembarkation',
        distanceKm: 480,
        activities: ['Final breakfast', 'Customs & departure transfers'],
        suggestedExcursions: [],
        diningRecommendations: ['Breakfast buffet'],
        eveningEntertainment: []
      }
    ]
  },

  // 7-Night British Isles Itinerary
  {
    id: '7n-british-isles',
    region: 'British Isles',
    title: 'British Isles Circumnavigation',
    durationNights: 7,
    departurePortId: 'southampton',
    departurePortName: 'Southampton',
    arrivalPortId: 'southampton',
    arrivalPortName: 'Southampton',
    portsSequence: [
      {
        portId: 'southampton',
        portName: 'Southampton',
        arrivalTime: 'Embarkation',
        departureTime: '05:00 PM',
        distanceKm: 0,
        activities: ['Cabin check-in', 'Ship orientation', 'Safety muster drill'],
        suggestedExcursions: [],
        diningRecommendations: ['Main Dining Room', 'Traditional afternoon tea'],
        eveningEntertainment: ['Welcome Aboard Show']
      },
      {
        portName: 'Cork (Cobh)',
        arrivalTime: '08:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 480,
        activities: ['Visit the Titanic Experience Cobh', 'Tour Blarney Castle and kiss the Blarney Stone', 'Explore colorful Cobh waterfront'],
        suggestedExcursions: ['Blarney Castle & Cork City Tour', 'Titanic Trail Walking Tour'],
        diningRecommendations: ['The English Market stalls', 'Main Dining Room'],
        eveningEntertainment: ['Traditional Irish music session']
      },
      {
        portName: 'Dublin',
        arrivalTime: '07:00 AM',
        departureTime: '07:00 PM',
        distanceKm: 260,
        activities: ['Tour the Guinness Storehouse', 'Visit Trinity College and the Book of Kells', 'Walk Temple Bar district'],
        suggestedExcursions: ['Guinness Storehouse & City Highlights Tour', 'Cliffs of Moher Day Trip'],
        diningRecommendations: ['The Brazen Head (Ireland\'s oldest pub)', 'Main Dining Room'],
        eveningEntertainment: ['Irish folk dance show']
      },
      {
        portName: 'Belfast',
        arrivalTime: '08:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 170,
        activities: ['Visit the Titanic Belfast museum', 'Drive the Giant\'s Causeway coastal route', 'Explore Belfast\'s political murals'],
        suggestedExcursions: ['Titanic Belfast & Giant\'s Causeway Tour', 'Game of Thrones Filming Locations Tour'],
        diningRecommendations: ['St George\'s Market stalls', 'Main Dining Room'],
        eveningEntertainment: ['Comedy night in the theater']
      },
      {
        portName: 'Glasgow (Greenock)',
        arrivalTime: '07:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 220,
        activities: ['Explore Glasgow\'s Kelvingrove Art Gallery', 'Day trip to Loch Lomond', 'Walk the Merchant City district'],
        suggestedExcursions: ['Loch Lomond & The Trossachs Day Trip', 'Glasgow City Highlights Tour'],
        diningRecommendations: ['The Ubiquitous Chip', 'Main Dining Room'],
        eveningEntertainment: ['Scottish bagpipe and Highland dance performance']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 650,
        activities: ['Whisky tasting seminar', 'Farewell packing', 'Trivia contest'],
        suggestedExcursions: [],
        diningRecommendations: ['Specialty Steakhouse', 'Main Dining Room'],
        eveningEntertainment: ['Farewell Gala Show']
      },
      {
        portId: 'southampton',
        portName: 'Southampton',
        arrivalTime: '06:00 AM',
        departureTime: 'Disembarkation',
        distanceKm: 380,
        activities: ['Final breakfast', 'Customs & departure transfers'],
        suggestedExcursions: [],
        diningRecommendations: ['Breakfast buffet'],
        eveningEntertainment: []
      }
    ]
  },
  // 7-Night Hawaii Itinerary
  {
    id: '7n-hawaii-island-hopper',
    region: 'Hawaii',
    title: 'Hawaiian Islands Interisland Voyage',
    durationNights: 7,
    departurePortId: 'honolulu',
    departurePortName: 'Honolulu',
    arrivalPortId: 'honolulu',
    arrivalPortName: 'Honolulu',
    portsSequence: [
      {
        portId: 'honolulu',
        portName: 'Honolulu',
        arrivalTime: 'Embarkation',
        departureTime: 'Overnight',
        distanceKm: 0,
        activities: ['Cabin check-in', 'Sunset views over Waikiki', 'Safety muster drill'],
        suggestedExcursions: [],
        diningRecommendations: ['Main Dining Room', 'Poolside grill'],
        eveningEntertainment: ['Welcome Aboard Hawaiian musical revue']
      },
      {
        portName: 'Kahului (Maui)',
        arrivalTime: '08:00 AM',
        departureTime: 'Overnight',
        distanceKm: 165,
        activities: ['Drive the Road to Hana', 'Watch the sunrise from Haleakalā summit', 'Snorkel Molokini Crater'],
        suggestedExcursions: ['Road to Hana Rainforest Tour', 'Molokini Crater Snorkel Cruise'],
        diningRecommendations: ['Mama\'s Fish House', 'Main Dining Room'],
        eveningEntertainment: ['Traditional luau on deck']
      },
      {
        portName: 'Hilo (Big Island)',
        arrivalTime: '08:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 190,
        activities: ['Tour Hawaii Volcanoes National Park', 'Visit Rainbow Falls', 'Explore Hilo\'s farmers market'],
        suggestedExcursions: ['Hawaii Volcanoes National Park Tour', 'Waterfalls & Rainforest Excursion'],
        diningRecommendations: ['Hilo Bay Cafe', 'Main Dining Room'],
        eveningEntertainment: ['Volcano naturalist lecture']
      },
      {
        portName: 'Kona (Big Island)',
        arrivalTime: '07:00 AM',
        departureTime: '05:00 PM',
        distanceKm: 120,
        activities: ['Snorkel with manta rays', 'Tour a Kona coffee farm', 'Visit Pu\'uhonua o Hōnaunau historical park'],
        suggestedExcursions: ['Manta Ray Night Snorkel', 'Kona Coffee Farm Tour'],
        diningRecommendations: ['Da Poke Shack', 'Main Dining Room'],
        eveningEntertainment: ['Stargazing on deck']
      },
      {
        portName: 'Nawiliwili (Kauai)',
        arrivalTime: '07:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 280,
        activities: ['Hike the Nā Pali Coast trails', 'Boat tour of Wailua River', 'Visit Waimea Canyon (Grand Canyon of the Pacific)'],
        suggestedExcursions: ['Nā Pali Coast Boat & Snorkel Tour', 'Waimea Canyon & Waterfalls Tour'],
        diningRecommendations: ['Duke\'s Kauai', 'Main Dining Room'],
        eveningEntertainment: ['Slack-key guitar performance']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 170,
        activities: ['Lei-making class', 'Hula dance lesson', 'Farewell packing'],
        suggestedExcursions: [],
        diningRecommendations: ['Specialty Pacific Rim Restaurant', 'Main Dining Room'],
        eveningEntertainment: ['Farewell Polynesian Show']
      },
      {
        portId: 'honolulu',
        portName: 'Honolulu',
        arrivalTime: '06:00 AM',
        departureTime: 'Disembarkation',
        distanceKm: 0,
        activities: ['Final breakfast', 'Customs & departure transfers'],
        suggestedExcursions: [],
        diningRecommendations: ['Breakfast buffet'],
        eveningEntertainment: []
      }
    ]
  },

  // 7-Night Mexican Riviera Itinerary
  {
    id: '7n-mexican-riviera',
    region: 'Mexican Riviera',
    title: 'Mexican Riviera Sun Escape',
    durationNights: 7,
    departurePortId: 'los-angeles-port',
    departurePortName: 'Los Angeles',
    arrivalPortId: 'los-angeles-port',
    arrivalPortName: 'Los Angeles',
    portsSequence: [
      {
        portId: 'los-angeles-port',
        portName: 'Los Angeles',
        arrivalTime: 'Embarkation',
        departureTime: '05:00 PM',
        distanceKm: 0,
        activities: ['Cabin check-in', 'Sailaway deck party', 'Safety muster drill'],
        suggestedExcursions: [],
        diningRecommendations: ['Main Dining Room', 'Poolside taco bar'],
        eveningEntertainment: ['Welcome Aboard Show']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 640,
        activities: ['Salsa dance class', 'Poolside movie screening', 'Margarita tasting seminar'],
        suggestedExcursions: [],
        diningRecommendations: ['Specialty Mexican Cantina', 'Main Dining Room'],
        eveningEntertainment: ['Latin dance night']
      },
      {
        portName: 'Cabo San Lucas',
        arrivalTime: '08:00 AM',
        departureTime: '05:00 PM',
        distanceKm: 1120,
        activities: ['Snorkel at Lover\'s Beach', 'Boat tour past El Arco rock formation', 'Zipline through desert canyons'],
        suggestedExcursions: ['El Arco Glass-Bottom Boat Tour', 'Sierra de la Laguna Zipline Adventure'],
        diningRecommendations: ['Mama\'s Royal Cafe', 'Main Dining Room'],
        eveningEntertainment: ['Mariachi band performance on deck']
      },
      {
        portName: 'Mazatlán',
        arrivalTime: '07:00 AM',
        departureTime: '05:00 PM',
        distanceKm: 280,
        activities: ['Walk the historic Old Town (Centro Histórico)', 'Ride the Mazatlán cable car', 'Surf lessons at Playa Olas Altas'],
        suggestedExcursions: ['Old Mazatlán Historic Walking Tour', 'Stone Island Beach Escape'],
        diningRecommendations: ['El Presidio', 'Main Dining Room'],
        eveningEntertainment: ['Beach bonfire party (weather permitting)']
      },
      {
        portName: 'Puerto Vallarta',
        arrivalTime: '07:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 220,
        activities: ['Explore the Malecón boardwalk', 'Zip-line through the Sierra Madre jungle', 'Sample street tacos in Zona Romántica'],
        suggestedExcursions: ['Sierra Madre Jungle Zipline & ATV Tour', 'Malecón & Old Town Walking Tour'],
        diningRecommendations: ['Fredy\'s Tucan', 'Main Dining Room'],
        eveningEntertainment: ['Traditional Mexican folkloric dance show']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 1250,
        activities: ['Farewell packing', 'Spa treatments', 'Trivia contest'],
        suggestedExcursions: [],
        diningRecommendations: ['Specialty Steakhouse', 'Main Dining Room'],
        eveningEntertainment: ['Farewell Gala Show']
      },
      {
        portId: 'los-angeles-port',
        portName: 'Los Angeles',
        arrivalTime: '06:00 AM',
        departureTime: 'Disembarkation',
        distanceKm: 0,
        activities: ['Final breakfast', 'Customs & departure transfers'],
        suggestedExcursions: [],
        diningRecommendations: ['Breakfast buffet'],
        eveningEntertainment: []
      }
    ]
  },

  // 14-Night Panama Canal Itinerary
  {
    id: '14n-panama-canal-transit',
    region: 'Panama Canal',
    title: 'Panama Canal Full Transit',
    durationNights: 14,
    departurePortId: 'fort-lauderdale',
    departurePortName: 'Fort Lauderdale',
    arrivalPortId: 'los-angeles-port',
    arrivalPortName: 'Los Angeles',
    portsSequence: [
      {
        portId: 'fort-lauderdale',
        portName: 'Fort Lauderdale',
        arrivalTime: 'Embarkation',
        departureTime: '05:00 PM',
        distanceKm: 0,
        activities: ['Cabin check-in', 'Sailaway deck party', 'Safety muster drill'],
        suggestedExcursions: [],
        diningRecommendations: ['Main Dining Room', 'Specialty Steakhouse'],
        eveningEntertainment: ['Welcome Aboard Show']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 780,
        activities: ['Panama Canal history lecture', 'Poolside trivia', 'Spa treatments'],
        suggestedExcursions: [],
        diningRecommendations: ['Specialty Grill', 'Main Dining Room'],
        eveningEntertainment: ['Broadway-style theater production']
      },
      {
        portName: 'Cartagena',
        arrivalTime: '08:00 AM',
        departureTime: '05:00 PM',
        distanceKm: 610,
        activities: ['Walk the walled Old City', 'Visit Castillo San Felipe de Barajas fortress', 'Shop for emeralds in Getsemaní'],
        suggestedExcursions: ['Old City & Fortress Walking Tour', 'Rosario Islands Beach Excursion'],
        diningRecommendations: ['La Cevicheria', 'Main Dining Room'],
        eveningEntertainment: ['Colombian salsa dance party']
      },
      {
        portName: 'Panama Canal Transit (Gatún Locks)',
        arrivalTime: '06:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 350,
        activities: ['Daylight full transit of the Panama Canal locks', 'Canal engineering lecture on deck', 'Photograph the Gatún and Miraflores Locks'],
        suggestedExcursions: ['Panama Canal Partial Transit & Rainforest Tour'],
        diningRecommendations: ['Observation Deck lunch buffet', 'Main Dining Room'],
        eveningEntertainment: ['Canal transit commentary from the bridge']
      },
      {
        portName: 'Puerto Limón (Costa Rica)',
        arrivalTime: '07:00 AM',
        departureTime: '05:00 PM',
        distanceKm: 480,
        activities: ['Zip-line through cloud forest canopy', 'Spot sloths and monkeys on a rainforest hike', 'Tour a banana and cacao plantation'],
        suggestedExcursions: ['Rainforest Aerial Tram & Zipline Tour', 'Tortuguero Canals Wildlife Cruise'],
        diningRecommendations: ['Soda Miss Isma', 'Main Dining Room'],
        eveningEntertainment: ['Costa Rican folkloric show']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 1150,
        activities: ['Culinary masterclass', 'Bridge tournament', 'Enrichment lecture on Central American culture'],
        suggestedExcursions: [],
        diningRecommendations: ['Chef\'s Table Dining', 'Main Dining Room'],
        eveningEntertainment: ['Comedy Club Show']
      },
      {
        portName: 'Puerto Chiapas',
        arrivalTime: '08:00 AM',
        departureTime: '05:00 PM',
        distanceKm: 890,
        activities: ['Tour a coffee plantation in the highlands', 'Visit Mayan ruins at Izapa', 'Relax on Playa Linda beach'],
        suggestedExcursions: ['Coffee Plantation & Highlands Tour', 'Izapa Archaeological Site Tour'],
        diningRecommendations: ['Restaurante Las Palmas', 'Main Dining Room'],
        eveningEntertainment: ['Mexican mariachi performance']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 680,
        activities: ['Fitness bootcamp on deck', 'Wine tasting seminar', 'Art auction'],
        suggestedExcursions: [],
        diningRecommendations: ['Specialty Seafood Restaurant', 'Main Dining Room'],
        eveningEntertainment: ['Casino tournament night']
      },
      {
        portName: 'Cabo San Lucas',
        arrivalTime: '08:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 1080,
        activities: ['Snorkel at Lover\'s Beach', 'Boat tour past El Arco', 'Deep-sea sportfishing excursion'],
        suggestedExcursions: ['El Arco Glass-Bottom Boat Tour', 'Deep-Sea Sportfishing Charter'],
        diningRecommendations: ['Mama\'s Royal Cafe', 'Main Dining Room'],
        eveningEntertainment: ['Sunset deck party']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 640,
        activities: ['Farewell packing', 'Spa treatments', 'Trivia contest'],
        suggestedExcursions: [],
        diningRecommendations: ['Specialty Steakhouse', 'Main Dining Room'],
        eveningEntertainment: ['Farewell Gala Show']
      },
      {
        portName: 'Ensenada',
        arrivalTime: '08:00 AM',
        departureTime: '05:00 PM',
        distanceKm: 950,
        activities: ['Taste wines in the Valle de Guadalupe', 'Visit La Bufadora marine geyser', 'Stroll Avenida Lopez Mateos'],
        suggestedExcursions: ['Valle de Guadalupe Wine Tasting Tour', 'La Bufadora Coastal Excursion'],
        diningRecommendations: ['Mariscos El Guero', 'Main Dining Room'],
        eveningEntertainment: ['Final night casino tournament']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 240,
        activities: ['Final packing', 'Farewell brunch prep', 'Onboard credit shopping specials'],
        suggestedExcursions: [],
        diningRecommendations: ['Main Dining Room'],
        eveningEntertainment: ['Farewell Variety Show']
      },
      {
        portId: 'los-angeles-port',
        portName: 'Los Angeles',
        arrivalTime: '06:00 AM',
        departureTime: 'Disembarkation',
        distanceKm: 190,
        activities: ['Final breakfast', 'Customs & departure transfers'],
        suggestedExcursions: [],
        diningRecommendations: ['Breakfast buffet'],
        eveningEntertainment: []
      }
    ]
  },

  // 10-Night South America Itinerary
  {
    id: '10n-south-america-explorer',
    region: 'South America',
    title: 'South America Coastal Explorer',
    durationNights: 10,
    departurePortId: 'buenos-aires-port',
    departurePortName: 'Buenos Aires',
    arrivalPortId: 'buenos-aires-port',
    arrivalPortName: 'Buenos Aires',
    portsSequence: [
      {
        portId: 'buenos-aires-port',
        portName: 'Buenos Aires',
        arrivalTime: 'Embarkation',
        departureTime: 'Overnight',
        distanceKm: 0,
        activities: ['Watch a live tango show before boarding', 'Cabin check-in', 'Safety muster drill'],
        suggestedExcursions: [],
        diningRecommendations: ['Main Dining Room', 'Argentine Steakhouse'],
        eveningEntertainment: ['Welcome Aboard Tango Performance']
      },
      {
        portName: 'Montevideo',
        arrivalTime: '08:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 210,
        activities: ['Walk the Ciudad Vieja old town', 'Visit the Mercado del Puerto', 'Explore Rambla waterfront promenade'],
        suggestedExcursions: ['Montevideo City Highlights Tour', 'Colonia del Sacramento Day Trip'],
        diningRecommendations: ['Mercado del Puerto grill stalls', 'Main Dining Room'],
        eveningEntertainment: ['Uruguayan candombe drum performance']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 980,
        activities: ['Enrichment lecture on Patagonian wildlife', 'Deck stretching class', 'Wine tasting seminar'],
        suggestedExcursions: [],
        diningRecommendations: ['Specialty Grill', 'Main Dining Room'],
        eveningEntertainment: ['South American folk dance show']
      },
      {
        portName: 'Puerto Madryn',
        arrivalTime: '08:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 620,
        activities: ['Whale watching in Golfo Nuevo (seasonal)', 'Visit the Punta Tombo penguin colony', 'Explore the Peninsula Valdés wildlife reserve'],
        suggestedExcursions: ['Peninsula Valdés Wildlife Safari', 'Southern Right Whale Watching Excursion'],
        diningRecommendations: ['Placido Restaurant', 'Main Dining Room'],
        eveningEntertainment: ['Patagonia naturalist lecture']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 850,
        activities: ['Photography workshop on deck', 'Bridge tournament', 'Spa treatments'],
        suggestedExcursions: [],
        diningRecommendations: ['Chef\'s Table Dining', 'Main Dining Room'],
        eveningEntertainment: ['Comedy Club Show']
      },
      {
        portId: 'ushuaia-port',
        portName: 'Ushuaia',
        arrivalTime: '07:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 1080,
        activities: ['Hike in Tierra del Fuego National Park', 'Sail the Beagle Channel spotting sea lions', 'Visit the End of the World Museum'],
        suggestedExcursions: ['Tierra del Fuego National Park Hike', 'Beagle Channel Wildlife Cruise'],
        diningRecommendations: ['Kalma Resto', 'Main Dining Room'],
        eveningEntertainment: ['"End of the World" naturalist talk']
      },
      {
        portName: 'Cape Horn (Scenic Cruising)',
        arrivalTime: '08:00 AM',
        departureTime: '11:00 AM',
        distanceKm: 220,
        activities: ['Scenic sailing around the legendary Cape Horn', 'Seabird and albatross spotting', 'Maritime history lecture on deck'],
        suggestedExcursions: [],
        diningRecommendations: ['Observation Lounge hot chocolate', 'Main Dining Room'],
        eveningEntertainment: ['Cape Horn maritime history talk']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 1100,
        activities: ['Farewell packing', 'Culinary masterclass', 'Trivia contest'],
        suggestedExcursions: [],
        diningRecommendations: ['Specialty Seafood Restaurant', 'Main Dining Room'],
        eveningEntertainment: ['Farewell Gala Show']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 780,
        activities: ['Final spa treatments', 'Art auction', 'Deck games'],
        suggestedExcursions: [],
        diningRecommendations: ['Main Dining Room'],
        eveningEntertainment: ['Casino tournament night']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 640,
        activities: ['Final packing', 'Onboard shopping specials', 'Farewell brunch prep'],
        suggestedExcursions: [],
        diningRecommendations: ['Main Dining Room'],
        eveningEntertainment: ['Farewell Variety Show']
      },
      {
        portId: 'buenos-aires-port',
        portName: 'Buenos Aires',
        arrivalTime: '06:00 AM',
        departureTime: 'Disembarkation',
        distanceKm: 0,
        activities: ['Final breakfast', 'Customs & departure transfers'],
        suggestedExcursions: [],
        diningRecommendations: ['Breakfast buffet'],
        eveningEntertainment: []
      }
    ]
  },

  // 12-Night Antarctica Expedition
  {
    id: '12n-antarctica-peninsula-expedition',
    region: 'Antarctica',
    title: 'Antarctic Peninsula Expedition',
    durationNights: 12,
    departurePortId: 'ushuaia-port',
    departurePortName: 'Ushuaia',
    arrivalPortId: 'ushuaia-port',
    arrivalPortName: 'Ushuaia',
    portsSequence: [
      {
        portId: 'ushuaia-port',
        portName: 'Ushuaia',
        arrivalTime: 'Embarkation',
        departureTime: '06:00 PM',
        distanceKm: 0,
        activities: ['Cabin check-in', 'Expedition gear fitting (parkas & boots)', 'Safety muster drill'],
        suggestedExcursions: [],
        diningRecommendations: ['Main Dining Room', 'Expedition lounge cafe'],
        eveningEntertainment: ['Welcome Aboard Expedition Briefing']
      },
      {
        portName: 'Drake Passage (Southbound)',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 480,
        activities: ['Seabird and albatross watching from the bridge', 'Expedition team lectures on polar geology', 'Zodiac driving briefing'],
        suggestedExcursions: [],
        diningRecommendations: ['Observation Lounge hot soup station', 'Main Dining Room'],
        eveningEntertainment: ['Antarctic wildlife documentary screening']
      },
      {
        portName: 'Drake Passage (Southbound)',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 460,
        activities: ['Photography workshop for polar landscapes', 'Naturalist Q&A session', 'Biosecurity boot-cleaning briefing'],
        suggestedExcursions: [],
        diningRecommendations: ['Observation Lounge hot soup station', 'Main Dining Room'],
        eveningEntertainment: ['Polar explorer history lecture (Shackleton)']
      },
      {
        portName: 'Antarctic Sound',
        arrivalTime: '07:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 340,
        activities: ['Zodiac cruise among tabular icebergs', 'Landing at an Adélie penguin rookery', 'Polar plunge (optional)'],
        suggestedExcursions: ['Zodiac Iceberg Cruise', 'Penguin Rookery Landing'],
        diningRecommendations: ['Expedition Galley hot lunch', 'Main Dining Room'],
        eveningEntertainment: ['Daily recap with the expedition team']
      },
      {
        portName: 'Paradise Bay',
        arrivalTime: '07:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 90,
        activities: ['Zodiac cruise beneath towering glaciers', 'Landing at a research station', 'Kayaking among ice floes (optional)'],
        suggestedExcursions: ['Paradise Bay Zodiac Cruise', 'Sea Kayaking Among Icebergs'],
        diningRecommendations: ['Expedition Galley hot lunch', 'Main Dining Room'],
        eveningEntertainment: ['Glaciology lecture by the expedition team']
      },
      {
        portName: 'Deception Island',
        arrivalTime: '07:00 AM',
        departureTime: '05:00 PM',
        distanceKm: 130,
        activities: ['Sail into the flooded volcanic caldera', 'Landing at the abandoned whaling station', 'Optional polar plunge in geothermal waters'],
        suggestedExcursions: ['Deception Island Volcanic Caldera Landing'],
        diningRecommendations: ['Expedition Galley hot lunch', 'Main Dining Room'],
        eveningEntertainment: ['Volcanic geology recap']
      },
      {
        portName: 'Half Moon Island',
        arrivalTime: '07:00 AM',
        departureTime: '05:00 PM',
        distanceKm: 60,
        activities: ['Landing at a chinstrap penguin colony', 'Photography with expedition guides', 'Visit a historic Argentine research station'],
        suggestedExcursions: ['Half Moon Island Penguin Colony Landing'],
        diningRecommendations: ['Expedition Galley hot lunch', 'Main Dining Room'],
        eveningEntertainment: ['Farewell to Antarctica slideshow']
      },
      {
        portName: 'Drake Passage (Northbound)',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 470,
        activities: ['Expedition team recap lectures', 'Photo editing workshop', 'Farewell packing'],
        suggestedExcursions: [],
        diningRecommendations: ['Observation Lounge hot soup station', 'Main Dining Room'],
        eveningEntertainment: ['Expedition team trivia night']
      },
      {
        portName: 'Drake Passage (Northbound)',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 450,
        activities: ['Final gear return', 'Certificate of Antarctic crossing ceremony', 'Spa treatments'],
        suggestedExcursions: [],
        diningRecommendations: ['Observation Lounge hot soup station', 'Main Dining Room'],
        eveningEntertainment: ['Farewell Gala Dinner']
      },
      {
        portId: 'ushuaia-port',
        portName: 'Ushuaia',
        arrivalTime: '06:00 AM',
        departureTime: 'Disembarkation',
        distanceKm: 0,
        activities: ['Final breakfast', 'Customs & departure transfers'],
        suggestedExcursions: [],
        diningRecommendations: ['Breakfast buffet'],
        eveningEntertainment: []
      }
    ]
  },

  // 10-Night Arctic Expedition
  {
    id: '10n-arctic-svalbard-expedition',
    region: 'Arctic',
    title: 'Arctic Svalbard Expedition',
    durationNights: 10,
    departurePortId: 'reykjavik-port',
    departurePortName: 'Reykjavik',
    arrivalPortId: 'reykjavik-port',
    arrivalPortName: 'Reykjavik',
    portsSequence: [
      {
        portId: 'reykjavik-port',
        portName: 'Reykjavik',
        arrivalTime: 'Embarkation',
        departureTime: '06:00 PM',
        distanceKm: 0,
        activities: ['Cabin check-in', 'Expedition gear fitting', 'Safety muster drill'],
        suggestedExcursions: [],
        diningRecommendations: ['Main Dining Room', 'Expedition lounge cafe'],
        eveningEntertainment: ['Welcome Aboard Expedition Briefing']
      },
      {
        portName: 'Cruising the Norwegian Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 920,
        activities: ['Polar bear safety briefing', 'Arctic geology lecture', 'Seabird watching from the bridge'],
        suggestedExcursions: [],
        diningRecommendations: ['Observation Lounge hot soup station', 'Main Dining Room'],
        eveningEntertainment: ['Arctic exploration history lecture']
      },
      {
        portName: 'Longyearbyen (Svalbard)',
        arrivalTime: '08:00 AM',
        departureTime: '05:00 PM',
        distanceKm: 480,
        activities: ['Visit the Svalbard Museum', 'See the Global Seed Vault exterior', 'Optional dog-sledding on the tundra'],
        suggestedExcursions: ['Svalbard Museum & Town Tour', 'Arctic Dog Sledding Excursion'],
        diningRecommendations: ['Kroa Restaurant', 'Main Dining Room'],
        eveningEntertainment: ['Polar bear ecology lecture']
      },
      {
        portName: 'Ny-Ålesund',
        arrivalTime: '07:00 AM',
        departureTime: '04:00 PM',
        distanceKm: 110,
        activities: ['Visit the world\'s northernmost permanent settlement', 'Zodiac cruise among glacier fronts', 'Arctic tern and reindeer spotting'],
        suggestedExcursions: ['Ny-Ålesund Research Station Landing', 'Kongsfjorden Glacier Zodiac Cruise'],
        diningRecommendations: ['Expedition Galley hot lunch', 'Main Dining Room'],
        eveningEntertainment: ['Climate research lecture by the expedition team']
      },
      {
        portName: 'Polar Ice Edge',
        arrivalTime: '06:00 AM',
        departureTime: '02:00 PM',
        distanceKm: 260,
        activities: ['Scenic cruising along the polar pack ice', 'Wildlife watch for polar bears and walrus', 'Zodiac cruise among ice floes'],
        suggestedExcursions: ['Polar Ice Edge Zodiac Wildlife Cruise'],
        diningRecommendations: ['Expedition Galley hot lunch', 'Main Dining Room'],
        eveningEntertainment: ['Midnight sun deck gathering (seasonal)']
      },
      {
        portName: 'Fjortende Julibukta (Fourteenth of July Bay)',
        arrivalTime: '07:00 AM',
        departureTime: '05:00 PM',
        distanceKm: 140,
        activities: ['Landing beneath a dramatic tidewater glacier', 'Kittiwake seabird colony viewing', 'Arctic botany walk with a naturalist'],
        suggestedExcursions: ['Glacier Front Zodiac Cruise', 'Arctic Tundra Nature Walk'],
        diningRecommendations: ['Expedition Galley hot lunch', 'Main Dining Room'],
        eveningEntertainment: ['Daily expedition team recap']
      },
      {
        portName: 'Cruising the Norwegian Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 780,
        activities: ['Photo editing workshop', 'Farewell packing', 'Whale watching from the bridge'],
        suggestedExcursions: [],
        diningRecommendations: ['Observation Lounge hot soup station', 'Main Dining Room'],
        eveningEntertainment: ['Expedition team trivia night']
      },
      {
        portName: 'Cruising the Norwegian Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 610,
        activities: ['Certificate of Arctic Circle crossing ceremony', 'Final gear return', 'Spa treatments'],
        suggestedExcursions: [],
        diningRecommendations: ['Observation Lounge hot soup station', 'Main Dining Room'],
        eveningEntertainment: ['Farewell Gala Dinner']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 320,
        activities: ['Final packing', 'Onboard shopping specials', 'Farewell brunch prep'],
        suggestedExcursions: [],
        diningRecommendations: ['Main Dining Room'],
        eveningEntertainment: ['Farewell Variety Show']
      },
      {
        portId: 'reykjavik-port',
        portName: 'Reykjavik',
        arrivalTime: '06:00 AM',
        departureTime: 'Disembarkation',
        distanceKm: 0,
        activities: ['Final breakfast', 'Customs & departure transfers'],
        suggestedExcursions: [],
        diningRecommendations: ['Breakfast buffet'],
        eveningEntertainment: []
      }
    ]
  },
  // 7-Night Japan Itinerary
  {
    id: '7n-japan-highlights',
    region: 'Japan',
    title: 'Japan Highlights Voyage',
    durationNights: 7,
    departurePortId: 'tokyo-port',
    departurePortName: 'Tokyo (Yokohama)',
    arrivalPortId: 'tokyo-port',
    arrivalPortName: 'Tokyo (Yokohama)',
    portsSequence: [
      {
        portId: 'tokyo-port',
        portName: 'Tokyo (Yokohama)',
        arrivalTime: 'Embarkation',
        departureTime: '06:00 PM',
        distanceKm: 0,
        activities: ['Cabin check-in', 'Explore the Minato Mirai waterfront before boarding', 'Safety muster drill'],
        suggestedExcursions: [],
        diningRecommendations: ['Main Dining Room', 'Sushi Bar'],
        eveningEntertainment: ['Welcome Aboard Show']
      },
      {
        portName: 'Shimizu (Mount Fuji)',
        arrivalTime: '08:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 140,
        activities: ['View Mount Fuji from the Fujiyama viewpoint', 'Visit a traditional green tea plantation', 'Explore Miho no Matsubara pine grove'],
        suggestedExcursions: ['Mount Fuji 5th Station & Tea Plantation Tour', 'Nihondaira Ropeway & Kunozan Shrine Tour'],
        diningRecommendations: ['Sawayaka Ganso hamburger steak house', 'Main Dining Room'],
        eveningEntertainment: ['Japanese taiko drum performance']
      },
      {
        portName: 'Osaka (Kobe)',
        arrivalTime: '07:00 AM',
        departureTime: 'Overnight',
        distanceKm: 480,
        activities: ['Visit Osaka Castle', 'Explore the Dotonbori entertainment district', 'Day trip to Nara\'s deer park'],
        suggestedExcursions: ['Osaka Castle & Dotonbori Tour', 'Nara Deer Park & Todai-ji Temple Day Trip'],
        diningRecommendations: ['Dotonbori street food stalls', 'Main Dining Room'],
        eveningEntertainment: ['Overnight in port - optional shore nightlife']
      },
      {
        portName: 'Kyoto (via Osaka)',
        arrivalTime: 'Overnight',
        departureTime: '06:00 PM',
        distanceKm: 0,
        activities: ['Visit Fushimi Inari Shrine\'s torii gates', 'Explore the Arashiyama bamboo grove', 'Tour Kinkaku-ji (Golden Pavilion)'],
        suggestedExcursions: ['Kyoto Full-Day Temples & Bamboo Grove Tour', 'Traditional Tea Ceremony Experience'],
        diningRecommendations: ['Nishiki Market food stalls', 'Main Dining Room'],
        eveningEntertainment: ['Geisha culture lecture']
      },
      {
        portName: 'Kagoshima',
        arrivalTime: '08:00 AM',
        departureTime: '05:00 PM',
        distanceKm: 610,
        activities: ['View the active Sakurajima volcano', 'Soak in a traditional sand bath onsen', 'Visit Sengan-en Garden'],
        suggestedExcursions: ['Sakurajima Volcano Ferry & Viewpoint Tour', 'Ibusuki Sand Bath Onsen Experience'],
        diningRecommendations: ['Kurobuta pork shabu-shabu restaurant', 'Main Dining Room'],
        eveningEntertainment: ['Kagoshima folk dance performance']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 720,
        activities: ['Origami and calligraphy class', 'Farewell packing', 'Sake tasting seminar'],
        suggestedExcursions: [],
        diningRecommendations: ['Specialty Teppanyaki', 'Main Dining Room'],
        eveningEntertainment: ['Farewell Gala Show']
      },
      {
        portId: 'tokyo-port',
        portName: 'Tokyo (Yokohama)',
        arrivalTime: '06:00 AM',
        departureTime: 'Disembarkation',
        distanceKm: 480,
        activities: ['Final breakfast', 'Customs & departure transfers'],
        suggestedExcursions: [],
        diningRecommendations: ['Breakfast buffet'],
        eveningEntertainment: []
      }
    ]
  },

  // 7-Night South Korea & Japan Itinerary
  {
    id: '7n-korea-japan-explorer',
    region: 'South Korea',
    title: 'South Korea & Japan Explorer',
    durationNights: 7,
    departurePortId: 'busan-port',
    departurePortName: 'Busan',
    arrivalPortId: 'busan-port',
    arrivalPortName: 'Busan',
    portsSequence: [
      {
        portId: 'busan-port',
        portName: 'Busan',
        arrivalTime: 'Embarkation',
        departureTime: '06:00 PM',
        distanceKm: 0,
        activities: ['Cabin check-in', 'Browse Jagalchi Fish Market before boarding', 'Safety muster drill'],
        suggestedExcursions: [],
        diningRecommendations: ['Main Dining Room', 'Korean BBQ station'],
        eveningEntertainment: ['Welcome Aboard Show']
      },
      {
        portName: 'Jeju Island',
        arrivalTime: '08:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 290,
        activities: ['Hike the Seongsan Ilchulbong volcanic crater', 'Visit a traditional Haenyeo (female diver) village', 'Explore Manjanggul lava tube cave'],
        suggestedExcursions: ['Seongsan Ilchulbong Sunrise Peak Tour', 'Jeju Island Highlights & Waterfalls Tour'],
        diningRecommendations: ['Jeju black pork restaurant', 'Main Dining Room'],
        eveningEntertainment: ['Korean traditional drum performance']
      },
      {
        portName: 'Fukuoka',
        arrivalTime: '08:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 210,
        activities: ['Visit Dazaifu Tenmangu Shrine', 'Sample Hakata ramen at Yatai food stalls', 'Explore Fukuoka Castle ruins'],
        suggestedExcursions: ['Dazaifu Shrine & Hakata Old Town Tour', 'Fukuoka Yatai Food Stall Tour'],
        diningRecommendations: ['Hakata Yatai ramen stalls', 'Main Dining Room'],
        eveningEntertainment: ['Japanese taiko drum performance']
      },
      {
        portName: 'Nagasaki',
        arrivalTime: '07:00 AM',
        departureTime: '05:00 PM',
        distanceKm: 160,
        activities: ['Visit the Atomic Bomb Museum and Peace Park', 'Explore Glover Garden colonial houses', 'Ride the Nagasaki Ropeway to Mount Inasa'],
        suggestedExcursions: ['Peace Park & Atomic Bomb Museum Tour', 'Glover Garden & Dutch Slopes Walking Tour'],
        diningRecommendations: ['Shikairo (Champon noodle originator)', 'Main Dining Room'],
        eveningEntertainment: ['Peace and history reflection lecture']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 340,
        activities: ['Korean cooking demonstration', 'K-pop dance class', 'Ginseng tasting seminar'],
        suggestedExcursions: [],
        diningRecommendations: ['Specialty Korean BBQ', 'Main Dining Room'],
        eveningEntertainment: ['K-pop tribute show']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 260,
        activities: ['Farewell packing', 'Trivia contest', 'Spa treatments'],
        suggestedExcursions: [],
        diningRecommendations: ['Main Dining Room'],
        eveningEntertainment: ['Farewell Gala Show']
      },
      {
        portId: 'busan-port',
        portName: 'Busan',
        arrivalTime: '06:00 AM',
        departureTime: 'Disembarkation',
        distanceKm: 0,
        activities: ['Final breakfast', 'Customs & departure transfers'],
        suggestedExcursions: [],
        diningRecommendations: ['Breakfast buffet'],
        eveningEntertainment: []
      }
    ]
  },

  // 7-Night Southeast Asia Itinerary
  {
    id: '7n-southeast-asia-explorer',
    region: 'Southeast Asia',
    title: 'Southeast Asia Explorer',
    durationNights: 7,
    departurePortId: 'singapore-port',
    departurePortName: 'Singapore',
    arrivalPortId: 'singapore-port',
    arrivalPortName: 'Singapore',
    portsSequence: [
      {
        portId: 'singapore-port',
        portName: 'Singapore',
        arrivalTime: 'Embarkation',
        departureTime: '06:00 PM',
        distanceKm: 0,
        activities: ['Explore Gardens by the Bay before boarding', 'Cabin check-in', 'Safety muster drill'],
        suggestedExcursions: [],
        diningRecommendations: ['Main Dining Room', 'Hawker-style food court'],
        eveningEntertainment: ['Welcome Aboard Show']
      },
      {
        portName: 'Penang (George Town)',
        arrivalTime: '08:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 460,
        activities: ['Explore George Town\'s UNESCO street art', 'Ride the Penang Hill funicular', 'Sample street food on Chulia Street'],
        suggestedExcursions: ['George Town Heritage & Street Art Tour', 'Penang Hill & Kek Lok Si Temple Tour'],
        diningRecommendations: ['Gurney Drive hawker stalls', 'Main Dining Room'],
        eveningEntertainment: ['Peranakan culture performance']
      },
      {
        portName: 'Phuket',
        arrivalTime: '08:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 320,
        activities: ['Boat tour of Phang Nga Bay\'s limestone karsts', 'Relax on Patong Beach', 'Visit the Big Buddha of Phuket'],
        suggestedExcursions: ['Phang Nga Bay & James Bond Island Tour', 'Phi Phi Islands Speedboat Excursion'],
        diningRecommendations: ['Raya Restaurant', 'Main Dining Room'],
        eveningEntertainment: ['Thai dance and cultural show']
      },
      {
        portName: 'Langkawi',
        arrivalTime: '07:00 AM',
        departureTime: '05:00 PM',
        distanceKm: 280,
        activities: ['Ride the Langkawi Sky Cab cable car', 'Visit the Sky Bridge', 'Mangrove wildlife river cruise'],
        suggestedExcursions: ['Langkawi Sky Cab & Sky Bridge Tour', 'Mangrove Forest River Safari'],
        diningRecommendations: ['Orkid Ria seafood restaurant', 'Main Dining Room'],
        eveningEntertainment: ['Malaysian batik-making demonstration']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 620,
        activities: ['Southeast Asian cooking demonstration', 'Spa treatments', 'Deck games'],
        suggestedExcursions: [],
        diningRecommendations: ['Specialty Pan-Asian Restaurant', 'Main Dining Room'],
        eveningEntertainment: ['Comedy Club Show']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 310,
        activities: ['Farewell packing', 'Trivia contest', 'Art auction'],
        suggestedExcursions: [],
        diningRecommendations: ['Main Dining Room'],
        eveningEntertainment: ['Farewell Gala Show']
      },
      {
        portId: 'singapore-port',
        portName: 'Singapore',
        arrivalTime: '06:00 AM',
        departureTime: 'Disembarkation',
        distanceKm: 0,
        activities: ['Final breakfast', 'Customs & departure transfers'],
        suggestedExcursions: [],
        diningRecommendations: ['Breakfast buffet'],
        eveningEntertainment: []
      }
    ]
  },

  // 7-Night China Itinerary
  {
    id: '7n-china-coastal',
    region: 'China',
    title: 'China Coastal Discovery',
    durationNights: 7,
    departurePortId: 'shanghai-port',
    departurePortName: 'Shanghai',
    arrivalPortId: 'shanghai-port',
    arrivalPortName: 'Shanghai',
    portsSequence: [
      {
        portId: 'shanghai-port',
        portName: 'Shanghai',
        arrivalTime: 'Embarkation',
        departureTime: '06:00 PM',
        distanceKm: 0,
        activities: ['Walk The Bund before boarding', 'Cabin check-in', 'Safety muster drill'],
        suggestedExcursions: [],
        diningRecommendations: ['Main Dining Room', 'Dim Sum station'],
        eveningEntertainment: ['Welcome Aboard Show']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 560,
        activities: ['Chinese calligraphy class', 'Tai chi on deck', 'Tea ceremony demonstration'],
        suggestedExcursions: [],
        diningRecommendations: ['Specialty Cantonese Restaurant', 'Main Dining Room'],
        eveningEntertainment: ['Chinese acrobatics show']
      },
      {
        portName: 'Xiamen',
        arrivalTime: '08:00 AM',
        departureTime: 'Overnight',
        distanceKm: 640,
        activities: ['Explore Gulangyu Island\'s colonial architecture', 'Visit South Putuo Temple', 'Stroll Zhongshan Road pedestrian street'],
        suggestedExcursions: ['Gulangyu Island Walking Tour', 'South Putuo Temple & Xiamen University Tour'],
        diningRecommendations: ['Local Minnan seafood restaurant', 'Main Dining Room'],
        eveningEntertainment: ['Overnight in port - optional shore excursion']
      },
      {
        portName: 'Hong Kong',
        arrivalTime: 'Overnight',
        departureTime: '08:00 PM',
        distanceKm: 480,
        activities: ['Ride the Star Ferry across Victoria Harbour', 'Take the Peak Tram to Victoria Peak', 'Explore Temple Street Night Market'],
        suggestedExcursions: ['Victoria Peak & Star Ferry Tour', 'Lantau Island & Big Buddha Excursion'],
        diningRecommendations: ['Tim Ho Wan (Michelin dim sum)', 'Main Dining Room'],
        eveningEntertainment: ['Symphony of Lights harbor show viewing']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 720,
        activities: ['Mahjong lessons', 'Silk and jade appraisal talk', 'Deck games'],
        suggestedExcursions: [],
        diningRecommendations: ['Specialty Szechuan Restaurant', 'Main Dining Room'],
        eveningEntertainment: ['Chinese opera performance']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 480,
        activities: ['Farewell packing', 'Trivia contest', 'Spa treatments'],
        suggestedExcursions: [],
        diningRecommendations: ['Main Dining Room'],
        eveningEntertainment: ['Farewell Gala Show']
      },
      {
        portId: 'shanghai-port',
        portName: 'Shanghai',
        arrivalTime: '06:00 AM',
        departureTime: 'Disembarkation',
        distanceKm: 0,
        activities: ['Final breakfast', 'Customs & departure transfers'],
        suggestedExcursions: [],
        diningRecommendations: ['Breakfast buffet'],
        eveningEntertainment: []
      }
    ]
  },

  // 7-Night India Itinerary
  {
    id: '7n-india-coastal-explorer',
    region: 'India',
    title: 'India Coastal Explorer',
    durationNights: 7,
    departurePortId: 'mumbai-port',
    departurePortName: 'Mumbai',
    arrivalPortId: 'mumbai-port',
    arrivalPortName: 'Mumbai',
    portsSequence: [
      {
        portId: 'mumbai-port',
        portName: 'Mumbai',
        arrivalTime: 'Embarkation',
        departureTime: '06:00 PM',
        distanceKm: 0,
        activities: ['Visit the Gateway of India before boarding', 'Cabin check-in', 'Safety muster drill'],
        suggestedExcursions: [],
        diningRecommendations: ['Main Dining Room', 'Tandoor Grill station'],
        eveningEntertainment: ['Welcome Aboard Show']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 480,
        activities: ['Indian cooking demonstration', 'Henna art station', 'Yoga class on deck'],
        suggestedExcursions: [],
        diningRecommendations: ['Specialty Indian Restaurant', 'Main Dining Room'],
        eveningEntertainment: ['Bollywood dance performance']
      },
      {
        portName: 'Goa',
        arrivalTime: '08:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 460,
        activities: ['Explore the Portuguese-colonial Old Goa churches', 'Relax on Baga Beach', 'Visit a spice plantation'],
        suggestedExcursions: ['Old Goa Churches & Heritage Tour', 'Goa Spice Plantation & Lunch Tour'],
        diningRecommendations: ['Fisherman\'s Wharf', 'Main Dining Room'],
        eveningEntertainment: ['Goan folk music performance']
      },
      {
        portName: 'Cochin (Kochi)',
        arrivalTime: '08:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 380,
        activities: ['Watch the Chinese fishing nets at Fort Kochi', 'Attend a Kathakali dance performance', 'Cruise the Kerala backwaters'],
        suggestedExcursions: ['Kerala Backwaters Houseboat Cruise', 'Fort Kochi Heritage Walking Tour'],
        diningRecommendations: ['Kashi Art Cafe', 'Main Dining Room'],
        eveningEntertainment: ['Traditional Kathakali dance performance']
      },
      {
        portName: 'Colombo (Sri Lanka)',
        arrivalTime: '07:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 340,
        activities: ['Visit the Gangaramaya Temple', 'Explore Galle Face Green promenade', 'Tour a Ceylon tea factory'],
        suggestedExcursions: ['Colombo City Highlights Tour', 'Galle Fort Day Trip'],
        diningRecommendations: ['Ministry of Crab', 'Main Dining Room'],
        eveningEntertainment: ['Sri Lankan cultural dance show']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 620,
        activities: ['Farewell packing', 'Trivia contest', 'Spa treatments'],
        suggestedExcursions: [],
        diningRecommendations: ['Main Dining Room'],
        eveningEntertainment: ['Farewell Gala Show']
      },
      {
        portId: 'mumbai-port',
        portName: 'Mumbai',
        arrivalTime: '06:00 AM',
        departureTime: 'Disembarkation',
        distanceKm: 0,
        activities: ['Final breakfast', 'Customs & departure transfers'],
        suggestedExcursions: [],
        diningRecommendations: ['Breakfast buffet'],
        eveningEntertainment: []
      }
    ]
  },

  // 7-Night Middle East Itinerary
  {
    id: '7n-arabian-gulf-explorer',
    region: 'Middle East',
    title: 'Arabian Gulf Explorer',
    durationNights: 7,
    departurePortId: 'dubai-port',
    departurePortName: 'Dubai',
    arrivalPortId: 'dubai-port',
    arrivalPortName: 'Dubai',
    portsSequence: [
      {
        portId: 'dubai-port',
        portName: 'Dubai',
        arrivalTime: 'Embarkation',
        departureTime: '06:00 PM',
        distanceKm: 0,
        activities: ['Visit the Burj Khalifa before boarding', 'Cabin check-in', 'Safety muster drill'],
        suggestedExcursions: [],
        diningRecommendations: ['Main Dining Room', 'Middle Eastern mezze station'],
        eveningEntertainment: ['Welcome Aboard Show']
      },
      {
        portName: 'Abu Dhabi',
        arrivalTime: '08:00 AM',
        departureTime: 'Overnight',
        distanceKm: 130,
        activities: ['Tour the Sheikh Zayed Grand Mosque', 'Visit the Louvre Abu Dhabi', 'Explore Qasr Al Watan palace'],
        suggestedExcursions: ['Sheikh Zayed Grand Mosque & City Tour', 'Louvre Abu Dhabi Guided Tour'],
        diningRecommendations: ['Al Fanar Restaurant', 'Main Dining Room'],
        eveningEntertainment: ['Overnight in port - optional shore excursion']
      },
      {
        portName: 'Doha (Qatar)',
        arrivalTime: 'Overnight',
        departureTime: '05:00 PM',
        distanceKm: 380,
        activities: ['Explore the Museum of Islamic Art', 'Browse Souq Waqif marketplace', 'Desert safari and dune bashing'],
        suggestedExcursions: ['Museum of Islamic Art & Souq Waqif Tour', 'Desert Safari & Dune Bashing Adventure'],
        diningRecommendations: ['Parisa Souq Waqif', 'Main Dining Room'],
        eveningEntertainment: ['Traditional Qatari dance performance']
      },
      {
        portName: 'Manama (Bahrain)',
        arrivalTime: '08:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 290,
        activities: ['Visit the Bahrain National Museum', 'Explore the Bahrain Fort (Qal\'at al-Bahrain)', 'Shop the Manama Souq'],
        suggestedExcursions: ['Bahrain Fort & National Museum Tour', 'Manama Souq & Pearl Diving Heritage Tour'],
        diningRecommendations: ['Haji\'s Cafe', 'Main Dining Room'],
        eveningEntertainment: ['Arabian pearl-diving heritage lecture']
      },
      {
        portName: 'Muscat (Oman)',
        arrivalTime: '07:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 620,
        activities: ['Tour the Sultan Qaboos Grand Mosque', 'Explore Muttrah Souq', 'Wadi and mountain 4x4 excursion'],
        suggestedExcursions: ['Sultan Qaboos Grand Mosque & City Tour', 'Wadi Shab 4x4 Adventure'],
        diningRecommendations: ['Bait Al Luban', 'Main Dining Room'],
        eveningEntertainment: ['Omani folklore performance']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 540,
        activities: ['Farewell packing', 'Arabic coffee tasting seminar', 'Trivia contest'],
        suggestedExcursions: [],
        diningRecommendations: ['Main Dining Room'],
        eveningEntertainment: ['Farewell Gala Show']
      },
      {
        portId: 'dubai-port',
        portName: 'Dubai',
        arrivalTime: '06:00 AM',
        departureTime: 'Disembarkation',
        distanceKm: 0,
        activities: ['Final breakfast', 'Customs & departure transfers'],
        suggestedExcursions: [],
        diningRecommendations: ['Breakfast buffet'],
        eveningEntertainment: []
      }
    ]
  },
  // 7-Night Australia Itinerary
  {
    id: '7n-australia-coastal',
    region: 'Australia',
    title: 'Australia Coastal Discovery',
    durationNights: 7,
    departurePortId: 'sydney-port',
    departurePortName: 'Sydney',
    arrivalPortId: 'sydney-port',
    arrivalPortName: 'Sydney',
    portsSequence: [
      {
        portId: 'sydney-port',
        portName: 'Sydney',
        arrivalTime: 'Embarkation',
        departureTime: '06:00 PM',
        distanceKm: 0,
        activities: ['Sail past the Sydney Opera House at departure', 'Cabin check-in', 'Safety muster drill'],
        suggestedExcursions: [],
        diningRecommendations: ['Main Dining Room', 'Poolside grill'],
        eveningEntertainment: ['Welcome Aboard Show']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 460,
        activities: ['Australian wildlife lecture', 'Deck cricket match', 'Wine tasting seminar (Hunter Valley wines)'],
        suggestedExcursions: [],
        diningRecommendations: ['Specialty Steakhouse', 'Main Dining Room'],
        eveningEntertainment: ['Live Australian folk music']
      },
      {
        portName: 'Melbourne',
        arrivalTime: '08:00 AM',
        departureTime: 'Overnight',
        distanceKm: 720,
        activities: ['Explore the laneways and street art of the CBD', 'Visit the Royal Botanic Gardens', 'Tour the Great Ocean Road (day trip)'],
        suggestedExcursions: ['Great Ocean Road & Twelve Apostles Day Trip', 'Melbourne Laneways & Street Art Tour'],
        diningRecommendations: ['Queen Victoria Market food stalls', 'Main Dining Room'],
        eveningEntertainment: ['Overnight in port - optional shore nightlife']
      },
      {
        portName: 'Hobart (Tasmania)',
        arrivalTime: 'Overnight',
        departureTime: '05:00 PM',
        distanceKm: 600,
        activities: ['Visit the MONA (Museum of Old and New Art)', 'Explore Salamanca Market', 'Hike Mount Wellington'],
        suggestedExcursions: ['MONA Museum & Ferry Excursion', 'Mount Wellington Scenic Drive'],
        diningRecommendations: ['Fish Frenzy on the wharf', 'Main Dining Room'],
        eveningEntertainment: ['Tasmanian wilderness documentary screening']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 680,
        activities: ['Culinary masterclass', 'Deck yoga class', 'Trivia contest'],
        suggestedExcursions: [],
        diningRecommendations: ['Chef\'s Table Dining', 'Main Dining Room'],
        eveningEntertainment: ['Comedy Club Show']
      },
      {
        portName: 'Brisbane',
        arrivalTime: '07:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 740,
        activities: ['Cruise the Brisbane River', 'Visit South Bank Parklands', 'Day trip to the Gold Coast beaches'],
        suggestedExcursions: ['Gold Coast Beaches & Theme Parks Day Trip', 'Brisbane River Cruise & South Bank Tour'],
        diningRecommendations: ['Eat Street Northshore markets', 'Main Dining Room'],
        eveningEntertainment: ['Farewell Gala Show']
      },
      {
        portId: 'sydney-port',
        portName: 'Sydney',
        arrivalTime: '06:00 AM',
        departureTime: 'Disembarkation',
        distanceKm: 780,
        activities: ['Final breakfast', 'Customs & departure transfers'],
        suggestedExcursions: [],
        diningRecommendations: ['Breakfast buffet'],
        eveningEntertainment: []
      }
    ]
  },

  // 10-Night New Zealand Itinerary
  {
    id: '10n-new-zealand-fjords',
    region: 'New Zealand',
    title: 'New Zealand & Fiordland Explorer',
    durationNights: 10,
    departurePortId: 'auckland-port',
    departurePortName: 'Auckland',
    arrivalPortId: 'auckland-port',
    arrivalPortName: 'Auckland',
    portsSequence: [
      {
        portId: 'auckland-port',
        portName: 'Auckland',
        arrivalTime: 'Embarkation',
        departureTime: '06:00 PM',
        distanceKm: 0,
        activities: ['Cabin check-in', 'Views from the Sky Tower before boarding', 'Safety muster drill'],
        suggestedExcursions: [],
        diningRecommendations: ['Main Dining Room', 'Poolside grill'],
        eveningEntertainment: ['Welcome Aboard Show']
      },
      {
        portName: 'Bay of Islands',
        arrivalTime: '08:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 240,
        activities: ['Dolphin watching cruise', 'Visit the Waitangi Treaty Grounds', 'Hole in the Rock scenic boat tour'],
        suggestedExcursions: ['Waitangi Treaty Grounds Cultural Tour', 'Hole in the Rock & Dolphin Watching Cruise'],
        diningRecommendations: ['The Duke of Marlborough', 'Main Dining Room'],
        eveningEntertainment: ['Māori cultural performance']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 620,
        activities: ['New Zealand wine tasting seminar', 'Rugby trivia contest', 'Deck games'],
        suggestedExcursions: [],
        diningRecommendations: ['Specialty Grill', 'Main Dining Room'],
        eveningEntertainment: ['Live acoustic music']
      },
      {
        portName: 'Wellington',
        arrivalTime: '07:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 640,
        activities: ['Ride the Wellington Cable Car', 'Visit Te Papa Museum', 'Explore the Weta Workshop film studio'],
        suggestedExcursions: ['Wellington City & Cable Car Tour', 'Weta Workshop Film Studio Tour'],
        diningRecommendations: ['Ortega Fish Shack', 'Main Dining Room'],
        eveningEntertainment: ['Comedy Club Show']
      },
      {
        portName: 'Akaroa',
        arrivalTime: '08:00 AM',
        departureTime: '05:00 PM',
        distanceKm: 380,
        activities: ['Swim with Hector\'s dolphins', 'Explore the French-heritage village', 'Scenic harbor cruise'],
        suggestedExcursions: ['Hector\'s Dolphin Swim Excursion', 'Akaroa Harbour Scenic Cruise'],
        diningRecommendations: ['Akaroa Fish & Chip Co.', 'Main Dining Room'],
        eveningEntertainment: ['French-New Zealand heritage lecture']
      },
      {
        portName: 'Dunedin',
        arrivalTime: '08:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 260,
        activities: ['Tour Larnach Castle', 'Visit the Royal Albatross Centre', 'See yellow-eyed penguins at Otago Peninsula'],
        suggestedExcursions: ['Otago Peninsula Wildlife Tour', 'Larnach Castle & Gardens Tour'],
        diningRecommendations: ['Nova Cafe', 'Main Dining Room'],
        eveningEntertainment: ['Scottish heritage folk music (Dunedin\'s Scots roots)']
      },
      {
        portName: 'Fiordland (Milford Sound Scenic Cruising)',
        arrivalTime: '07:00 AM',
        departureTime: '01:00 PM',
        distanceKm: 340,
        activities: ['Scenic cruising through Milford Sound', 'Waterfall and seal spotting', 'Naturalist commentary on deck'],
        suggestedExcursions: [],
        diningRecommendations: ['Observation Lounge morning coffee', 'Main Dining Room'],
        eveningEntertainment: ['Fiordland naturalist lecture']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 780,
        activities: ['Farewell packing', 'Culinary masterclass', 'Trivia contest'],
        suggestedExcursions: [],
        diningRecommendations: ['Chef\'s Table Dining', 'Main Dining Room'],
        eveningEntertainment: ['Farewell Gala Show']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 640,
        activities: ['Final packing', 'Onboard shopping specials', 'Spa treatments'],
        suggestedExcursions: [],
        diningRecommendations: ['Main Dining Room'],
        eveningEntertainment: ['Farewell Variety Show']
      },
      {
        portId: 'auckland-port',
        portName: 'Auckland',
        arrivalTime: '06:00 AM',
        departureTime: 'Disembarkation',
        distanceKm: 0,
        activities: ['Final breakfast', 'Customs & departure transfers'],
        suggestedExcursions: [],
        diningRecommendations: ['Breakfast buffet'],
        eveningEntertainment: []
      }
    ]
  },

  // 10-Night South Pacific Itinerary
  {
    id: '10n-south-pacific-islands',
    region: 'South Pacific',
    title: 'South Pacific Island Paradise',
    durationNights: 10,
    departurePortId: 'sydney-port',
    departurePortName: 'Sydney',
    arrivalPortId: 'sydney-port',
    arrivalPortName: 'Sydney',
    portsSequence: [
      {
        portId: 'sydney-port',
        portName: 'Sydney',
        arrivalTime: 'Embarkation',
        departureTime: '06:00 PM',
        distanceKm: 0,
        activities: ['Cabin check-in', 'Sailaway past the Sydney Opera House', 'Safety muster drill'],
        suggestedExcursions: [],
        diningRecommendations: ['Main Dining Room', 'Tiki poolside bar'],
        eveningEntertainment: ['Welcome Aboard Show']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 960,
        activities: ['Polynesian culture lecture', 'Snorkeling gear fitting', 'Deck games'],
        suggestedExcursions: [],
        diningRecommendations: ['Specialty Seafood Restaurant', 'Main Dining Room'],
        eveningEntertainment: ['Live island band on deck']
      },
      {
        portName: 'Nouméa (New Caledonia)',
        arrivalTime: '08:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 940,
        activities: ['Snorkel the world\'s largest lagoon (UNESCO site)', 'Visit the Tjibaou Cultural Centre', 'Relax on Anse Vata beach'],
        suggestedExcursions: ['Amedee Island Lagoon Snorkel Tour', 'Tjibaou Cultural Centre & City Tour'],
        diningRecommendations: ['Le Roof over-water restaurant', 'Main Dining Room'],
        eveningEntertainment: ['French-Melanesian fusion music night']
      },
      {
        portName: 'Port Vila (Vanuatu)',
        arrivalTime: '08:00 AM',
        departureTime: '05:00 PM',
        distanceKm: 480,
        activities: ['Visit the Mele Cascades waterfalls', 'Explore a traditional Ni-Vanuatu village', 'Snorkel at Hideaway Island'],
        suggestedExcursions: ['Mele Cascades Waterfall Tour', 'Hideaway Island Snorkel & Beach Day'],
        diningRecommendations: ['Waterfront Bar & Grill', 'Main Dining Room'],
        eveningEntertainment: ['Traditional Ni-Vanuatu dance performance']
      },
      {
        portName: 'Suva (Fiji)',
        arrivalTime: '08:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 860,
        activities: ['Visit the Fiji Museum', 'Explore Colo-i-Suva Forest Park', 'Attend a traditional kava ceremony'],
        suggestedExcursions: ['Colo-i-Suva Rainforest & Waterfall Tour', 'Traditional Fijian Village & Kava Ceremony'],
        diningRecommendations: ['Tiko\'s Floating Restaurant', 'Main Dining Room'],
        eveningEntertainment: ['Fijian meke dance performance']
      },
      {
        portName: 'Lautoka (Fiji)',
        arrivalTime: '07:00 AM',
        departureTime: '05:00 PM',
        distanceKm: 220,
        activities: ['Relax on the Mamanuca Islands beaches', 'Snorkel the Coral Coast reefs', 'Visit a sugar cane plantation'],
        suggestedExcursions: ['Mamanuca Islands Beach Day Cruise', 'Sabeto Hot Springs & Mud Pool Tour'],
        diningRecommendations: ['Chefs the Boulevard', 'Main Dining Room'],
        eveningEntertainment: ['Fire-knife dance performance']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 1080,
        activities: ['Farewell packing', 'Culinary masterclass', 'Trivia contest'],
        suggestedExcursions: [],
        diningRecommendations: ['Chef\'s Table Dining', 'Main Dining Room'],
        eveningEntertainment: ['Comedy Club Show']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 940,
        activities: ['Final spa treatments', 'Art auction', 'Deck games'],
        suggestedExcursions: [],
        diningRecommendations: ['Main Dining Room'],
        eveningEntertainment: ['Casino tournament night']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 560,
        activities: ['Final packing', 'Onboard shopping specials', 'Farewell brunch prep'],
        suggestedExcursions: [],
        diningRecommendations: ['Main Dining Room'],
        eveningEntertainment: ['Farewell Variety Show']
      },
      {
        portId: 'sydney-port',
        portName: 'Sydney',
        arrivalTime: '06:00 AM',
        departureTime: 'Disembarkation',
        distanceKm: 0,
        activities: ['Final breakfast', 'Customs & departure transfers'],
        suggestedExcursions: [],
        diningRecommendations: ['Breakfast buffet'],
        eveningEntertainment: []
      }
    ]
  },

  // 10-Night Africa Itinerary
  {
    id: '10n-africa-coastal',
    region: 'Africa',
    title: 'Southern Africa Coastal Voyage',
    durationNights: 10,
    departurePortId: 'cape-town-port',
    departurePortName: 'Cape Town',
    arrivalPortId: 'cape-town-port',
    arrivalPortName: 'Cape Town',
    portsSequence: [
      {
        portId: 'cape-town-port',
        portName: 'Cape Town',
        arrivalTime: 'Embarkation',
        departureTime: '06:00 PM',
        distanceKm: 0,
        activities: ['Ride the cableway up Table Mountain before boarding', 'Cabin check-in', 'Safety muster drill'],
        suggestedExcursions: [],
        diningRecommendations: ['Main Dining Room', 'Braai (BBQ) grill station'],
        eveningEntertainment: ['Welcome Aboard Show']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 640,
        activities: ['African wildlife documentary screening', 'South African wine tasting seminar', 'Deck games'],
        suggestedExcursions: [],
        diningRecommendations: ['Specialty Grill', 'Main Dining Room'],
        eveningEntertainment: ['African drumming workshop']
      },
      {
        portName: 'Walvis Bay (Namibia)',
        arrivalTime: '08:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 780,
        activities: ['Dune 7 sandboarding excursion', 'Dolphin and seal cruise in Walvis Bay lagoon', 'Day trip to Sossusvlei red dunes'],
        suggestedExcursions: ['Walvis Bay Dolphin & Seal Cruise', 'Namib Desert Dune Excursion'],
        diningRecommendations: ['The Raft floating restaurant', 'Main Dining Room'],
        eveningEntertainment: ['Namibian desert ecology lecture']
      },
      {
        portName: 'Lüderitz (Namibia)',
        arrivalTime: '07:00 AM',
        departureTime: '05:00 PM',
        distanceKm: 340,
        activities: ['Explore the Kolmanskop ghost town', 'Visit a penguin colony at Diaz Point', 'Tour German colonial architecture'],
        suggestedExcursions: ['Kolmanskop Ghost Town Tour', 'Diaz Point Penguin Colony Excursion'],
        diningRecommendations: ['Diaz Coffee Shop', 'Main Dining Room'],
        eveningEntertainment: ['Colonial history lecture']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 920,
        activities: ['Culinary masterclass', 'Bridge tournament', 'Spa treatments'],
        suggestedExcursions: [],
        diningRecommendations: ['Chef\'s Table Dining', 'Main Dining Room'],
        eveningEntertainment: ['Comedy Club Show']
      },
      {
        portName: 'Port Elizabeth (Gqeberha)',
        arrivalTime: '08:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 760,
        activities: ['Safari day trip to Addo Elephant National Park', 'Visit the Donkin Heritage Trail', 'Relax on Hobie Beach'],
        suggestedExcursions: ['Addo Elephant National Park Safari', 'Donkin Heritage Trail Walking Tour'],
        diningRecommendations: ['Blackbeards Restaurant', 'Main Dining Room'],
        eveningEntertainment: ['Safari wildlife recap lecture']
      },
      {
        portName: 'Durban',
        arrivalTime: '08:00 AM',
        departureTime: '05:00 PM',
        distanceKm: 680,
        activities: ['Visit the Victoria Street Market', 'Relax on Golden Mile beachfront', 'Explore uShaka Marine World'],
        suggestedExcursions: ['Durban City & Golden Mile Tour', 'uShaka Marine World Excursion'],
        diningRecommendations: ['Bunny Chow at Cafe 1999', 'Main Dining Room'],
        eveningEntertainment: ['Zulu cultural dance performance']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 1180,
        activities: ['Farewell packing', 'Trivia contest', 'Art auction'],
        suggestedExcursions: [],
        diningRecommendations: ['Main Dining Room'],
        eveningEntertainment: ['Farewell Gala Show']
      },
      {
        portName: 'Cruising at Sea',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 620,
        activities: ['Final packing', 'Onboard shopping specials', 'Spa treatments'],
        suggestedExcursions: [],
        diningRecommendations: ['Main Dining Room'],
        eveningEntertainment: ['Farewell Variety Show']
      },
      {
        portId: 'cape-town-port',
        portName: 'Cape Town',
        arrivalTime: '06:00 AM',
        departureTime: 'Disembarkation',
        distanceKm: 0,
        activities: ['Final breakfast', 'Customs & departure transfers'],
        suggestedExcursions: [],
        diningRecommendations: ['Breakfast buffet'],
        eveningEntertainment: []
      }
    ]
  },
  // 7-Night Nile River Itinerary
  {
    id: '7n-nile-river-classic',
    region: 'Nile River',
    title: 'Nile River Treasures of Egypt',
    durationNights: 7,
    departurePortId: 'luxor-port',
    departurePortName: 'Luxor',
    arrivalPortId: 'aswan-port',
    arrivalPortName: 'Aswan',
    portsSequence: [
      {
        portId: 'luxor-port',
        portName: 'Luxor',
        arrivalTime: 'Embarkation',
        departureTime: 'Overnight',
        distanceKm: 0,
        activities: ['Embarkation on the Nile riverboat', 'Welcome cocktails with the Captain', 'Evening felucca sail on the Nile'],
        suggestedExcursions: [],
        diningRecommendations: ['Fine Dining Room - Egyptian Specialties'],
        eveningEntertainment: ['Nubian musical welcome performance']
      },
      {
        portId: 'luxor-port',
        portName: 'Luxor (East & West Bank)',
        arrivalTime: 'Overnight',
        departureTime: '02:00 PM',
        distanceKm: 0,
        activities: ['Tour Karnak Temple and Luxor Temple', 'Visit the Valley of the Kings', 'See the Colossi of Memnon'],
        suggestedExcursions: ['Valley of the Kings & West Bank Tour', 'Karnak & Luxor Temples Guided Tour'],
        diningRecommendations: ['Sofra Restaurant', 'Fine Dining Room'],
        eveningEntertainment: ['Luxor Temple sound and light show']
      },
      {
        portName: 'Edfu',
        arrivalTime: '07:00 AM',
        departureTime: '01:00 PM',
        distanceKm: 110,
        activities: ['Horse-carriage ride to the Temple of Horus', 'Explore one of Egypt\'s best-preserved temples', 'Local market browsing'],
        suggestedExcursions: ['Temple of Horus Guided Tour'],
        diningRecommendations: ['Onboard riverside lunch', 'Fine Dining Room'],
        eveningEntertainment: ['Egyptology lecture on deck']
      },
      {
        portName: 'Kom Ombo',
        arrivalTime: '02:00 PM',
        departureTime: '06:00 PM',
        distanceKm: 45,
        activities: ['Visit the unique double Temple of Kom Ombo', 'See the Crocodile Museum', 'Sunset views over the Nile'],
        suggestedExcursions: ['Kom Ombo Double Temple Tour'],
        diningRecommendations: ['Onboard sunset dinner', 'Fine Dining Room'],
        eveningEntertainment: ['Galabeya (traditional dress) themed party']
      },
      {
        portId: 'aswan-port',
        portName: 'Aswan',
        arrivalTime: '08:00 AM',
        departureTime: 'Overnight',
        distanceKm: 45,
        activities: ['Sail a traditional felucca around Elephantine Island', 'Visit the Aswan High Dam', 'Explore the Unfinished Obelisk'],
        suggestedExcursions: ['Aswan High Dam & Philae Temple Tour', 'Felucca Sailing Excursion'],
        diningRecommendations: ['Nubian House restaurant', 'Fine Dining Room'],
        eveningEntertainment: ['Nubian village cultural evening']
      },
      {
        portId: 'aswan-port',
        portName: 'Aswan (Abu Simbel optional excursion)',
        arrivalTime: 'Overnight',
        departureTime: 'Overnight',
        distanceKm: 0,
        activities: ['Optional early-morning flight to Abu Simbel temples', 'Visit the Nubian Museum', 'Free time for local souk shopping'],
        suggestedExcursions: ['Abu Simbel Temples Full-Day Excursion (optional flight)', 'Nubian Museum Guided Tour'],
        diningRecommendations: ['1902 Restaurant (Old Cataract Hotel)', 'Fine Dining Room'],
        eveningEntertainment: ['Farewell Captain\'s Gala Dinner']
      },
      {
        portId: 'aswan-port',
        portName: 'Aswan',
        arrivalTime: '06:00 AM',
        departureTime: 'Disembarkation',
        distanceKm: 0,
        activities: ['Breakfast onboard', 'Disembark and transfer to Aswan airport'],
        suggestedExcursions: [],
        diningRecommendations: ['Breakfast buffet'],
        eveningEntertainment: []
      }
    ]
  },

  // 7-Night Rhine River Itinerary
  {
    id: '7n-rhine-river-classic',
    region: 'Rhine River',
    title: 'Rhine River Castles & Vineyards',
    durationNights: 7,
    departurePortId: 'amsterdam-port',
    departurePortName: 'Amsterdam',
    arrivalPortId: 'basel-port',
    arrivalPortName: 'Basel',
    portsSequence: [
      {
        portId: 'amsterdam-port',
        portName: 'Amsterdam',
        arrivalTime: 'Embarkation',
        departureTime: 'Overnight',
        distanceKm: 0,
        activities: ['Embarkation on the river ship', 'Welcome cocktails with the Captain', 'Evening canal cruise through Amsterdam'],
        suggestedExcursions: [],
        diningRecommendations: ['Fine Dining Room - Dutch Specialties'],
        eveningEntertainment: ['Illuminated Amsterdam canal cruise']
      },
      {
        portName: 'Cologne',
        arrivalTime: '08:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 280,
        activities: ['Tour the twin-spired Cologne Cathedral', 'Explore the Old Town and Hohenzollern Bridge', 'Sample local Kölsch beer'],
        suggestedExcursions: ['Cologne Cathedral Guided Tour', 'Old Town Walking & Kölsch Beer Tasting'],
        diningRecommendations: ['Früh am Dom brewery restaurant', 'Fine Dining Room'],
        eveningEntertainment: ['Onboard German folk music trio']
      },
      {
        portName: 'Koblenz (Rhine Gorge)',
        arrivalTime: '07:00 AM',
        departureTime: '07:00 PM',
        distanceKm: 95,
        activities: ['Scenic cruising through the Rhine Gorge castles', 'Visit the Deutsches Eck monument', 'Cable car ride to Ehrenbreitstein Fortress'],
        suggestedExcursions: ['Rhine Gorge Castle Scenic Cruise Commentary', 'Ehrenbreitstein Fortress Cable Car Tour'],
        diningRecommendations: ['Weinhaus Hubertus', 'Fine Dining Room'],
        eveningEntertainment: ['Legend of the Lorelei storytelling on deck']
      },
      {
        portName: 'Rüdesheim',
        arrivalTime: '08:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 90,
        activities: ['Ride the cable car over vineyards to Niederwald Monument', 'Stroll the historic Drosselgasse lane', 'Taste Rüdesheimer coffee with local brandy'],
        suggestedExcursions: ['Niederwald Monument Cable Car & Vineyard Tour', 'Rhine Valley Wine Tasting Excursion'],
        diningRecommendations: ['Rüdesheimer Schloss', 'Fine Dining Room'],
        eveningEntertainment: ['German wine tasting seminar onboard']
      },
      {
        portName: 'Strasbourg',
        arrivalTime: '08:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 240,
        activities: ['Explore the Petite France canal district', 'Visit Strasbourg Cathedral', 'Taste Alsatian tarte flambée'],
        suggestedExcursions: ['Petite France & Cathedral Walking Tour', 'Alsace Wine Route Village Tour'],
        diningRecommendations: ['Maison Kammerzell', 'Fine Dining Room'],
        eveningEntertainment: ['Onboard Alsatian folk accordion performance']
      },
      {
        portName: 'Breisach (Black Forest)',
        arrivalTime: '07:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 130,
        activities: ['Day trip into the Black Forest', 'Visit a traditional cuckoo clock workshop', 'Sample Black Forest gateau'],
        suggestedExcursions: ['Black Forest Village & Cuckoo Clock Tour', 'Freiburg Old Town Excursion'],
        diningRecommendations: ['Black Forest farmhouse restaurant', 'Fine Dining Room'],
        eveningEntertainment: ['Onboard trivia contest']
      },
      {
        portId: 'basel-port',
        portName: 'Basel',
        arrivalTime: '06:00 AM',
        departureTime: 'Disembarkation',
        distanceKm: 70,
        activities: ['Breakfast onboard', 'Final Old Town stroll', 'Disembark and transfer to airport'],
        suggestedExcursions: [],
        diningRecommendations: ['Breakfast buffet'],
        eveningEntertainment: []
      }
    ]
  },

  // 7-Night Mekong River Itinerary
  {
    id: '7n-mekong-river-classic',
    region: 'Mekong River',
    title: 'Mekong Delta & Cambodia Discovery',
    durationNights: 7,
    departurePortId: 'saigon-port',
    departurePortName: 'Ho Chi Minh City',
    arrivalPortId: 'saigon-port',
    arrivalPortName: 'Ho Chi Minh City',
    portsSequence: [
      {
        portId: 'saigon-port',
        portName: 'Ho Chi Minh City',
        arrivalTime: 'Embarkation',
        departureTime: 'Overnight',
        distanceKm: 0,
        activities: ['Embarkation on the river ship', 'Welcome cocktails with the Captain', 'Evening city lights cruise'],
        suggestedExcursions: [],
        diningRecommendations: ['Fine Dining Room - Vietnamese Specialties'],
        eveningEntertainment: ['Traditional Vietnamese welcome performance']
      },
      {
        portName: 'Cai Be (Mekong Delta)',
        arrivalTime: '07:00 AM',
        departureTime: '05:00 PM',
        distanceKm: 105,
        activities: ['Visit the Cai Be floating market', 'Sampan boat ride through narrow canals', 'Tour a local coconut candy workshop'],
        suggestedExcursions: ['Cai Be Floating Market Sampan Tour', 'Mekong Delta Fruit Orchard Visit'],
        diningRecommendations: ['Local riverside homestay lunch', 'Fine Dining Room'],
        eveningEntertainment: ['Traditional Vietnamese folk music performance']
      },
      {
        portName: 'Sa Đéc',
        arrivalTime: '08:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 40,
        activities: ['Visit the historic Huynh Thuy Le ancient house', 'Explore Sa Đéc flower village', 'Cycle through rural delta villages'],
        suggestedExcursions: ['Huynh Thuy Le Ancient House Tour', 'Sa Đéc Flower Village Bike Tour'],
        diningRecommendations: ['Local delta homestyle restaurant', 'Fine Dining Room'],
        eveningEntertainment: ['Onboard Vietnamese cooking demonstration']
      },
      {
        portName: 'Chau Doc',
        arrivalTime: '07:00 AM',
        departureTime: '05:00 PM',
        distanceKm: 115,
        activities: ['Visit a floating fish farm village', 'Explore a Cham Muslim minority village', 'Tour Sam Mountain temples'],
        suggestedExcursions: ['Floating Fish Farm & Cham Village Tour', 'Sam Mountain Temple Excursion'],
        diningRecommendations: ['Bassac riverside restaurant', 'Fine Dining Room'],
        eveningEntertainment: ['Border river life documentary screening']
      },
      {
        portName: 'Phnom Penh (Cambodia)',
        arrivalTime: '08:00 AM',
        departureTime: 'Overnight',
        distanceKm: 120,
        activities: ['Visit the Royal Palace and Silver Pagoda', 'Tour the Killing Fields and Tuol Sleng Museum', 'Explore the Central Market'],
        suggestedExcursions: ['Royal Palace & Silver Pagoda Tour', 'Killing Fields & Genocide Museum Tour'],
        diningRecommendations: ['Malis Restaurant', 'Fine Dining Room'],
        eveningEntertainment: ['Khmer classical dance performance']
      },
      {
        portName: 'Phnom Penh (Cambodia)',
        arrivalTime: 'Overnight',
        departureTime: '05:00 PM',
        distanceKm: 0,
        activities: ['Cyclo tour of the riverside promenade', 'Visit a local silk-weaving village', 'Free time for independent exploration'],
        suggestedExcursions: ['Phnom Penh Cyclo & Riverside Tour', 'Silk Village Weaving Demonstration'],
        diningRecommendations: ['Riverside promenade cafes', 'Fine Dining Room'],
        eveningEntertainment: ['Farewell Captain\'s Gala Dinner']
      },
      {
        portId: 'saigon-port',
        portName: 'Ho Chi Minh City',
        arrivalTime: '06:00 AM',
        departureTime: 'Disembarkation',
        distanceKm: 0,
        activities: ['Breakfast onboard', 'Disembark and transfer to airport'],
        suggestedExcursions: [],
        diningRecommendations: ['Breakfast buffet'],
        eveningEntertainment: []
      }
    ]
  },

  // 7-Night Amazon River Itinerary
  {
    id: '7n-amazon-river-classic',
    region: 'Amazon River',
    title: 'Amazon Rainforest River Expedition',
    durationNights: 7,
    departurePortId: 'manaus-port',
    departurePortName: 'Manaus',
    arrivalPortId: 'manaus-port',
    arrivalPortName: 'Manaus',
    portsSequence: [
      {
        portId: 'manaus-port',
        portName: 'Manaus',
        arrivalTime: 'Embarkation',
        departureTime: 'Overnight',
        distanceKm: 0,
        activities: ['Embarkation on the Amazon riverboat', 'Tour the ornate Amazon Theatre before boarding', 'Welcome cocktails with the Captain'],
        suggestedExcursions: [],
        diningRecommendations: ['Fine Dining Room - Amazonian Specialties'],
        eveningEntertainment: ['Amazonian folklore welcome performance']
      },
      {
        portName: 'Meeting of the Waters',
        arrivalTime: '07:00 AM',
        departureTime: '11:00 AM',
        distanceKm: 15,
        activities: ['Witness the Rio Negro and Solimões rivers flow side by side', 'Piranha fishing excursion', 'Visit a riverside caboclo family'],
        suggestedExcursions: ['Meeting of the Waters Boat Excursion', 'Piranha Fishing Adventure'],
        diningRecommendations: ['Onboard riverside lunch', 'Fine Dining Room'],
        eveningEntertainment: ['Amazon ecology lecture on deck']
      },
      {
        portName: 'Anavilhanas Archipelago',
        arrivalTime: '07:00 AM',
        departureTime: '05:00 PM',
        distanceKm: 90,
        activities: ['Canoe through flooded forest channels', 'Spot pink river dolphins', 'Guided rainforest canopy walk'],
        suggestedExcursions: ['Anavilhanas Archipelago Canoe Tour', 'Pink Dolphin Watching Excursion'],
        diningRecommendations: ['Onboard jungle-view dinner', 'Fine Dining Room'],
        eveningEntertainment: ['Night sounds of the jungle - nocturnal wildlife spotting']
      },
      {
        portName: 'Boca da Valeria',
        arrivalTime: '08:00 AM',
        departureTime: '02:00 PM',
        distanceKm: 130,
        activities: ['Visit a remote riverside village', 'Learn traditional cassava flour preparation', 'Meet local artisans and their handicrafts'],
        suggestedExcursions: ['Boca da Valeria Village Visit', 'Traditional Amazonian Craft Workshop'],
        diningRecommendations: ['Village-style riverside lunch', 'Fine Dining Room'],
        eveningEntertainment: ['Onboard capoeira demonstration']
      },
      {
        portName: 'Parintins',
        arrivalTime: '07:00 AM',
        departureTime: '05:00 PM',
        distanceKm: 210,
        activities: ['Tour the Bumbódromo festival arena', 'Visit a Boi-Bumbá costume workshop', 'Explore local riverside markets'],
        suggestedExcursions: ['Bumbódromo & Boi-Bumbá Culture Tour', 'Parintins Riverside Market Walk'],
        diningRecommendations: ['Local Parintins fish restaurant', 'Fine Dining Room'],
        eveningEntertainment: ['Boi-Bumbá festival dance performance']
      },
      {
        portName: 'Rio Negro Jungle Lodge Excursion',
        arrivalTime: '07:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 160,
        activities: ['Guided rainforest hike with a naturalist', 'Night caiman spotting excursion', 'Treetop canopy tower views'],
        suggestedExcursions: ['Rainforest Naturalist Hike', 'Night Caiman Spotting Boat Tour'],
        diningRecommendations: ['Jungle lodge dinner', 'Fine Dining Room'],
        eveningEntertainment: ['Farewell Captain\'s Gala Dinner']
      },
      {
        portId: 'manaus-port',
        portName: 'Manaus',
        arrivalTime: '06:00 AM',
        departureTime: 'Disembarkation',
        distanceKm: 0,
        activities: ['Breakfast onboard', 'Disembark and transfer to airport'],
        suggestedExcursions: [],
        diningRecommendations: ['Breakfast buffet'],
        eveningEntertainment: []
      }
    ]
  },

  // 7-Night Mississippi River Itinerary
  {
    id: '7n-mississippi-river-classic',
    region: 'Mississippi River',
    title: 'Mississippi River Delta to Memphis',
    durationNights: 7,
    departurePortId: 'new-orleans-port',
    departurePortName: 'New Orleans',
    arrivalPortId: 'memphis-port',
    arrivalPortName: 'Memphis',
    portsSequence: [
      {
        portId: 'new-orleans-port',
        portName: 'New Orleans',
        arrivalTime: 'Embarkation',
        departureTime: 'Overnight',
        distanceKm: 0,
        activities: ['Embarkation on the paddlewheel riverboat', 'Live jazz welcome reception', 'Evening stroll through the French Quarter'],
        suggestedExcursions: [],
        diningRecommendations: ['Fine Dining Room - Creole Specialties'],
        eveningEntertainment: ['Dixieland jazz band welcome performance']
      },
      {
        portName: 'Baton Rouge',
        arrivalTime: '08:00 AM',
        departureTime: '05:00 PM',
        distanceKm: 130,
        activities: ['Tour the Louisiana Old State Capitol', 'Visit a historic antebellum plantation', 'Explore the USS Kidd naval museum'],
        suggestedExcursions: ['Antebellum Plantation Tour', 'Louisiana State Capitol & Riverfront Tour'],
        diningRecommendations: ['Mansurs on the Boulevard', 'Fine Dining Room'],
        eveningEntertainment: ['Riverboat calliope organ performance']
      },
      {
        portName: 'St. Francisville',
        arrivalTime: '07:00 AM',
        departureTime: '02:00 PM',
        distanceKm: 45,
        activities: ['Tour the Rosedown Plantation gardens', 'Walk the historic small-town district', 'Visit the Myrtles Plantation'],
        suggestedExcursions: ['Rosedown Plantation & Gardens Tour', 'Historic St. Francisville Walking Tour'],
        diningRecommendations: ['The Francis Southern Table & Bar', 'Fine Dining Room'],
        eveningEntertainment: ['Southern history lecture on deck']
      },
      {
        portName: 'Natchez',
        arrivalTime: '08:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 170,
        activities: ['Tour antebellum mansions along the bluff', 'Walk the historic Natchez Under-the-Hill district', 'Visit Natchez National Historical Park'],
        suggestedExcursions: ['Natchez Antebellum Mansion Tour', 'Natchez Under-the-Hill Walking Tour'],
        diningRecommendations: ['Fat Mama\'s Tamales', 'Fine Dining Room'],
        eveningEntertainment: ['Southern blues live music']
      },
      {
        portName: 'Vicksburg',
        arrivalTime: '07:00 AM',
        departureTime: '05:00 PM',
        distanceKm: 130,
        activities: ['Tour the Vicksburg National Military Park', 'Visit the Old Court House Museum', 'Explore Civil War-era riverfront murals'],
        suggestedExcursions: ['Vicksburg National Military Park Tour', 'Riverfront Murals & Old Court House Tour'],
        diningRecommendations: ['Walnut Hills Restaurant', 'Fine Dining Room'],
        eveningEntertainment: ['Civil War history lecture on deck']
      },
      {
        portName: 'Greenville',
        arrivalTime: '08:00 AM',
        departureTime: '05:00 PM',
        distanceKm: 180,
        activities: ['Visit the Delta Blues Museum exhibits', 'Explore Mississippi Delta blues heritage sites', 'Local Delta tamale tasting'],
        suggestedExcursions: ['Mississippi Delta Blues Heritage Tour', 'Delta Tamale Trail Tasting Tour'],
        diningRecommendations: ['Doe\'s Eat Place', 'Fine Dining Room'],
        eveningEntertainment: ['Live Delta blues performance']
      },
      {
        portId: 'memphis-port',
        portName: 'Memphis',
        arrivalTime: '07:00 AM',
        departureTime: 'Disembarkation',
        distanceKm: 200,
        activities: ['Farewell breakfast onboard', 'Optional Beale Street & Graceland visit before departure', 'Disembark and transfer to airport'],
        suggestedExcursions: ['Beale Street & Graceland Pre-Flight Tour'],
        diningRecommendations: ['Breakfast buffet'],
        eveningEntertainment: []
      }
    ]
  },

  // 60-Night World Cruise Itinerary
  {
    id: '60n-world-cruise-circumnavigation',
    region: 'World Cruises',
    title: 'Grand World Cruise Circumnavigation',
    durationNights: 60,
    departurePortId: 'southampton',
    departurePortName: 'Southampton',
    arrivalPortId: 'southampton',
    arrivalPortName: 'Southampton',
    portsSequence: [
      {
        portId: 'southampton',
        portName: 'Southampton',
        arrivalTime: 'Embarkation',
        departureTime: '05:00 PM',
        distanceKm: 0,
        activities: ['Embarkation champagne reception', 'World cruise briefing with the Captain', 'Safety muster drill'],
        suggestedExcursions: [],
        diningRecommendations: ['Main Dining Room', 'Grill Room'],
        eveningEntertainment: ['Bon Voyage Gala Show']
      },
      {
        portName: 'Cruising at Sea (Atlantic Crossing)',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 1200,
        activities: ['Enrichment lecture series begins', 'Ballroom dance classes', 'Trivia and bridge tournaments'],
        suggestedExcursions: [],
        diningRecommendations: ['Specialty Grill', 'Main Dining Room'],
        eveningEntertainment: ['West End style theater production']
      },
      {
        portId: 'los-angeles-port',
        portName: 'Los Angeles',
        arrivalTime: '08:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 8900,
        activities: ['Day trip to Hollywood and the Walk of Fame', 'Explore Santa Monica Pier', 'Visit the Getty Center'],
        suggestedExcursions: ['Hollywood & Beverly Hills Tour', 'Santa Monica Pier Excursion'],
        diningRecommendations: ['Republique (Hollywood)', 'Main Dining Room'],
        eveningEntertainment: ['Guest lecturer series on Pacific history']
      },
      {
        portId: 'honolulu',
        portName: 'Honolulu',
        arrivalTime: '08:00 AM',
        departureTime: 'Overnight',
        distanceKm: 4100,
        activities: ['Relax on Waikiki Beach', 'Climb Diamond Head Crater', 'Visit Pearl Harbor'],
        suggestedExcursions: ['Pearl Harbor & Diamond Head Tour', 'Waikiki Beach & Honolulu City Tour'],
        diningRecommendations: ['Duke\'s Waikiki', 'Main Dining Room'],
        eveningEntertainment: ['Traditional luau on deck']
      },
      {
        portName: 'Cruising at Sea (Pacific Crossing)',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 3600,
        activities: ['International Date Line crossing ceremony', 'Culinary masterclasses', 'Guest lecturer series on Pacific exploration'],
        suggestedExcursions: [],
        diningRecommendations: ['Chef\'s Table Dining', 'Main Dining Room'],
        eveningEntertainment: ['Polynesian cultural show']
      },
      {
        portId: 'auckland-port',
        portName: 'Auckland',
        arrivalTime: '08:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 3900,
        activities: ['Ride the Sky Tower observation deck', 'Explore Waiheke Island wineries', 'Visit the Auckland War Memorial Museum'],
        suggestedExcursions: ['Waiheke Island Wine Tour', 'Auckland City Highlights Tour'],
        diningRecommendations: ['The Grove', 'Main Dining Room'],
        eveningEntertainment: ['Māori cultural performance']
      },
      {
        portId: 'sydney-port',
        portName: 'Sydney',
        arrivalTime: '08:00 AM',
        departureTime: 'Overnight',
        distanceKm: 2150,
        activities: ['Tour the Sydney Opera House', 'Walk the Sydney Harbour Bridge', 'Relax at Bondi Beach'],
        suggestedExcursions: ['Sydney Opera House & Harbour Bridge Tour', 'Bondi to Coogee Coastal Walk'],
        diningRecommendations: ['Quay', 'Main Dining Room'],
        eveningEntertainment: ['Overnight in port - optional shore nightlife']
      },
      {
        portName: 'Cruising at Sea (Indian Ocean Crossing)',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 4200,
        activities: ['Guest lecturer series on Indian Ocean trade routes', 'Deck sports tournaments', 'Spa relaxation days'],
        suggestedExcursions: [],
        diningRecommendations: ['Specialty Seafood Restaurant', 'Main Dining Room'],
        eveningEntertainment: ['Casino gala night']
      },
      {
        portId: 'singapore-port',
        portName: 'Singapore',
        arrivalTime: '08:00 AM',
        departureTime: 'Overnight',
        distanceKm: 6300,
        activities: ['Explore Gardens by the Bay', 'Visit Sentosa Island', 'Food tour of Chinatown hawker stalls'],
        suggestedExcursions: ['Gardens by the Bay & Marina Bay Tour', 'Singapore Food & Culture Walking Tour'],
        diningRecommendations: ['Liao Fan Hawker Chan', 'Main Dining Room'],
        eveningEntertainment: ['Overnight in port - optional shore nightlife']
      },
      {
        portId: 'mumbai-port',
        portName: 'Mumbai',
        arrivalTime: '08:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 3900,
        activities: ['Visit the Gateway of India', 'Tour Elephanta Caves', 'Explore Crawford Market'],
        suggestedExcursions: ['Gateway of India & Elephanta Caves Tour', 'Mumbai Heritage City Tour'],
        diningRecommendations: ['Trishna', 'Main Dining Room'],
        eveningEntertainment: ['Bollywood dance performance']
      },
      {
        portId: 'dubai-port',
        portName: 'Dubai',
        arrivalTime: '08:00 AM',
        departureTime: 'Overnight',
        distanceKm: 1900,
        activities: ['Ride to the top of the Burj Khalifa', 'Desert safari and dune bashing', 'Explore the historic Al Fahidi district'],
        suggestedExcursions: ['Burj Khalifa & Dubai Mall Tour', 'Desert Safari & Dune Bashing Adventure'],
        diningRecommendations: ['Pierchic', 'Main Dining Room'],
        eveningEntertainment: ['Overnight in port - optional shore nightlife']
      },
      {
        portName: 'Suez Canal Transit',
        arrivalTime: '06:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 2400,
        activities: ['Daylight transit of the Suez Canal', 'Canal engineering lecture on deck', 'Photograph passing container ships and desert scenery'],
        suggestedExcursions: [],
        diningRecommendations: ['Observation Deck lunch buffet', 'Main Dining Room'],
        eveningEntertainment: ['Suez Canal history lecture']
      },
      {
        portId: 'piraeus',
        portName: 'Athens (Piraeus)',
        arrivalTime: '08:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 890,
        activities: ['Climb the Acropolis to see the Parthenon', 'Explore the Acropolis Museum', 'Walk through the Plaka district'],
        suggestedExcursions: ['Acropolis & Plaka Guided Tour', 'Ancient Agora Walking Tour'],
        diningRecommendations: ['Strofi Tavern', 'Main Dining Room'],
        eveningEntertainment: ['Greek folklore dance show on deck']
      },
      {
        portId: 'barcelona',
        portName: 'Barcelona',
        arrivalTime: '08:00 AM',
        departureTime: '06:00 PM',
        distanceKm: 1750,
        activities: ['Visit La Sagrada Família', 'Walk the Gothic Quarter', 'Explore Park Güell'],
        suggestedExcursions: ['Sagrada Família & Gaudí Architecture Tour', 'Gothic Quarter Walking Tour'],
        diningRecommendations: ['El Nacional', 'Main Dining Room'],
        eveningEntertainment: ['Flamenco performance']
      },
      {
        portName: 'Cruising at Sea (Atlantic Return)',
        arrivalTime: 'At Sea',
        departureTime: 'At Sea',
        distanceKm: 1900,
        activities: ['World cruise farewell lecture series', 'Final culinary masterclasses', 'Circumnavigation certificate ceremony'],
        suggestedExcursions: [],
        diningRecommendations: ['Chef\'s Table Dining', 'Main Dining Room'],
        eveningEntertainment: ['Farewell Grand Gala Show']
      },
      {
        portId: 'southampton',
        portName: 'Southampton',
        arrivalTime: '06:00 AM',
        departureTime: 'Disembarkation',
        distanceKm: 200,
        activities: ['Farewell breakfast', 'Circumnavigation medallion presentation', 'Disembark and departure transfers'],
        suggestedExcursions: [],
        diningRecommendations: ['Breakfast buffet'],
        eveningEntertainment: []
      }
    ]
  }
];

export function getItineraryTemplate(region: string, durationNights: number): ItineraryTemplate | undefined {
  // Try to find exact match
  let match = ITINERARY_TEMPLATES.find((t) => t.region === region && t.durationNights === durationNights);
  if (match) return match;

  // Fallback to closest match in same region
  const regionMatches = ITINERARY_TEMPLATES.filter((t) => t.region === region);
  if (regionMatches.length > 0) {
    return regionMatches.sort((a, b) => Math.abs(a.durationNights - durationNights) - Math.abs(b.durationNights - durationNights))[0];
  }

  // General fallback
  return ITINERARY_TEMPLATES[0];
}
