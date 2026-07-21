import { NextResponse } from 'next/server';
import { z } from 'zod';
import { GoogleGenAI } from '@google/genai';
import { rateLimit, clientIp, tooManyRequestsResponse } from '@/lib/rateLimit';

// Bound the request so a client can't inflate Gemini token spend (cost DoS) by
// sending a huge conversation. Each turn is length-capped, the number of turns
// is capped, and a total-character budget is enforced across the whole history.
const MAX_MESSAGE_CHARS = 2000;
const MAX_HISTORY_TURNS = 10;
const MAX_HISTORY_CHARS = 12_000;

const chatSchema = z.object({
  message: z.string().trim().min(1, 'Message is required').max(MAX_MESSAGE_CHARS, 'Message is too long (max 2000 characters)'),
  history: z
    .array(
      z.object({
        sender: z.enum(['user', 'assistant']),
        text: z.string().max(MAX_MESSAGE_CHARS),
      }),
    )
    .max(MAX_HISTORY_TURNS)
    .optional()
    .default([])
    .refine((h) => h.reduce((n, m) => n + m.text.length, 0) <= MAX_HISTORY_CHARS, {
      message: 'Conversation history is too large',
    }),
});

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const SYSTEM_INSTRUCTION = `
You are "Ticketing-Info Smart AI Travel Planner", a premium, intelligent travel agent assistant.
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
Respond in an inviting, premium tone. Always make clear that final pricing and booking is confirmed by a human travel consultant, not booked instantly.
`;

export async function POST(req: Request) {
  const { allowed, resetAt } = rateLimit(`ai-chat:${clientIp(req)}`, 10, 60_000);
  if (!allowed) return tooManyRequestsResponse(resetAt);

  let parsed: z.infer<typeof chatSchema>;
  try {
    parsed = chatSchema.parse(await req.json());
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0]?.message ?? 'Invalid input' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const { message, history } = parsed;

  if (!ai) {
    return NextResponse.json({
      sender: 'assistant',
      text: "The AI Travel Planner is running in fallback demo mode because no `GEMINI_API_KEY` is configured yet. Add your key in the environment settings to unlock real, custom AI responses!\n\nIn the meantime, I can still point you toward our search pages for flights, hotels, cruises, and packages — or you can call/WhatsApp us directly.",
      suggestions: [],
    });
  }

  try {
    const contents = history.slice(-10).map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));
    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents,
      config: { systemInstruction: SYSTEM_INSTRUCTION, temperature: 0.7 },
    });

    const textResponse = response.text || 'I was unable to formulate a response at this time.';
    const textWithoutWidgets = textResponse.replace(/```json_widget\s*([\s\S]*?)\s*```/g, '').trim();
    const widgetMatches = [...textResponse.matchAll(/```json_widget\s*([\s\S]*?)\s*```/g)];

    const suggestions: unknown[] = [];
    for (const m of widgetMatches) {
      try {
        const parsed = JSON.parse(m[1].trim());
        if (Array.isArray(parsed)) suggestions.push(...parsed);
        else suggestions.push(parsed);
      } catch (err) {
        console.error('Failed to parse json_widget from Gemini response:', err);
      }
    }

    return NextResponse.json({ sender: 'assistant', text: textWithoutWidgets || textResponse, suggestions });
  } catch (error) {
    console.error('Error generating AI response:', error);
    return NextResponse.json(
      { sender: 'assistant', text: 'An error occurred while calling the AI engine. Please try again shortly, or call/WhatsApp us directly.', suggestions: [] },
      { status: 500 },
    );
  }
}
