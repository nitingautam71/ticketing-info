<?php
/**
 * Ticketing-Info PHP API Router for InfinityFree
 * Replicates all Node.js Express endpoints in a light-weight PHP script.
 */

// Enable Error Reporting for debugging if needed (disabled in production)
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Set Headers for JSON and CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Handle OPTIONS Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Load Configuration if available
$config_file = __DIR__ . '/config.php';
$gemini_key = '';
if (file_exists($config_file)) {
    include_once $config_file;
    if (defined('GEMINI_API_KEY')) {
        $gemini_key = GEMINI_API_KEY;
    }
}

// Database helper functions
$db_file = __DIR__ . '/db.json';

function readDB() {
    global $db_file;
    if (!file_exists($db_file)) {
        return ['bookings' => [], 'profile' => [
            'name' => 'John Doe',
            'email' => 'john.doe@example.com',
            'phone' => '+1 (555) 019-2834',
            'passport' => 'A12345678',
            'nationality' => 'United States',
            'homeAirport' => 'JFK',
            'mealPreference' => 'Standard',
            'seatPreference' => 'Window'
        ]];
    }
    $raw = file_get_contents($db_file);
    $data = json_decode($raw, true);
    if (!$data) {
        return ['bookings' => [], 'profile' => []];
    }
    return $data;
}

function writeDB($data) {
    global $db_file;
    file_put_contents($db_file, json_encode($data, JSON_PRETTY_PRINT));
}

// Get Requested Route
$route = isset($_GET['route']) ? rtrim($_GET['route'], '/') : '';
$method = $_SERVER['REQUEST_METHOD'];

// Mock Data Generators
function generateMockFlights($from, $to, $date, $flightClass) {
    $airlines = [
        ['name' => 'Delta Air Lines', 'logo' => 'DL', 'bag' => '1 Carry-on, 1 Checked bag free'],
        ['name' => 'United Airlines', 'logo' => 'UA', 'bag' => '1 Carry-on, checked bag $30'],
        ['name' => 'American Airlines', 'logo' => 'AA', 'bag' => '1 Carry-on, 1 Checked bag free'],
        ['name' => 'British Airways', 'logo' => 'BA', 'bag' => '2 Checked bags free'],
        ['name' => 'Singapore Airlines', 'logo' => 'SQ', 'bag' => '2 Checked bags free'],
        ['name' => 'Emirates', 'logo' => 'EK', 'bag' => '2 Checked bags free'],
        ['name' => 'Lufthansa', 'logo' => 'LH', 'bag' => '1 Checked bag free']
    ];

    $airports = [
        'JFK' => 'New York JFK', 'LHR' => 'London Heathrow', 'HND' => 'Tokyo Haneda', 
        'SFO' => 'San Francisco', 'CDG' => 'Paris Charles de Gaulle', 'DXB' => 'Dubai Intl',
        'SIN' => 'Singapore Changi', 'LAX' => 'Los Angeles Intl', 'ORD' => 'Chicago O\'Hare'
    ];

    $fCode = strtoupper($from ?: 'JFK');
    $tCode = strtoupper($to ?: 'LHR');

    $results = [];
    $count = rand(5, 8);

    for ($i = 0; $i < $count; $i++) {
        $airline = $airlines[array_rand($airlines)];
        $flNum = rand(100, 899);
        $depHour = rand(6, 21);
        $depMin = rand(0, 1) ? '30' : '00';
        $durationHours = rand(4, 13);
        $durationMins = rand(0, 1) ? '45' : '15';

        $arrHour = ($depHour + $durationHours) % 24;
        $depTime = sprintf("%02d:%s %s", $depHour > 12 ? $depHour - 12 : ($depHour === 0 ? 12 : $depHour), $depMin, $depHour >= 12 ? 'PM' : 'AM');
        $arrTime = sprintf("%02d:%s %s", $arrHour > 12 ? $arrHour - 12 : ($arrHour === 0 ? 12 : $arrHour), $durationMins, $arrHour >= 12 ? 'PM' : 'AM');

        $stops = rand(0, 10) > 6 ? 1 : 0;
        $stopovers = [];
        if ($stops === 1) {
            foreach (array_keys($airports) as $key) {
                if ($key !== $fCode && $key !== $tCode) {
                    $stopovers[] = $key;
                    break;
                }
            }
        }

        $basePrice = rand(250, 850);
        if ($flightClass === 'Premium Economy') $basePrice *= 1.5;
        if ($flightClass === 'Business') $basePrice *= 3;
        if ($flightClass === 'First') $basePrice *= 5;

        $results[] = [
            'id' => "FL-{$fCode}-{$tCode}-{$flNum}-{$i}",
            'airline' => $airline['name'],
            'airlineLogo' => $airline['logo'],
            'flightNumber' => $airline['logo'] . $flNum,
            'departureAirport' => $fCode,
            'arrivalAirport' => $tCode,
            'departureTime' => $depTime,
            'arrivalTime' => $arrTime,
            'duration' => "{$durationHours}h {$durationMins}m",
            'stops' => $stops,
            'stopoverAirports' => $stopovers,
            'price' => (int)$basePrice,
            'class' => $flightClass,
            'baggage' => $airline['bag']
        ];
    }

    usort($results, function($a, $b) {
        return $a['price'] - $b['price'];
    });

    return $results;
}

function generateMockHotels($location) {
    $hotelBrands = [
        ['name' => 'Grand Plaza Resort', 'rating' => 4.6, 'reviews' => 1250, 'stars' => 5, 'image' => 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop&q=60'],
        ['name' => 'Vanguard Boutique Hotel', 'rating' => 4.8, 'reviews' => 420, 'stars' => 4, 'image' => 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&auto=format&fit=crop&q=60'],
        ['name' => 'Royal Palace Suite', 'rating' => 4.9, 'reviews' => 890, 'stars' => 5, 'image' => 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&auto=format&fit=crop&q=60'],
        ['name' => 'Comfort Inn & Executive Suites', 'rating' => 4.2, 'reviews' => 2100, 'stars' => 3, 'image' => 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&auto=format&fit=crop&q=60'],
        ['name' => 'The Meridian Luxury Lodge', 'rating' => 4.7, 'reviews' => 670, 'stars' => 5, 'image' => 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=500&auto=format&fit=crop&q=60'],
        ['name' => 'Apex Urban Residences', 'rating' => 4.5, 'reviews' => 1530, 'stars' => 4, 'image' => 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&auto=format&fit=crop&q=60']
    ];

    $amenitiesList = ['Free WiFi', 'Infinity Pool', 'Full Gym', 'Room Service', 'Spa Center', 'Free Breakfast', 'Airport Shuttle', 'Michelin Star Dining'];

    $results = [];
    foreach ($hotelBrands as $idx => $b) {
        $price = rand(120, 500);
        $selectedAmenities = [];
        foreach ($amenitiesList as $amenity) {
            if ((rand(1, 100) / 100) > 0.4) {
                $selectedAmenities[] = $amenity;
            }
        }
        if (empty($selectedAmenities)) {
            $selectedAmenities[] = 'Free WiFi';
        }

        $results[] = [
            'id' => 'HTL-' . $idx . '-' . rand(1000, 9999),
            'name' => $b['name'],
            'location' => $location ?: 'London, United Kingdom',
            'rating' => $b['rating'],
            'reviewsCount' => $b['reviews'],
            'stars' => $b['stars'],
            'pricePerNight' => $price,
            'image' => $b['image'],
            'amenities' => $selectedAmenities,
            'roomTypes' => [
                ['name' => 'Standard King Room', 'price' => $price, 'description' => 'One King bed, modern bathroom, smart TV, city view.', 'capacity' => 2],
                ['name' => 'Executive Suite', 'price' => (int)($price * 1.5), 'description' => 'Spacious suite with separate living room, workspace, and VIP lounge access.', 'capacity' => 3],
                ['name' => 'Presidential Penthouse', 'price' => (int)($price * 3), 'description' => 'Top floor ultimate luxury, full panoramic glass windows, private balcony.', 'capacity' => 4]
            ]
        ];
    }
    return $results;
}

// ROUTER ENDPOINTS
if ($route === 'flights') {
    $from = isset($_GET['from']) ? $_GET['from'] : 'JFK';
    $to = isset($_GET['to']) ? $_GET['to'] : 'LHR';
    $date = isset($_GET['date']) ? $_GET['date'] : '2026-08-15';
    $class = isset($_GET['class']) ? $_GET['class'] : 'Economy';
    
    echo json_encode(generateMockFlights($from, $to, $date, $class));
    exit;
}

if ($route === 'hotels') {
    $location = isset($_GET['location']) ? $_GET['location'] : 'London';
    echo json_encode(generateMockHotels($location));
    exit;
}

if ($route === 'cruises') {
    echo json_encode([
        [
            'id' => 'CR-101',
            'name' => 'Bahamas Royal Escape',
            'cruiseLine' => 'Royal Caribbean',
            'departurePort' => 'Miami, FL',
            'durationDays' => 7,
            'price' => 699,
            'image' => 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=500&auto=format&fit=crop&q=60',
            'rating' => 4.7,
            'itinerary' => [
                ['day' => 1, 'port' => 'Miami, FL', 'activities' => 'Boarding and Welcome Gala.'],
                ['day' => 2, 'port' => 'At Sea', 'activities' => 'Relaxation, pool parties, evening Broadway show.'],
                ['day' => 3, 'port' => 'Nassau, Bahamas', 'activities' => 'Snorkeling, beach resorts, duty-free shopping.'],
                ['day' => 4, 'port' => 'Perfect Day at CocoCay', 'activities' => 'Waterpark, private cabanas, zip-lining.'],
                ['day' => 5, 'port' => 'At Sea', 'activities' => 'Casino night, gourmet fine dining experience.'],
                ['day' => 6, 'port' => 'Key West, FL', 'activities' => 'Historic town tours, sunset celebration.'],
                ['day' => 7, 'port' => 'Miami, FL', 'activities' => 'Disembarkation.']
            ],
            'cabins' => [
                ['type' => 'Interior Stateroom', 'price' => 699, 'description' => 'Cozy and cost-effective, two twin beds, desk.'],
                ['type' => 'Oceanview Stateroom', 'price' => 899, 'description' => 'Elegant cabin with a large window facing the crystal oceans.'],
                ['type' => 'Grand Balcony Suite', 'price' => 1499, 'description' => 'Luxurious private balcony, spacious living lounge, premium concierge.']
            ]
        ],
        [
            'id' => 'CR-202',
            'name' => 'Mediterranean Wonders',
            'cruiseLine' => 'Celebrity Cruises',
            'departurePort' => 'Barcelona, Spain',
            'durationDays' => 10,
            'price' => 1399,
            'image' => 'https://images.unsplash.com/photo-1511316695145-4992006ffddb?w=500&auto=format&fit=crop&q=60',
            'rating' => 4.9,
            'itinerary' => [
                ['day' => 1, 'port' => 'Barcelona, Spain', 'activities' => 'Embarkation.'],
                ['day' => 2, 'port' => 'Marseille, France', 'activities' => 'Provence historical village exploration.'],
                ['day' => 3, 'port' => 'Nice (Villefranche), France', 'activities' => 'Stroll along French Riviera / Monaco.'],
                ['day' => 4, 'port' => 'Florence/Pisa, Italy', 'activities' => 'Tuscany wine tasting, Leaning Tower visits.'],
                ['day' => 5, 'port' => 'Rome (Civitavecchia), Italy', 'activities' => 'Colosseum and Vatican City sightseeing.'],
                ['day' => 6, 'port' => 'Naples/Capri, Italy', 'activities' => 'Pompeii exploration, Capri boat ride.'],
                ['day' => 7, 'port' => 'At Sea', 'activities' => 'On-deck spa relaxation, astronomical stargazing.'],
                ['day' => 8, 'port' => 'Mykonos, Greece', 'activities' => 'Iconic windmills, seaside lunch.'],
                ['day' => 9, 'port' => 'Athens, Greece', 'activities' => 'Acropolis and Parthenon exploration.'],
                ['day' => 10, 'port' => 'Athens, Greece', 'activities' => 'Disembarkation.']
            ],
            'cabins' => [
                ['type' => 'Standard Stateroom', 'price' => 1399, 'description' => 'Cozy bed, complete amenities.'],
                ['type' => 'Ocean View Balcony', 'price' => 1899, 'description' => 'Private balcony facing beautiful European coastlines.'],
                ['type' => 'Ultra Suite', 'price' => 2999, 'description' => 'Enormous living area, personal butler service, fine luxury.']
            ]
        ]
    ]);
    exit;
}

if ($route === 'trains') {
    $from = isset($_GET['from']) ? $_GET['from'] : 'Paris';
    $to = isset($_GET['to']) ? $_GET['to'] : 'London';
    echo json_encode([
        [
            'id' => 'TR-301',
            'operator' => 'Eurostar',
            'trainNumber' => 'EST9012',
            'departureStation' => "$from Gare du Nord",
            'arrivalStation' => "$to St Pancras Intl",
            'departureTime' => '08:15 AM',
            'arrivalTime' => '10:35 AM',
            'duration' => '2h 20m',
            'price' => 89,
            'classes' => [
                ['name' => 'Standard', 'price' => 89],
                ['name' => 'Standard Premier', 'price' => 149],
                ['name' => 'Business Premier', 'price' => 289]
            ]
        ],
        [
            'id' => 'TR-302',
            'operator' => 'Eurostar',
            'trainNumber' => 'EST9054',
            'departureStation' => "$from Gare du Nord",
            'arrivalStation' => "$to St Pancras Intl",
            'departureTime' => '01:45 PM',
            'arrivalTime' => '04:05 PM',
            'duration' => '2h 20m',
            'price' => 115,
            'classes' => [
                ['name' => 'Standard', 'price' => 115],
                ['name' => 'Standard Premier', 'price' => 175],
                ['name' => 'Business Premier', 'price' => 320]
            ]
        ]
    ]);
    exit;
}

if ($route === 'rentals') {
    echo json_encode([
        ['id' => 'RC-1', 'provider' => 'Hertz', 'model' => 'Tesla Model 3', 'category' => 'Luxury', 'seats' => 5, 'transmission' => 'Automatic', 'pricePerDay' => 85, 'image' => 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=500&auto=format&fit=crop&q=60', 'rating' => 4.8],
        ['id' => 'RC-2', 'provider' => 'Enterprise', 'model' => 'Toyota RAV4', 'category' => 'SUV', 'seats' => 5, 'transmission' => 'Automatic', 'pricePerDay' => 65, 'image' => 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500&auto=format&fit=crop&q=60', 'rating' => 4.6],
        ['id' => 'RC-3', 'provider' => 'Avis', 'model' => 'Ford Mustang Convertible', 'category' => 'Convertible', 'seats' => 4, 'transmission' => 'Automatic', 'pricePerDay' => 120, 'image' => 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500&auto=format&fit=crop&q=60', 'rating' => 4.7],
        ['id' => 'RC-4', 'provider' => 'Budget', 'model' => 'Hyundai Elantra', 'category' => 'Economy', 'seats' => 5, 'transmission' => 'Automatic', 'pricePerDay' => 39, 'image' => 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500&auto=format&fit=crop&q=60', 'rating' => 4.3]
    ]);
    exit;
}

if ($route === 'transfers') {
    echo json_encode([
        ['id' => 'TF-1', 'type' => 'Private Sedan', 'capacity' => 3, 'price' => 55, 'duration' => '45m', 'description' => 'Meet & greet at arrival hall. Luxury sedan with professional driver.'],
        ['id' => 'TF-2', 'type' => 'SUV SUV', 'capacity' => 6, 'price' => 85, 'duration' => '45m', 'description' => 'Spacious SUV perfect for families and excess heavy luggage.'],
        ['id' => 'TF-3', 'type' => 'Luxury Limo', 'capacity' => 4, 'price' => 180, 'duration' => '50m', 'description' => 'VIP premium treatment, chilled champagne, ultimate comfort and class.'],
        ['id' => 'TF-4', 'type' => 'Shared Shuttle', 'capacity' => 12, 'price' => 18, 'duration' => '1h 15m', 'description' => 'Budget friendly shared shuttle direct to central hotels.']
    ]);
    exit;
}

if ($route === 'insurance') {
    echo json_encode([
        ['id' => 'INS-1', 'name' => 'SafeTravel Basic', 'tier' => 'Basic', 'price' => 29, 'medicalCoverage' => '$50,000', 'tripCancellation' => 'Up to $1,000', 'luggageCoverage' => 'Up to $500', 'description' => 'Essential protection for budget-minded explorers.'],
        ['id' => 'INS-2', 'name' => 'SafeTravel Explorer', 'tier' => 'Premium', 'price' => 59, 'medicalCoverage' => '$150,000', 'tripCancellation' => 'Up to $5,000', 'luggageCoverage' => 'Up to $1,500', 'description' => 'Most popular! Excellent coverage for flight delays, lost baggage, and emergencies.'],
        ['id' => 'INS-3', 'name' => 'SafeTravel Platinum Elite', 'tier' => 'Elite', 'price' => 99, 'medicalCoverage' => '$1,000,000', 'tripCancellation' => 'Up to $15,000', 'luggageCoverage' => 'Up to $3,500', 'description' => 'Premium comprehensive peace-of-mind including cancel-for-any-reason policy.']
    ]);
    exit;
}

if ($route === 'visa/check') {
    $nationality = isset($_GET['nationality']) ? $_GET['nationality'] : 'United States';
    $destination = isset($_GET['destination']) ? $_GET['destination'] : 'United Kingdom';
    
    $nat = strtolower($nationality);
    $dest = strtolower($destination);

    $requirements = ['Valid passport (at least 6 months validity)', 'Proof of onward travel/return flight', 'Proof of sufficient travel funds'];
    $visaRequired = false;
    $maxStay = 90;
    $processing = 'Not required';
    $fee = 0;

    if (strpos($dest, 'united kingdom') !== false || strpos($dest, 'uk') !== false) {
        if (strpos($nat, 'united states') !== false || strpos($nat, 'canada') !== false || strpos($nat, 'australia') !== false || strpos($nat, 'germany') !== false || strpos($nat, 'france') !== false || strpos($nat, 'japan') !== false) {
            $visaRequired = false;
            $maxStay = 180;
        } else {
            $visaRequired = true;
            $maxStay = 180;
            $processing = '10 - 15 Business Days';
            $fee = 150;
            $requirements[] = 'Detailed travel itinerary';
            $requirements[] = 'Bank statements for past 3 months';
            $requirements[] = 'Letter of invitation/hotel booking voucher';
        }
    } else if (strpos($dest, 'japan') !== false) {
        if (strpos($nat, 'united states') !== false || strpos($nat, 'canada') !== false || strpos($nat, 'germany') !== false || strpos($nat, 'france') !== false || strpos($nat, 'united kingdom') !== false) {
            $visaRequired = false;
            $maxStay = 90;
        } else {
            $visaRequired = true;
            $maxStay = 90;
            $processing = '5 - 7 Business Days';
            $fee = 30;
            $requirements[] = 'Sponsorship or hotel guarantee form';
            $requirements[] = 'Income tax certificates';
            $requirements[] = 'Completed Visa Application Form with photo';
        }
    } else {
        if (strpos($nat, 'united states') !== false || strpos($nat, 'germany') !== false || strpos($nat, 'united kingdom') !== false) {
            $visaRequired = false;
        } else {
            $visaRequired = true;
            $processing = '7 - 10 Business Days';
            $fee = 60;
        }
    }

    echo json_encode([
        'destinationCountry' => $destination,
        'visaRequired' => $visaRequired,
        'maxStayDays' => $maxStay,
        'processingTime' => $processing,
        'fee' => $fee,
        'requirements' => $requirements
    ]);
    exit;
}

// PROFILE API (GET / POST)
if ($route === 'profile') {
    $db = readDB();
    if ($method === 'GET') {
        echo json_encode($db['profile']);
    } else if ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        if ($input) {
            $db['profile'] = $input;
            writeDB($db);
            echo json_encode(['success' => true, 'profile' => $db['profile']]);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid JSON input.']);
        }
    }
    exit;
}

// BOOKINGS API (GET / POST / DELETE)
if ($route === 'bookings' || strpos($route, 'bookings/') === 0) {
    $db = readDB();
    
    // Parse out potential ID from route: bookings/BK-12345
    $sub_parts = explode('/', $route);
    $booking_id = count($sub_parts) > 1 ? $sub_parts[1] : '';

    if ($method === 'GET') {
        echo json_encode($db['bookings']);
    } else if ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        if ($input) {
            if (!isset($input['id'])) {
                $input['id'] = 'BK-' . rand(10000, 99990);
            }
            if (!isset($input['status'])) {
                $input['status'] = 'confirmed';
            }
            if (!isset($input['qrCode'])) {
                $input['qrCode'] = strtoupper($input['type']) . '_' . $input['id'] . '_' . time();
            }
            
            array_unshift($db['bookings'], $input);
            writeDB($db);
            echo json_encode(['success' => true, 'booking' => $input]);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid JSON input.']);
        }
    } else if ($method === 'DELETE' && !empty($booking_id)) {
        $found_idx = -1;
        foreach ($db['bookings'] as $idx => $b) {
            if ($b['id'] === $booking_id) {
                $found_idx = $idx;
                break;
            }
        }

        if ($found_idx !== -1) {
            $db['bookings'][$found_idx]['status'] = 'cancelled';
            writeDB($db);
            echo json_encode(['success' => true, 'message' => 'Booking cancelled successfully.']);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Booking not found.']);
        }
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed or missing booking ID for DELETE.']);
    }
    exit;
}

// AI TRAVEL COMPANION (GEMINI CHAT ROUTE)
if ($route === 'ai/chat') {
    if ($method !== 'POST') {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        exit;
    }

    $input = json_decode(file_get_contents('php://input'), true);
    $message = isset($input['message']) ? $input['message'] : '';
    $history = isset($input['history']) ? $input['history'] : [];

    // Fallback response template
    $fallback_data = [
        'sender' => 'assistant',
        'text' => "The AI Travel Planner is currently running in fallback demo mode on your InfinityFree host because no `GEMINI_API_KEY` was configured in `config.php`. Please add your key in the `deploy-infinityfree/config.php` file to unlock real, custom AI responses!\n\nHowever, in this offline demo, I can still draft high-fidelity custom itineraries and suggest optimal travel paths for your trips. Ask me about a itinerary in London, Paris, or Tokyo!",
        'suggestions' => [
            [
                'type' => 'itinerary',
                'data' => [
                    'destination' => 'London',
                    'days' => [
                        ['day' => 1, 'title' => 'Historic Westminster', 'activities' => 'Visit the Big Ben, Westminster Abbey, and take an evening flight on the London Eye.'],
                        ['day' => 2, 'title' => 'Cultural Museums & West End', 'activities' => 'Explore the British Museum, walk around Soho, and watch a premium musical at the West End.']
                    ]
                ]
            ]
        ]
    ];

    if (empty($gemini_key)) {
        echo json_encode($fallback_data);
        exit;
    }

    // Call Real Gemini API via HTTPS Curl
    try {
        $systemInstruction = "You are \"Ticketing-Info Smart AI travel Planner\", a highly premium, intelligent travel agent assistant. Provide detailed, professional, exciting travel itineraries, visa details, train details, hotel tips, flight tips, and local secrets. Keep responses scannable, beautifully structured (using markdown), and highly relevant to the user's inquiry.

CRITICAL CAPABILITY:
If the user is asking about flights, hotels, or detailed trip planning, you can output structured travel widgets alongside your text response.
To output structured travel suggestions, include a JSON block in your response starting with ```json_widget and ending with ```.

The schema of the json_widget should be one of these types:
1. For Flights:
{
  \"type\": \"flight\",
  \"data\": {
    \"airline\": \"Delta Air Lines\",
    \"flightNumber\": \"DL123\",
    \"departureAirport\": \"JFK\",
    \"arrivalAirport\": \"CDG\",
    \"departureTime\": \"06:00 PM\",
    \"arrivalTime\": \"07:30 AM\",
    \"duration\": \"7h 30m\",
    \"stops\": 0,
    \"price\": 680,
    \"class\": \"Economy\",
    \"baggage\": \"1 Carry-on, 1 Checked bag free\"
  }
}
2. For Hotels:
{
  \"type\": \"hotel\",
  \"data\": {
    \"name\": \"The Ritz-Carlton, Paris\",
    \"location\": \"Paris, France\",
    \"rating\": 4.9,
    \"reviewsCount\": 840,
    \"stars\": 5,
    \"pricePerNight\": 450,
    \"image\": \"https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500\",
    \"amenities\": [\"Free WiFi\", \"Infinity Pool\", \"Spa Center\"]
  }
}
3. For Full Trip Itineraries:
{
  \"type\": \"itinerary\",
  \"data\": {
    \"destination\": \"Paris, France\",
    \"days\": [
      { \"day\": 1, \"title\": \"Eiffel & Seine\", \"activities\": \"Ascend Eiffel Tower, relax on a scenic Seine River cruise.\" },
      { \"day\": 2, \"title\": \"Louvre & Art\", \"activities\": \"Behold the Mona Lisa in the Louvre Museum, stroll down Champs-Élysées.\" }
    ]
  }
}

You may output multiple widgets if needed inside separate ```json_widget blocks, or put them as an array inside a single block if appropriate.
Respond in an inviting, premium tone.";

        // Map history for Gemini API
        $contents = [];
        foreach ($history as $msg) {
            $contents[] = [
                'role' => ($msg['sender'] === 'user') ? 'user' : 'model',
                'parts' => [['text' => $msg['text']]]
            ];
        }

        // Add current message
        $contents[] = [
            'role' => 'user',
            'parts' => [['text' => $message]]
        ];

        // Format request body for the Google Gemini Developer API
        $post_data = [
            'contents' => $contents,
            'systemInstruction' => [
                'parts' => [['text' => $systemInstruction]]
            ],
            'generationConfig' => [
                'temperature' => 0.7,
                'maxOutputTokens' => 1200
            ]
        ];

        // Prepare Curl
        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" . urlencode($gemini_key);
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($post_data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'User-Agent: aistudio-build-php-proxy'
        ]);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        
        $response_raw = curl_exec($ch);
        $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($http_code !== 200 || !$response_raw) {
            throw new Exception("Gemini API call failed with HTTP code $http_code or blank response.");
        }

        $res_json = json_decode($response_raw, true);
        $textResponse = isset($res_json['candidates'][0]['content']['parts'][0]['text']) 
            ? $res_json['candidates'][0]['content']['parts'][0]['text'] 
            : "I was unable to formulate a response at this time.";

        // Parse out json_widgets
        $textWithoutWidgets = preg_replace('/```json_widget\s*([\s\S]*?)\s*```/', '', $textResponse);
        
        // Find all json_widgets matching structures
        $suggestions = [];
        preg_match_all('/```json_widget\s*([\s\S]*?)\s*```/', $textResponse, $matches);
        if (isset($matches[1]) && !empty($matches[1])) {
            foreach ($matches[1] as $widget_text) {
                $parsed = json_decode(trim($widget_text), true);
                if ($parsed) {
                    if (isset($parsed[0])) { // Is Array
                        $suggestions = array_merge($suggestions, $parsed);
                    } else {
                        $suggestions[] = $parsed;
                    }
                }
            }
        }

        echo json_encode([
            'sender' => 'assistant',
            'text' => trim($textWithoutWidgets) ?: preg_replace('/```json_widget[\s\S]*?```/', '', $textResponse),
            'suggestions' => $suggestions
        ]);

    } catch (Exception $e) {
        // Fallback to demo mode but with error indicator
        $error_fallback = $fallback_data;
        $error_fallback['text'] = "An error occurred while calling the Gemini API from the InfinityFree server, so I have loaded fallback mode: " . $e->getMessage();
        echo json_encode($error_fallback);
    }
    exit;
}

// 404 Route Fallback
http_response_code(404);
echo json_encode(['error' => 'Endpoint not found', 'requested_route' => $route]);
