import React, { useState, useEffect } from 'react';
import { 
  Plane, Hotel, Anchor, Navigation, Car, Compass, 
  ShieldCheck, HelpCircle, FileText, Bot, User, 
  Briefcase, Heart, Globe, LogOut, CheckCircle, Send
} from 'lucide-react';
import { Booking, UserProfile as ProfileType } from './types';

// Tab components
import FlightsTab from './components/Tabs/FlightsTab';
import HotelsTab from './components/Tabs/HotelsTab';
import CruisesTab from './components/Tabs/CruisesTab';
import TrainsTab from './components/Tabs/TrainsTab';
import RentalsTab from './components/Tabs/RentalsTab';
import TransfersTab from './components/Tabs/TransfersTab';
import InsuranceTab from './components/Tabs/InsuranceTab';
import VisasTab from './components/Tabs/VisasTab';
import AIPlanner from './components/AIPlanner';
import MyTrips from './components/MyTrips';
import UserProfile from './components/UserProfile';

// Modals
import CheckoutModal from './components/CheckoutModal';

type TabID = 
  | 'flights' 
  | 'hotels' 
  | 'cruises' 
  | 'trains' 
  | 'rentals' 
  | 'transfers' 
  | 'insurance' 
  | 'visas' 
  | 'ai-planner' 
  | 'my-trips' 
  | 'profile';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabID>('flights');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  
  // Loading states
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  // Checkout modal trigger
  const [selectedBookingItem, setSelectedBookingItem] = useState<{
    type: 'flight' | 'hotel' | 'cruise' | 'train' | 'rental' | 'transfer' | 'insurance' | 'visa' | 'package';
    title: string;
    subtitle: string;
    price: number;
    date: string;
    details: any;
  } | null>(null);

  // AI Companion Sidebar states
  const [sidebarAIInput, setSidebarAIInput] = useState('');
  const [initialAIQuery, setInitialAIQuery] = useState<string | undefined>(undefined);

  const handleSidebarAISubmit = (query: string) => {
    setInitialAIQuery(query);
    setActiveTab('ai-planner');
  };

  // Init - Fetch data
  const fetchBookings = async () => {
    setBookingsLoading(true);
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setBookingsLoading(false);
    }
  };

  const fetchProfile = async () => {
    setProfileLoading(true);
    try {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchProfile();
  }, []);

  const handleCreateBooking = async (details: any) => {
    if (!selectedBookingItem) return;
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedBookingItem.type,
          title: selectedBookingItem.title,
          subtitle: selectedBookingItem.subtitle,
          price: selectedBookingItem.price,
          date: selectedBookingItem.date,
          details: {
            ...selectedBookingItem.details,
            passengerName: details.cardholderName,
            passportNumber: profile?.passportNumber || 'N/A'
          }
        })
      });

      if (res.ok) {
        // Refresh bookings and swap view to my trips timeline
        await fetchBookings();
        setSelectedBookingItem(null);
        setActiveTab('my-trips');
      } else {
        throw new Error('Booking transaction failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error finalizing travel booking. Please try again.');
    }
  };

  const handleCancelBooking = async (id: string) => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this booking itinerary?');
    if (!confirmCancel) return;

    try {
      const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchBookings();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateProfile = async (updated: ProfileType) => {
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        await fetchProfile();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Nav categories definition
  const mainNavs = [
    { id: 'flights', label: 'Flights', icon: <Plane className="w-4 h-4 rotate-45" /> },
    { id: 'hotels', label: 'Hotels', icon: <Hotel className="w-4 h-4" /> },
    { id: 'cruises', label: 'Cruises', icon: <Anchor className="w-4 h-4" /> },
    { id: 'trains', label: 'Trains', icon: <Navigation className="w-4 h-4" /> },
    { id: 'rentals', label: 'Car Rentals', icon: <Car className="w-4 h-4" /> },
    { id: 'transfers', label: 'Transfers', icon: <Compass className="w-4 h-4" /> },
    { id: 'insurance', label: 'Insurance', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'visas', label: 'Visa Checker', icon: <FileText className="w-4 h-4" /> },
  ] as const;

  const isBookingTab = ['flights', 'hotels', 'cruises', 'trains', 'rentals', 'transfers', 'insurance', 'visas'].includes(activeTab);

  return (
    <div id="ota_root_layout" className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      
      {/* Global Navigation Header - Styled exactly like Stitch */}
      <header className="bg-white border-b border-slate-200 px-6 h-16 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-8 flex-1 min-w-0 h-full">
          {/* Logo / Brand */}
          <div 
            className="flex items-center gap-2 cursor-pointer shrink-0" 
            onClick={() => setActiveTab('flights')}
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-200">
              <Plane className="w-5 h-5 text-white rotate-45" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Ticketing-Info</span>
          </div>

          {/* Top Horizontal Booking Nav - Scrollable & sleek on mobile */}
          <nav className="flex items-center gap-6 overflow-x-auto scrollbar-none h-full py-1">
            {mainNavs.map((nav) => (
              <button
                key={nav.id}
                onClick={() => setActiveTab(nav.id)}
                className={`text-xs font-bold tracking-wider uppercase transition-all pb-5 pt-5 border-b-2 cursor-pointer shrink-0 ${
                  activeTab === nav.id 
                    ? 'text-blue-600 border-blue-600 font-extrabold' 
                    : 'text-slate-500 hover:text-slate-900 border-transparent hover:border-slate-200'
                }`}
              >
                {nav.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right Action Utilities Panel */}
        <div className="flex items-center gap-3.5 ml-4 shrink-0">
          
          {/* AI Assistant shortcut tab */}
          <button
            onClick={() => setActiveTab('ai-planner')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border cursor-pointer transition-all ${
              activeTab === 'ai-planner'
                ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                : 'bg-slate-900 border-transparent text-white hover:bg-slate-800'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="hidden md:inline">AI Companion</span>
          </button>

          {/* My Trips shortcut tab with status badge */}
          <button
            onClick={() => setActiveTab('my-trips')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border cursor-pointer transition-all ${
              activeTab === 'my-trips'
                ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">My Trips</span>
            {bookings.filter(b => b.status === 'confirmed').length > 0 && (
              <span className="bg-blue-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center font-mono">
                {bookings.filter(b => b.status === 'confirmed').length}
              </span>
            )}
          </button>

          {/* USD / EN Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-slate-200 bg-slate-50 rounded-full text-[10px] font-bold text-slate-600">
            <span>USD</span>
            <span className="w-px h-3 bg-slate-300"></span>
            <span>EN</span>
          </div>

          {/* User profile picture trigger */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'border-blue-600 ring-2 ring-blue-100'
                : 'border-slate-300 bg-slate-100 hover:border-slate-400'
            }`}
            title="Profile Settings"
          >
            <User className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </header>

      {/* Main Grid: Dual Column Layout aligned to Stitch */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
        <div className="grid grid-cols-12 gap-8">
          
          {/* Main Tab Frame Content */}
          <main className={isBookingTab ? "col-span-12 xl:col-span-8" : "col-span-12"}>
            {activeTab === 'flights' && (
              <FlightsTab onSelectBookingItem={setSelectedBookingItem} />
            )}

            {activeTab === 'hotels' && (
              <HotelsTab onSelectBookingItem={setSelectedBookingItem} />
            )}

            {activeTab === 'cruises' && (
              <CruisesTab onSelectBookingItem={setSelectedBookingItem} />
            )}

            {activeTab === 'trains' && (
              <TrainsTab onSelectBookingItem={setSelectedBookingItem} />
            )}

            {activeTab === 'rentals' && (
              <RentalsTab onSelectBookingItem={setSelectedBookingItem} />
            )}

            {activeTab === 'transfers' && (
              <TransfersTab onSelectBookingItem={setSelectedBookingItem} />
            )}

            {activeTab === 'insurance' && (
              <InsuranceTab onSelectBookingItem={setSelectedBookingItem} />
            )}

            {activeTab === 'visas' && (
              <VisasTab onSelectBookingItem={setSelectedBookingItem} />
            )}

            {activeTab === 'ai-planner' && (
              <AIPlanner 
                onSelectBookingItem={setSelectedBookingItem} 
                initialQuery={initialAIQuery}
                onClearInitialQuery={() => setInitialAIQuery(undefined)}
              />
            )}

            {activeTab === 'my-trips' && (
              <MyTrips 
                bookings={bookings} 
                onCancelBooking={handleCancelBooking} 
                isLoading={bookingsLoading} 
              />
            )}

            {activeTab === 'profile' && (
              <UserProfile 
                profile={profile} 
                onUpdateProfile={handleUpdateProfile} 
                isLoading={profileLoading} 
              />
            )}
          </main>

          {/* AI Companion Sidebar - Displayed on search/booking tabs */}
          {isBookingTab && (
            <aside className="col-span-12 xl:col-span-4 flex flex-col gap-4">
              <div className="bg-slate-900 rounded-3xl p-6 text-white h-fit relative overflow-hidden flex flex-col shadow-xl border border-slate-800">
                <div className="relative z-10 flex-1 flex flex-col">
                  
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white leading-none">AI Travel Assistant</h3>
                      <span className="text-[9px] text-blue-400 font-extrabold uppercase tracking-widest font-mono mt-1 block">Beta Access</span>
                    </div>
                  </div>

                  {/* Pitch prompt example */}
                  <p className="text-slate-300 text-xs leading-relaxed mb-6 italic">
                    "Plan a 5-day romantic getaway to Italy with a budget of $3,000 including flights from LHR."
                  </p>

                  {/* Prompt Suggestions */}
                  <div className="space-y-3 mb-6">
                    {[
                      { text: "Suggest a tropical destination for December", query: "Suggest a tropical destination for December" },
                      { text: "Calculate visa requirements for Japan", query: "Do US passport holders need a visa for Japan?" },
                      { text: "Find hotels with rooftop pools in Dubai", query: "Find hotels with rooftop pools in Dubai" }
                    ].map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSidebarAISubmit(prompt.query)}
                        className="w-full text-left bg-white/10 hover:bg-white/20 active:scale-[0.98] p-3 rounded-xl border border-white/10 cursor-pointer transition-all text-xs font-semibold text-slate-100"
                      >
                        {prompt.text}
                      </button>
                    ))}
                  </div>

                </div>

                {/* Ambient dynamic glow background bubble */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600 rounded-full blur-[60px] opacity-25 pointer-events-none"></div>

                {/* Instant Query Submit Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (sidebarAIInput.trim()) {
                      handleSidebarAISubmit(sidebarAIInput);
                      setSidebarAIInput('');
                    }
                  }}
                  className="mt-auto pt-4 border-t border-white/10 relative z-10"
                >
                  <div className="relative">
                    <input
                      type="text"
                      value={sidebarAIInput}
                      onChange={(e) => setSidebarAIInput(e.target.value)}
                      placeholder="Ask anything..."
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-4 pr-10 text-xs font-semibold text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>

              </div>
            </aside>
          )}

        </div>
      </div>

      {/* Bottom Status Bar - Styled exactly like Stitch */}
      <footer className="bg-white border-t border-slate-200 px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <div className="flex flex-wrap gap-6 justify-center">
          <span>&copy; 2026 Ticketing-Info Global</span>
          <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-emerald-600 normal-case">Live Systems Operational</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-600 cursor-pointer transition-colors">Support</span>
            <span className="hover:text-slate-600 cursor-pointer transition-colors">Feedback</span>
          </div>
        </div>
      </footer>

      {/* Checkout overlay modal */}
      {selectedBookingItem && (
        <CheckoutModal 
          isOpen={true}
          onClose={() => setSelectedBookingItem(null)}
          bookingItem={selectedBookingItem}
          onSuccess={async () => {
            await fetchBookings();
            setActiveTab('my-trips');
          }}
        />
      )}

    </div>
  );
}
