import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, HelpCircle, Loader2, Compass, ShieldCheck, MapPin, Calendar, Heart, ArrowRight } from 'lucide-react';
import { ChatMessage } from '../types';

interface AIPlannerProps {
  onSelectBookingItem: (item: {
    type: 'flight' | 'hotel' | 'cruise' | 'train' | 'rental' | 'transfer' | 'insurance' | 'visa' | 'package';
    title: string;
    subtitle: string;
    price: number;
    date: string;
    details: any;
  }) => void;
  initialQuery?: string;
  onClearInitialQuery?: () => void;
}

export default function AIPlanner({ onSelectBookingItem, initialQuery, onClearInitialQuery }: AIPlannerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hello! I am your **Ticketing-Info Smart AI Travel Assistant**, powered by Gemini. 🌍✨\n\nI can help you design custom day-by-day itineraries, compare hotel ratings, find optimal flight options, explain visa requirements, or answer any complex travel question you might have.\n\n*What destination or trip are you thinking about today?*",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialQuery) {
      const sendInitial = async (queryText: string) => {
        const userMsg: ChatMessage = {
          id: `usr-${Date.now()}`,
          sender: 'user',
          text: queryText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setIsLoading(true);

        try {
          const response = await fetch('/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: queryText,
              history: []
            })
          });

          if (!response.ok) throw new Error('API failed');
          const data = await response.json();

          const assistantMsg: ChatMessage = {
            id: `ai-${Date.now()}`,
            sender: 'assistant',
            text: data.text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            suggestions: data.suggestions
          };

          setMessages(prev => [...prev, assistantMsg]);
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
          onClearInitialQuery?.();
        }
      };
      sendInitial(initialQuery);
    }
  }, [initialQuery]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.text,
          history: messages.slice(-10) // Keep context compact
        })
      });

      if (!response.ok) throw new Error('API failed');
      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: data.suggestions
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: "I apologize, but I am experiencing some difficulties connecting to the travel intelligence mainframe. Please make sure your server is running or try again shortly.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const selectSuggestedItem = (type: string, data: any) => {
    if (type === 'flight') {
      onSelectBookingItem({
        type: 'flight',
        title: `${data.departureAirport} to ${data.arrivalAirport} (${data.airline})`,
        subtitle: `Flight ${data.flightNumber} • ${data.class}`,
        price: data.price,
        date: new Date().toLocaleDateString(),
        details: {
          airline: data.airline,
          flightNumber: data.flightNumber,
          departureAirport: data.departureAirport,
          arrivalAirport: data.arrivalAirport,
          departureTime: data.departureTime,
          arrivalTime: data.arrivalTime,
          class: data.class,
          seat: 'Aisle Preferred',
          passenger: 'Jane Doe'
        }
      });
    } else if (type === 'hotel') {
      onSelectBookingItem({
        type: 'hotel',
        title: data.name,
        subtitle: `Luxury Suite • ${data.location}`,
        price: data.pricePerNight * 3, // Simulate a 3-night stay
        date: new Date().toLocaleDateString(),
        details: {
          hotelName: data.name,
          location: data.location,
          roomType: 'Luxury King Room',
          checkIn: new Date().toISOString().split('T')[0],
          checkOut: new Date(Date.now() + 3*24*60*60*1000).toISOString().split('T')[0],
          guests: 2
        }
      });
    } else if (type === 'itinerary') {
      onSelectBookingItem({
        type: 'package',
        title: `AI Curated Package: ${data.destination}`,
        subtitle: 'Bespoke Private Itinerary + Experiences Included',
        price: 1499,
        date: new Date().toLocaleDateString(),
        details: {
          destination: data.destination,
          days: data.days,
          packageIncludes: ['Exclusive Private Guide', 'Local Michelin Gastronomy Pass', 'Premium Lounge Transits']
        }
      });
    }
  };

  const samplePrompts = [
    "Plan a 3-day romantic weekend trip to Paris",
    "Show me Business Class flights from JFK to HND",
    "Find luxury 5-star hotels in Kyoto under $500",
    "Do US passport holders need a visa for Japan?"
  ];

  return (
    <div id="ai_planner_container" className="flex flex-col lg:flex-row h-[78vh] bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
      
      {/* Chat History & Input Panel */}
      <div className="flex-1 flex flex-col justify-between bg-neutral-900 border-r border-neutral-800">
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-9 h-9 rounded-full bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
              )}
              
              <div className="max-w-[75%] space-y-3">
                {/* Text Bubble */}
                <div className={`p-4 rounded-2xl ${
                  msg.sender === 'user' 
                    ? 'bg-emerald-600 text-white rounded-tr-none' 
                    : 'bg-neutral-950 border border-neutral-850 text-neutral-200 rounded-tl-none'
                }`}>
                  <div className="text-sm leading-relaxed whitespace-pre-line prose prose-invert max-w-none">
                    {msg.text}
                  </div>
                  <span className="block text-[10px] text-neutral-500 text-right mt-1.5 font-mono">
                    {msg.timestamp}
                  </span>
                </div>

                {/* Structured Suggestions Widgets */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="space-y-3 mt-2">
                    {msg.suggestions.map((s, idx) => (
                      <div 
                        key={idx} 
                        className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 shadow-md hover:border-emerald-500/40 transition-colors"
                      >
                        {s.type === 'flight' && (
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[10px] bg-blue-950/40 text-blue-400 border border-blue-900 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Flight Recommendation</span>
                              <span className="text-sm font-bold text-emerald-400">${s.data.price}</span>
                            </div>
                            <h5 className="text-xs font-bold text-white">{s.data.airline} • {s.data.flightNumber}</h5>
                            <p className="text-[11px] text-neutral-400 mt-1">
                              {s.data.departureAirport} ({s.data.departureTime}) → {s.data.arrivalAirport} ({s.data.arrivalTime})
                            </p>
                            <p className="text-[10px] text-neutral-500 mt-0.5">{s.data.duration} • {s.data.stops === 0 ? 'Nonstop' : `${s.data.stops} stop`}</p>
                            <button 
                              onClick={() => selectSuggestedItem('flight', s.data)}
                              className="w-full mt-3 bg-neutral-800 hover:bg-emerald-600 hover:text-white transition-colors text-neutral-300 text-xs py-2 rounded-lg font-medium flex items-center justify-center gap-1 cursor-pointer"
                            >
                              Instant Book Flight <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        {s.type === 'hotel' && (
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[10px] bg-purple-950/40 text-purple-400 border border-purple-900 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Hotel Recommendation</span>
                              <span className="text-sm font-bold text-emerald-400">${s.data.pricePerNight}/night</span>
                            </div>
                            <h5 className="text-xs font-bold text-white">{s.data.name}</h5>
                            <p className="text-[11px] text-neutral-400 mt-0.5">{s.data.location}</p>
                            <div className="flex gap-1.5 items-center mt-1 text-[10px] text-neutral-500">
                              <span>★ {s.data.rating} ({s.data.reviewsCount} reviews)</span>
                              <span>•</span>
                              <span>{s.data.stars}-star</span>
                            </div>
                            <button 
                              onClick={() => selectSuggestedItem('hotel', s.data)}
                              className="w-full mt-3 bg-neutral-800 hover:bg-emerald-600 hover:text-white transition-colors text-neutral-300 text-xs py-2 rounded-lg font-medium flex items-center justify-center gap-1 cursor-pointer"
                            >
                              Reserve Hotel <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        {s.type === 'itinerary' && (
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[10px] bg-emerald-950/40 text-emerald-400 border border-emerald-900 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Custom Itinerary</span>
                              <span className="text-xs font-bold text-neutral-400">{s.data.days?.length} Days</span>
                            </div>
                            <h5 className="text-xs font-bold text-white">{s.data.destination} Custom Tour</h5>
                            <div className="space-y-2 mt-2 max-h-40 overflow-y-auto pr-1">
                              {s.data.days?.map((day: any, dIdx: number) => (
                                <div key={dIdx} className="border-l border-neutral-800 pl-2.5 py-0.5">
                                  <p className="text-[10px] font-bold text-emerald-400 font-mono">DAY {day.day}: {day.title}</p>
                                  <p className="text-[10px] text-neutral-400 leading-relaxed">{day.activities}</p>
                                </div>
                              ))}
                            </div>
                            <button 
                              onClick={() => selectSuggestedItem('itinerary', s.data)}
                              className="w-full mt-3 bg-emerald-600 hover:bg-emerald-500 text-white transition-colors text-xs py-2 rounded-lg font-medium flex items-center justify-center gap-1 cursor-pointer"
                            >
                              Book Custom Package ($1,499) <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 shrink-0">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4">
              <div className="w-9 h-9 rounded-full bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
              <div className="bg-neutral-950 border border-neutral-850 text-neutral-400 p-4 rounded-2xl rounded-tl-none text-sm">
                Evaluating routes, local schedules, and lodging parameters...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 border-t border-neutral-800 bg-neutral-950/50 flex gap-2">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your travel inquiry here... (e.g. Plan a 3-day weekend in Paris)"
            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-5 py-3 flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Right Intelligence Panel */}
      <div className="w-full lg:w-[320px] bg-neutral-950 p-6 flex flex-col justify-between overflow-y-auto max-h-[30vh] lg:max-h-full">
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Compass className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">AI Travel Center</h4>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Leverage custom AI engines to generate completely custom travel packages, discover hidden tourist hot-spots, evaluate passport requirements, or compare flight prices.
            </p>
          </div>

          <div className="border-t border-neutral-800/60 pt-4">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5 text-neutral-400">Try Asking</h5>
            <div className="space-y-2">
              {samplePrompts.map((p, idx) => (
                <button 
                  key={idx}
                  onClick={() => setInput(p)}
                  className="w-full text-left bg-neutral-900 hover:bg-neutral-850 border border-neutral-850 hover:border-emerald-500/30 p-2.5 rounded-xl text-[11px] text-neutral-300 transition-all cursor-pointer leading-relaxed"
                >
                  "{p}"
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800/60 pt-4 mt-6">
          <div className="flex items-center gap-2 text-[11px] text-neutral-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Encrypted Gemini Session</span>
          </div>
        </div>
      </div>

    </div>
  );
}
