import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Receipt, Compass, QrCode, Trash2, ShieldCheck, HelpCircle, User, Plane, Hotel, Navigation, Car, AlertTriangle } from 'lucide-react';
import { Booking } from '../types';

interface MyTripsProps {
  bookings: Booking[];
  onCancelBooking: (id: string) => void;
  isLoading: boolean;
}

export default function MyTrips({ bookings, onCancelBooking, isLoading }: MyTripsProps) {
  const [selectedQR, setSelectedQR] = useState<string | null>(null);

  const getIcon = (type: string) => {
    switch (type) {
      case 'flight': return <Plane className="w-5 h-5 text-blue-400" />;
      case 'hotel': return <Hotel className="w-5 h-5 text-purple-400" />;
      case 'rental': return <Car className="w-5 h-5 text-yellow-400" />;
      case 'train': return <Navigation className="w-5 h-5 text-orange-400" />;
      default: return <Compass className="w-5 h-5 text-emerald-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'confirmed') {
      return (
        <span className="text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-900 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
          Confirmed
        </span>
      );
    }
    return (
      <span className="text-[10px] bg-red-950/60 text-red-400 border border-red-900 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
        Cancelled
      </span>
    );
  };

  return (
    <div id="my_trips_container" className="space-y-6">
      
      {/* Upper Stats bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-neutral-900/50 border border-neutral-800 p-5 rounded-2xl">
          <p className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">Total Itineraries</p>
          <p className="text-3xl font-bold text-white mt-1">{bookings.length}</p>
        </div>
        <div className="bg-neutral-900/50 border border-neutral-800 p-5 rounded-2xl">
          <p className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">Confirmed Bookings</p>
          <p className="text-3xl font-bold text-emerald-400 mt-1">
            {bookings.filter(b => b.status === 'confirmed').length}
          </p>
        </div>
        <div className="bg-neutral-900/50 border border-neutral-800 p-5 rounded-2xl">
          <p className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">Total Investment</p>
          <p className="text-3xl font-bold text-white mt-1">
            ${bookings.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + b.price, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-400 text-sm">Retrieving traveler itinerary matrix...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
          <Compass className="w-12 h-12 text-neutral-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No active trips found</h3>
          <p className="text-neutral-400 text-sm leading-relaxed">
            You haven't scheduled any travel bookings yet. Explore our flights, hotels, packages, or talk to our smart AI travel planner to create your first trip!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div 
              key={b.id} 
              className={`bg-neutral-900 border ${b.status === 'cancelled' ? 'border-neutral-850 opacity-60' : 'border-neutral-800'} rounded-2xl overflow-hidden shadow-md`}
            >
              <div className="p-5 md:p-6 flex flex-col md:flex-row justify-between gap-6">
                
                {/* Left Description Side */}
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl shrink-0 mt-1">
                    {getIcon(b.type)}
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-neutral-500 font-mono">ID: {b.id}</span>
                      <span>•</span>
                      {getStatusBadge(b.status)}
                    </div>
                    <h4 className="text-lg font-bold text-white tracking-tight leading-snug">{b.title}</h4>
                    <p className="text-sm text-neutral-400 font-medium">{b.subtitle}</p>

                    {/* Flight Details Expansion */}
                    {b.type === 'flight' && b.details && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 bg-neutral-950/50 p-4 border border-neutral-850 rounded-xl text-xs">
                        <div>
                          <p className="text-neutral-500 font-medium">Class</p>
                          <p className="text-white font-bold mt-0.5">{b.details.class}</p>
                        </div>
                        <div>
                          <p className="text-neutral-500 font-medium">Seat</p>
                          <p className="text-white font-bold mt-0.5">{b.details.seat || 'Unassigned'}</p>
                        </div>
                        <div>
                          <p className="text-neutral-500 font-medium">Depart</p>
                          <p className="text-white font-bold mt-0.5">{b.details.departureAirport} ({b.details.departureTime})</p>
                        </div>
                        <div>
                          <p className="text-neutral-500 font-medium">Arrive</p>
                          <p className="text-white font-bold mt-0.5">{b.details.arrivalAirport} ({b.details.arrivalTime})</p>
                        </div>
                      </div>
                    )}

                    {/* Hotel Details Expansion */}
                    {b.type === 'hotel' && b.details && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 bg-neutral-950/50 p-4 border border-neutral-850 rounded-xl text-xs">
                        <div>
                          <p className="text-neutral-500 font-medium">Check-In</p>
                          <p className="text-white font-bold mt-0.5">{b.details.checkIn}</p>
                        </div>
                        <div>
                          <p className="text-neutral-500 font-medium">Check-Out</p>
                          <p className="text-white font-bold mt-0.5">{b.details.checkOut}</p>
                        </div>
                        <div>
                          <p className="text-neutral-500 font-medium">Room Type</p>
                          <p className="text-white font-bold mt-0.5">{b.details.roomType}</p>
                        </div>
                        <div>
                          <p className="text-neutral-500 font-medium">Location</p>
                          <p className="text-white font-bold mt-0.5 line-clamp-1">{b.details.location}</p>
                        </div>
                      </div>
                    )}

                    {/* Rental Details Expansion */}
                    {b.type === 'rental' && b.details && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 bg-neutral-950/50 p-4 border border-neutral-850 rounded-xl text-xs">
                        <div>
                          <p className="text-neutral-500 font-medium">Car Model</p>
                          <p className="text-white font-bold mt-0.5">{b.details.model}</p>
                        </div>
                        <div>
                          <p className="text-neutral-500 font-medium">Provider</p>
                          <p className="text-white font-bold mt-0.5">{b.details.provider}</p>
                        </div>
                        <div>
                          <p className="text-neutral-500 font-medium">Pick-Up</p>
                          <p className="text-white font-bold mt-0.5">{b.details.pickupLocation}</p>
                        </div>
                        <div>
                          <p className="text-neutral-500 font-medium">Pick-Up Date</p>
                          <p className="text-white font-bold mt-0.5">{b.details.pickupDate}</p>
                        </div>
                      </div>
                    )}

                    {/* Itinerary Package Expansion */}
                    {b.type === 'package' && b.details && b.details.days && (
                      <div className="mt-4 bg-neutral-950/50 p-4 border border-neutral-850 rounded-xl space-y-3 text-xs">
                        <p className="text-neutral-500 font-bold uppercase tracking-wider text-[10px]">Planned Days Timeline</p>
                        <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
                          {b.details.days.map((day: any, dIdx: number) => (
                            <div key={dIdx} className="border-l border-emerald-500/40 pl-3 py-0.5">
                              <p className="font-bold text-white">DAY {day.day}: {day.title}</p>
                              <p className="text-neutral-400 mt-0.5">{day.activities}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Action Side */}
                <div className="flex md:flex-col justify-between items-end gap-4 border-t md:border-t-0 border-neutral-800 pt-4 md:pt-0 shrink-0">
                  <div className="text-right">
                    <p className="text-xs text-neutral-500 font-medium">Amount Invested</p>
                    <p className="text-2xl font-bold text-white mt-0.5">${b.price.toLocaleString()}</p>
                  </div>

                  <div className="flex gap-2 w-full md:w-auto">
                    {b.status === 'confirmed' && (
                      <>
                        <button 
                          onClick={() => setSelectedQR(b.qrCode || 'BOARDING_PASS_GENERIC')}
                          className="flex-1 md:flex-none bg-neutral-950 border border-neutral-800 hover:border-emerald-500/30 text-neutral-300 hover:text-white px-4 py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                        >
                          <QrCode className="w-4 h-4 text-emerald-400" /> Digital Boarding Pass
                        </button>
                        <button 
                          onClick={() => onCancelBooking(b.id)}
                          className="bg-neutral-950 border border-neutral-800 hover:bg-red-950/40 hover:border-red-900 text-neutral-400 hover:text-red-400 p-2.5 rounded-xl cursor-pointer transition-colors"
                          title="Cancel Booking"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Boarding Pass Scan Dialog */}
      {selectedQR && (
        <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl w-full max-w-sm text-center shadow-2xl relative space-y-4">
            <h4 className="text-lg font-bold text-white">Travel Boarding Pass</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Scan this QR code at airport kiosks, hotel front desks, or transport checkpoints.
            </p>
            
            {/* Mock QR Canvas */}
            <div className="bg-white p-6 rounded-xl inline-block mx-auto border-4 border-neutral-800">
              <div className="w-40 h-40 bg-neutral-950 flex flex-col items-center justify-center relative rounded-md">
                <QrCode className="w-24 h-24 text-white" />
                <span className="text-[9px] text-emerald-400 font-mono tracking-widest absolute bottom-2">TICKETING-INFO</span>
              </div>
            </div>

            <div className="text-xs font-mono text-neutral-400 break-all bg-neutral-950/60 p-2 rounded border border-neutral-850">
              {selectedQR}
            </div>

            <button 
              onClick={() => setSelectedQR(null)}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs py-2.5 rounded-xl font-medium cursor-pointer transition-colors"
            >
              Done / Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
