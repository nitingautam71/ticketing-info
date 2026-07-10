import React, { useState, useEffect } from 'react';
import { User, Shield, Key, Heart, Mail, Landmark, CheckCircle, Save, Globe, BookOpen } from 'lucide-react';
import { UserProfile as ProfileType } from '../types';

interface UserProfileProps {
  profile: ProfileType | null;
  onUpdateProfile: (updated: ProfileType) => void;
  isLoading: boolean;
}

export default function UserProfile({ profile, onUpdateProfile, isLoading }: UserProfileProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [passportExpiry, setPassportExpiry] = useState('');
  const [nationality, setNationality] = useState('');
  const [dietary, setDietary] = useState('');
  const [seating, setSeating] = useState<'Window' | 'Aisle' | 'No Preference'>('No Preference');
  const [hotelRoom, setHotelRoom] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setEmail(profile.email || '');
      setPassportNumber(profile.passportNumber || '');
      setPassportExpiry(profile.passportExpiry || '');
      setNationality(profile.nationality || '');
      setDietary(profile.preferences?.dietary || '');
      setSeating(profile.preferences?.seating || 'No Preference');
      setHotelRoom(profile.preferences?.hotelRoom || '');
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ProfileType = {
      name,
      email,
      passportNumber,
      passportExpiry,
      nationality,
      preferences: {
        dietary,
        seating,
        hotelRoom
      }
    };
    onUpdateProfile(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  if (isLoading || !profile) {
    return (
      <div className="text-center py-12">
        <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-neutral-400 text-sm">Retrieving global traveler profile...</p>
      </div>
    );
  }

  return (
    <div id="user_profile_container" className="max-w-4xl mx-auto bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-6 md:p-8">
        
        {/* Header Summary */}
        <div className="flex flex-col sm:flex-row gap-5 items-center pb-6 border-b border-neutral-800 mb-6">
          <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <User className="w-8 h-8" />
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h4 className="text-xl font-bold text-white tracking-tight">{name || 'Jane Doe'}</h4>
            <p className="text-xs text-neutral-400 font-medium">Standard Verified Traveler Passport Account</p>
            <div className="flex gap-2 justify-center sm:justify-start items-center text-[10px] text-emerald-400 font-mono bg-emerald-950/40 border border-emerald-900 px-2.5 py-0.5 rounded-full mt-1.5 inline-block w-fit">
              ★ Platinum Tier Elite Status
            </div>
          </div>
        </div>

        {/* Profile Editing Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Basic & Passport credentials */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-800/40">
              <Globe className="w-4 h-4 text-emerald-400" />
              <h5 className="text-sm font-bold text-white uppercase tracking-wider">National & Passport Details</h5>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Full Name (Matches Passport)</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Passport Number</label>
                <input 
                  type="text" 
                  value={passportNumber}
                  onChange={(e) => setPassportNumber(e.target.value)}
                  placeholder="e.g. N0000000"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Passport Expiration</label>
                <input 
                  type="date" 
                  value={passportExpiry}
                  onChange={(e) => setPassportExpiry(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Nationality / Issuing State</label>
                <input 
                  type="text" 
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  placeholder="e.g. United States"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Flight/Hotel preferences */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-800/40">
              <Heart className="w-4 h-4 text-emerald-400" />
              <h5 className="text-sm font-bold text-white uppercase tracking-wider">Traveler Flight & Room Preferences</h5>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Seat Assignment Selection</label>
                <select 
                  value={seating}
                  onChange={(e) => setSeating(e.target.value as any)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Window">Window Seat</option>
                  <option value="Aisle">Aisle Seat</option>
                  <option value="No Preference">No Preference</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Dietary Requirements</label>
                <input 
                  type="text" 
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  placeholder="e.g. Vegan, Halal, Gluten-Free"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Hotel Bedding / Layout Preference</label>
                <input 
                  type="text" 
                  value={hotelRoom}
                  onChange={(e) => setHotelRoom(e.target.value)}
                  placeholder="e.g. King Bed, Quiet Floor"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Secure Trust Stamp */}
          <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl flex items-start gap-3">
            <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-white">TSA Secure Flight Data Vault</p>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                All passport and credential profiles are strictly locked down with end-to-end customer cryptographic keys, satisfying modern global aviation privacy frameworks.
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between border-t border-neutral-800 pt-6">
            <div className="flex items-center gap-2">
              {saveSuccess && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-900 px-3 py-1.5 rounded-lg">
                  <CheckCircle className="w-4 h-4" /> Save Successful
                </div>
              )}
            </div>

            <button 
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white text-xs px-5 py-3 rounded-xl font-bold flex items-center gap-2 cursor-pointer transition-all"
            >
              <Save className="w-4 h-4" /> Save Passport Profile
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
