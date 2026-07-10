import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), 'db.json');

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const ai = process.env.GEMINI_API_KEY 
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    })
  : null;

// Helper to read database
function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      return { bookings: [], profile: {} };
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading DB:', err);
    return { bookings: [], profile: {} };
  }
}

// Helper to write database
function writeDB(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing DB:', err);
  }
}

// Mock Flight Data Generator
function generateMockFlights(from: string, to: string, date: string, flightClass: string) {
  const airlines = [
    { name: 'Delta Air Lines', logo: 'DL', bag: '1 Carry-on, 1 Checked bag free' },
    { name: 'United Airlines', logo: 'UA', bag: '1 Carry-on, checked bag $30' },
    { name: 'American Airlines', logo: 'AA', bag: '1 Carry-on, 1 Checked bag free' },
    { name: 'British Airways', logo: 'BA', bag: '2 Checked bags free' },
    { name: 'Singapore Airlines', logo: 'SQ', bag: '2 Checked bags free' },
    { name: 'Emirates', logo: 'EK', bag: '2 Checked bags free' },
    { name: 'Lufthansa', logo: 'LH', bag: '1 Checked bag free' }
  ];

  const airports: Record<string, string> = {
    'JFK': 'New York JFK', 'LHR': 'London Heathrow', 'HND': 'Tokyo Haneda', 
    'SFO': 'San Francisco', 'CDG': 'Paris Charles de Gaulle', 'DXB': 'Dubai Intl',
    'SIN': 'Singapore Changi', 'LAX': 'Los Angeles Intl', 'ORD': 'Chicago O\'Hare'
  };

  const fCode = (from || 'JFK').toUpperCase();
  const tCode = (to || 'LHR').toUpperCase();

  const fromAirport = airports[fCode] || fCode;
  const toAirport = airports[tCode] || tCode;

  const results = [];
  const count = 5 + Math.floor(Math.random() * 4); // 5 to 8 flights

  for (let i = 0; i < count; i++) {
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const flNum = Math.floor(100 + Math.random() * 899);
    const depHour = 6 + Math.floor(Math.random() * 15);
    const depMin = Math.random() > 0.5 ? '30' : '00';
    const durationHours = 4 + Math.floor(Math.random() * 10);
    const durationMins = Math.random() > 0.5 ? '45' : '15';

    const arrHour = (depHour + durationHours) % 24;
    const depTime = `${depHour.toString().padStart(2, '0')}:${depMin} ${depHour >= 12 ? 'PM' : 'AM'}`;
    const arrTime = `${arrHour.toString().padStart(2, '0')}:${durationMins} ${arrHour >= 12 ? 'PM' : 'AM'}`;

    const stops = Math.random() > 0.6 ? 1 : 0;
    const stopovers = stops === 1 ? [Object.keys(airports).find(k => k !== fCode && k !== tCode) || 'ORD'] : [];

    let basePrice = 250 + Math.floor(Math.random() * 600);
    if (flightClass === 'Premium Economy') basePrice *= 1.5;
    if (flightClass === 'Business') basePrice *= 3;
    if (flightClass === 'First') basePrice *= 5;

    results.push({
      id: `FL-${fCode}-${tCode}-${flNum}-${i}`,
      airline: airline.name,
      airlineLogo: airline.logo,
      flightNumber: `${airline.logo}${flNum}`,
      departureAirport: fCode,
      arrivalAirport: tCode,
      departureTime: depTime,
      arrivalTime: arrTime,
      duration: `${durationHours}h ${durationMins}m`,
      stops,
      stopoverAirports: stopovers,
      price: Math.floor(basePrice),
      class: flightClass,
      baggage: airline.bag
    });
  }

  return results.sort((a, b) => a.price - b.price);
}

// Mock Hotel Data Generator
function generateMockHotels(location: string) {
  const hotelBrands = [
    { name: 'Grand Plaza Resort', rating: 4.6, reviews: 1250, stars: 5, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop&q=60' },
    { name: 'Vanguard Boutique Hotel', rating: 4.8, reviews: 420, stars: 4, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&auto=format&fit=crop&q=60' },
    { name: 'Royal Palace Suite', rating: 4.9, reviews: 890, stars: 5, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&auto=format&fit=crop&q=60' },
    { name: 'Comfort Inn & Executive Suites', rating: 4.2, reviews: 2100, stars: 3, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&auto=format&fit=crop&q=60' },
    { name: 'The Meridian Luxury Lodge', rating: 4.7, reviews: 670, stars: 5, image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=500&auto=format&fit=crop&q=60' },
    { name: 'Apex Urban Residences', rating: 4.5, reviews: 1530, stars: 4, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&auto=format&fit=crop&q=60' }
  ];

  const amenitiesList = ['Free WiFi', 'Infinity Pool', 'Full Gym', 'Room Service', 'Spa Center', 'Free Breakfast', 'Airport Shuttle', 'Michelin Star Dining'];

  return hotelBrands.map((b, idx) => {
    const price = 120 + Math.floor(Math.random() * 380);
    const selectedAmenities = amenitiesList.filter(() => Math.random() > 0.4);
    if (selectedAmenities.length === 0) selectedAmenities.push('Free WiFi');

    return {
      id: `HTL-${idx}-${Math.floor(1000 + Math.random() * 9000)}`,
      name: b.name,
      location: location || 'London, United Kingdom',
      rating: b.rating,
      reviewsCount: b.reviews,
      stars: b.stars,
      pricePerNight: price,
      image: b.image,
      amenities: selectedAmenities,
      roomTypes: [
        { name: 'Standard King Room', price: price, description: 'One King bed, modern bathroom, smart TV, city view.', capacity: 2 },
        { name: 'Executive Suite', price: Math.floor(price * 1.5), description: 'Spacious suite with separate living room, workspace, and VIP lounge access.', capacity: 3 },
        { name: 'Presidential Penthouse', price: Math.floor(price * 3), description: 'Top floor ultimate luxury, full panoramic glass windows, private balcony.', capacity: 4 }
      ]
    };
  });
}

// -------------------------------------------------------------
// REST API ROUTES
// -------------------------------------------------------------

// Search Flights
app.get('/api/flights', (req, res) => {
  const { from = 'JFK', to = 'LHR', date = '2026-08-15', class: fClass = 'Economy' } = req.query;
  const flights = generateMockFlights(from as string, to as string, date as string, fClass as string);
  res.json(flights);
});

// Search Hotels
app.get('/api/hotels', (req, res) => {
  const { location = 'London' } = req.query;
  const hotels = generateMockHotels(location as string);
  res.json(hotels);
});

// Mock Cruises API
app.get('/api/cruises', (req, res) => {
  res.json([
    {
      id: 'CR-101',
      name: 'Bahamas Royal Escape',
      cruiseLine: 'Royal Caribbean',
      departurePort: 'Miami, FL',
      durationDays: 7,
      price: 699,
      image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=500&auto=format&fit=crop&q=60',
      rating: 4.7,
      itinerary: [
        { day: 1, port: 'Miami, FL', activities: 'Boarding and Welcome Gala.' },
        { day: 2, port: 'At Sea', activities: 'Relaxation, pool parties, evening Broadway show.' },
        { day: 3, port: 'Nassau, Bahamas', activities: 'Snorkeling, beach resorts, duty-free shopping.' },
        { day: 4, port: 'Perfect Day at CocoCay', activities: 'Waterpark, private cabanas, zip-lining.' },
        { day: 5, port: 'At Sea', activities: 'Casino night, gourmet fine dining experience.' },
        { day: 6, port: 'Key West, FL', activities: 'Historic town tours, sunset celebration.' },
        { day: 7, port: 'Miami, FL', activities: 'Disembarkation.' }
      ],
      cabins: [
        { type: 'Interior Stateroom', price: 699, description: 'Cozy and cost-effective, two twin beds, desk.' },
        { type: 'Oceanview Stateroom', price: 899, description: 'Elegant cabin with a large window facing the crystal oceans.' },
        { type: 'Grand Balcony Suite', price: 1499, description: 'Luxurious private balcony, spacious living lounge, premium concierge.' }
      ]
    },
    {
      id: 'CR-202',
      name: 'Mediterranean Wonders',
      cruiseLine: 'Celebrity Cruises',
      departurePort: 'Barcelona, Spain',
      durationDays: 10,
      price: 1399,
      image: 'https://images.unsplash.com/photo-1511316695145-4992006ffddb?w=500&auto=format&fit=crop&q=60',
      rating: 4.9,
      itinerary: [
        { day: 1, port: 'Barcelona, Spain', activities: 'Embarkation.' },
        { day: 2, port: 'Marseille, France', activities: 'Provence historical village exploration.' },
        { day: 3, port: 'Nice (Villefranche), France', activities: 'Stroll along French Riviera / Monaco.' },
        { day: 4, port: 'Florence/Pisa, Italy', activities: 'Tuscany wine tasting, Leaning Tower visits.' },
        { day: 5, port: 'Rome (Civitavecchia), Italy', activities: 'Colosseum and Vatican City sightseeing.' },
        { day: 6, port: 'Naples/Capri, Italy', activities: 'Pompeii exploration, Capri boat ride.' },
        { day: 7, port: 'At Sea', activities: 'On-deck spa relaxation, astronomical stargazing.' },
        { day: 8, port: 'Mykonos, Greece', activities: 'Iconic windmills, seaside lunch.' },
        { day: 9, port: 'Athens, Greece', activities: 'Acropolis and Parthenon exploration.' },
        { day: 10, port: 'Athens, Greece', activities: 'Disembarkation.' }
      ],
      cabins: [
        { type: 'Standard Stateroom', price: 1399, description: 'Cozy bed, complete amenities.' },
        { type: 'Ocean View Balcony', price: 1899, description: 'Private balcony facing beautiful European coastlines.' },
        { type: 'Ultra Suite', price: 2999, description: 'Enormous living area, personal butler service, fine luxury.' }
      ]
    }
  ]);
});

// Mock Train API
app.get('/api/trains', (req, res) => {
  const { from = 'Paris', to = 'London' } = req.query;
  res.json([
    {
      id: 'TR-301',
      operator: 'Eurostar',
      trainNumber: 'EST9012',
      departureStation: `${from} Gare du Nord`,
      arrivalStation: `${to} St Pancras Intl`,
      departureTime: '08:15 AM',
      arrivalTime: '10:35 AM',
      duration: '2h 20m',
      price: 89,
      classes: [
        { name: 'Standard', price: 89 },
        { name: 'Standard Premier', price: 149 },
        { name: 'Business Premier', price: 289 }
      ]
    },
    {
      id: 'TR-302',
      operator: 'Eurostar',
      trainNumber: 'EST9054',
      departureStation: `${from} Gare du Nord`,
      arrivalStation: `${to} St Pancras Intl`,
      departureTime: '01:45 PM',
      arrivalTime: '04:05 PM',
      duration: '2h 20m',
      price: 115,
      classes: [
        { name: 'Standard', price: 115 },
        { name: 'Standard Premier', price: 175 },
        { name: 'Business Premier', price: 320 }
      ]
    }
  ]);
});

// Mock Rental Cars API
app.get('/api/rentals', (req, res) => {
  res.json([
    { id: 'RC-1', provider: 'Hertz', model: 'Tesla Model 3', category: 'Luxury', seats: 5, transmission: 'Automatic', pricePerDay: 85, image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=500&auto=format&fit=crop&q=60', rating: 4.8 },
    { id: 'RC-2', provider: 'Enterprise', model: 'Toyota RAV4', category: 'SUV', seats: 5, transmission: 'Automatic', pricePerDay: 65, image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500&auto=format&fit=crop&q=60', rating: 4.6 },
    { id: 'RC-3', provider: 'Avis', model: 'Ford Mustang Convertible', category: 'Convertible', seats: 4, transmission: 'Automatic', pricePerDay: 120, image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500&auto=format&fit=crop&q=60', rating: 4.7 },
    { id: 'RC-4', provider: 'Budget', model: 'Hyundai Elantra', category: 'Economy', seats: 5, transmission: 'Automatic', pricePerDay: 39, image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500&auto=format&fit=crop&q=60', rating: 4.3 }
  ]);
});

// Mock Airport Transfers API
app.get('/api/transfers', (req, res) => {
  res.json([
    { id: 'TF-1', type: 'Private Sedan', capacity: 3, price: 55, duration: '45m', description: 'Meet & greet at arrival hall. Luxury sedan with professional driver.' },
    { id: 'TF-2', type: 'SUV SUV', capacity: 6, price: 85, duration: '45m', description: 'Spacious SUV perfect for families and excess heavy luggage.' },
    { id: 'TF-3', type: 'Luxury Limo', capacity: 4, price: 180, duration: '50m', description: 'VIP premium treatment, chilled champagne, ultimate comfort and class.' },
    { id: 'TF-4', type: 'Shared Shuttle', capacity: 12, price: 18, duration: '1h 15m', description: 'Budget friendly shared shuttle direct to central hotels.' }
  ]);
});

// Mock Travel Insurance API
app.get('/api/insurance', (req, res) => {
  res.json([
    { id: 'INS-1', name: 'SafeTravel Basic', tier: 'Basic', price: 29, medicalCoverage: '$50,000', tripCancellation: 'Up to $1,000', luggageCoverage: 'Up to $500', description: 'Essential protection for budget-minded explorers.' },
    { id: 'INS-2', name: 'SafeTravel Explorer', tier: 'Premium', price: 59, medicalCoverage: '$150,000', tripCancellation: 'Up to $5,000', luggageCoverage: 'Up to $1,500', description: 'Most popular! Excellent coverage for flight delays, lost baggage, and emergencies.' },
    { id: 'INS-3', name: 'SafeTravel Platinum Elite', tier: 'Elite', price: 99, medicalCoverage: '$1,000,000', tripCancellation: 'Up to $15,000', luggageCoverage: 'Up to $3,500', description: 'Premium comprehensive peace-of-mind including cancel-for-any-reason policy.' }
  ]);
});

// Visa Requirements API
app.get('/api/visa/check', (req, res) => {
  const { nationality = 'United States', destination = 'United Kingdom' } = req.query;
  
  const nat = (nationality as string).toLowerCase();
  const dest = (destination as string).toLowerCase();

  let requirements: string[] = ['Valid passport (at least 6 months validity)', 'Proof of onward travel/return flight', 'Proof of sufficient travel funds'];
  let visaRequired = false;
  let maxStay = 90;
  let processing = 'Not required';
  let fee = 0;

  if (dest.includes('united kingdom') || dest.includes('uk')) {
    if (nat.includes('united states') || nat.includes('canada') || nat.includes('australia') || nat.includes('germany') || nat.includes('france') || nat.includes('japan')) {
      visaRequired = false;
      maxStay = 180;
    } else {
      visaRequired = true;
      maxStay = 180;
      processing = '10 - 15 Business Days';
      fee = 150;
      requirements.push('Detailed travel itinerary', 'Bank statements for past 3 months', 'Letter of invitation/hotel booking voucher');
    }
  } else if (dest.includes('japan')) {
    if (nat.includes('united states') || nat.includes('canada') || nat.includes('germany') || nat.includes('france') || nat.includes('united kingdom')) {
      visaRequired = false;
      maxStay = 90;
    } else {
      visaRequired = true;
      maxStay = 90;
      processing = '5 - 7 Business Days';
      fee = 30;
      requirements.push('Sponsorship or hotel guarantee form', 'Income tax certificates', 'Completed Visa Application Form with photo');
    }
  } else {
    // Default fallback
    if (nat.includes('united states') || nat.includes('germany') || nat.includes('united kingdom')) {
      visaRequired = false;
    } else {
      visaRequired = true;
      processing = '7 - 10 Business Days';
      fee = 60;
    }
  }

  res.json({
    destinationCountry: destination,
    visaRequired,
    maxStayDays: maxStay,
    processingTime: processing,
    fee,
    requirements
  });
});

// Bookings API (GET / POST / DELETE)
app.get('/api/bookings', (req, res) => {
  const db = readDB();
  res.json(db.bookings);
});

app.post('/api/bookings', (req, res) => {
  const db = readDB();
  const newBooking = req.body;
  
  if (!newBooking.id) {
    newBooking.id = `BK-${Math.floor(10000 + Math.random() * 90000)}`;
  }
  if (!newBooking.status) {
    newBooking.status = 'confirmed';
  }
  if (!newBooking.qrCode) {
    newBooking.qrCode = `${newBooking.type.toUpperCase()}_${newBooking.id}_${Date.now()}`;
  }

  db.bookings.unshift(newBooking);
  writeDB(db);
  res.json({ success: true, booking: newBooking });
});

app.delete('/api/bookings/:id', (req, res) => {
  const db = readDB();
  const id = req.params.id;
  
  const idx = db.bookings.findIndex((b: any) => b.id === id);
  if (idx !== -1) {
    db.bookings[idx].status = 'cancelled';
    writeDB(db);
    res.json({ success: true, message: 'Booking cancelled successfully.' });
  } else {
    res.status(404).json({ success: false, message: 'Booking not found.' });
  }
});

// Profile API (GET / POST)
app.get('/api/profile', (req, res) => {
  const db = readDB();
  res.json(db.profile);
});

app.post('/api/profile', (req, res) => {
  const db = readDB();
  db.profile = req.body;
  writeDB(db);
  res.json({ success: true, profile: db.profile });
});

// -------------------------------------------------------------
// AI TRAVEL PLANNER (GEMINI API)
// -------------------------------------------------------------
app.post('/api/ai/chat', async (req, res) => {
  const { message, history = [] } = req.body;

  if (!ai) {
    return res.status(200).json({
      sender: 'assistant',
      text: "The AI Travel Planner is currently running in fallback demo mode because no `GEMINI_API_KEY` environment secret is provided. Please add your key in the Secrets menu to unlock real, custom AI responses!\n\nHowever, in this offline demo, I can still draft high-fidelity custom itineraries and suggest optimal travel paths for your trips. Ask me about a itinerary in London, Paris, or Tokyo!",
      suggestions: [
        {
          type: 'itinerary',
          data: {
            destination: 'London',
            days: [
              { day: 1, title: 'Historic Westminster', activities: 'Visit the Big Ben, Westminster Abbey, and take an evening flight on the London Eye.' },
              { day: 2, title: 'Cultural Museums & West End', activities: 'Explore the British Museum, walk around Soho, and watch a premium musical at the West End.' }
            ]
          }
        }
      ]
    });
  }

  try {
    const systemInstruction = `
      You are "Ticketing-Info Smart AI travel Planner", a highly premium, intelligent travel agent assistant.
      Provide detailed, professional, exciting travel itineraries, visa details, train details, hotel tips, flight tips, and local secrets.
      Keep responses scannable, beautifully structured (using markdown), and highly relevant to the user's inquiry.
      
      CRITICAL CAPABILITY:
      If the user is asking about flights, hotels, or detailed trip planning, you can output structured travel widgets alongside your text response.
      To output structured travel suggestions, include a JSON block in your response starting with \`\`\`json_widget and ending with \`\`\`.
      
      The schema of the json_widget should be one of these types:
      1. For Flights:
      {
        "type": "flight",
        "data": {
          "airline": "Delta Air Lines",
          "flightNumber": "DL123",
          "departureAirport": "JFK",
          "arrivalAirport": "CDG",
          "departureTime": "06:00 PM",
          "arrivalTime": "07:30 AM",
          "duration": "7h 30m",
          "stops": 0,
          "price": 680,
          "class": "Economy",
          "baggage": "1 Carry-on, 1 Checked bag free"
        }
      }
      2. For Hotels:
      {
        "type": "hotel",
        "data": {
          "name": "The Ritz-Carlton, Paris",
          "location": "Paris, France",
          "rating": 4.9,
          "reviewsCount": 840,
          "stars": 5,
          "pricePerNight": 450,
          "image": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500",
          "amenities": ["Free WiFi", "Infinity Pool", "Spa Center"]
        }
      }
      3. For Full Trip Itineraries:
      {
        "type": "itinerary",
        "data": {
          "destination": "Paris, France",
          "days": [
            { "day": 1, "title": "Eiffel & Seine", "activities": "Ascend Eiffel Tower, relax on a scenic Seine River cruise." },
            { "day": 2, "title": "Louvre & Art", "activities": "Behold the Mona Lisa in the Louvre Museum, stroll down Champs-Élysées." }
          ]
        }
      }

      You may output multiple widgets if needed inside separate \`\`\`json_widget blocks, or put them as an array inside a single block if appropriate.
      Respond in an inviting, premium tone.
    `;

    // Map conversation history to the format expected by the @google/genai SDK
    // @google/genai chats.create uses 'user' and 'model' roles.
    const contents = history.map((msg: any) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Append current message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const textResponse = response.text || "I was unable to formulate a response at this time.";

    // Parse out json_widgets
    const textWithoutWidgets = textResponse.replace(/```json_widget\s*([\s\S]*?)\s*```/g, '');
    const widgetMatches = [...textResponse.matchAll(/```json_widget\s*([\s\S]*?)\s*```/g)];
    const suggestions: any[] = [];

    widgetMatches.forEach(m => {
      try {
        const parsed = JSON.parse(m[1].trim());
        if (Array.isArray(parsed)) {
          suggestions.push(...parsed);
        } else {
          suggestions.push(parsed);
        }
      } catch (err) {
        console.error('Failed to parse json_widget from Gemini response:', err);
      }
    });

    res.json({
      sender: 'assistant',
      text: textWithoutWidgets.trim() || textResponse.replace(/```json_widget[\s\S]*?```/g, '').trim(),
      suggestions
    });

  } catch (error: any) {
    console.error('Error generating AI response:', error);
    res.status(500).json({
      sender: 'assistant',
      text: `An error occurred while calling the AI Engine. ${error.message || error}`,
      suggestions: []
    });
  }
});

// -------------------------------------------------------------
// VITE AND STATIC ASSETS SERVING MIDDLEWARE
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Ticketing-Info Premium full-stack app running on http://localhost:${PORT}`);
  });
}

startServer();
