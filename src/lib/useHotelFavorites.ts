'use client';

import { useState } from 'react';
import type { Hotel } from './providers/hotels';

export interface SavedHotel {
  id: string;
  name: string;
  image: string;
  location: string;
  stars: number;
  rating: number;
  pricePerNight: number;
  currency: string;
  savedAt: number;
}

const FAVORITES_KEY = 'ticketing-info:hotel-favorites';
const RECENTS_KEY = 'ticketing-info:hotel-recently-viewed';
const MAX_RECENTS = 8;

function toSavedHotel(h: Hotel): SavedHotel {
  return { id: h.id, name: h.name, image: h.image, location: h.location, stars: h.stars, rating: h.rating, pricePerNight: h.pricePerNight, currency: h.currency, savedAt: Date.now() };
}

function load(key: string): SavedHotel[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as SavedHotel[]) : [];
  } catch {
    return [];
  }
}

function persist(key: string, value: SavedHotel[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage unavailable (private browsing, quota, etc.) — personalization is a nicety, not required
  }
}

export function useHotelFavorites() {
  const [favorites, setFavorites] = useState<SavedHotel[]>(() => load(FAVORITES_KEY));
  const [recentlyViewed, setRecentlyViewed] = useState<SavedHotel[]>(() => load(RECENTS_KEY));

  const isFavorite = (id: string) => favorites.some((f) => f.id === id);

  const toggleFavorite = (hotel: Hotel) => {
    setFavorites((prev) => {
      const next = prev.some((f) => f.id === hotel.id) ? prev.filter((f) => f.id !== hotel.id) : [toSavedHotel(hotel), ...prev];
      persist(FAVORITES_KEY, next);
      return next;
    });
  };

  const removeFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.filter((f) => f.id !== id);
      persist(FAVORITES_KEY, next);
      return next;
    });
  };

  const recordView = (hotel: Hotel) => {
    setRecentlyViewed((prev) => {
      const next = [toSavedHotel(hotel), ...prev.filter((h) => h.id !== hotel.id)].slice(0, MAX_RECENTS);
      persist(RECENTS_KEY, next);
      return next;
    });
  };

  return { favorites, recentlyViewed, isFavorite, toggleFavorite, removeFavorite, recordView };
}
