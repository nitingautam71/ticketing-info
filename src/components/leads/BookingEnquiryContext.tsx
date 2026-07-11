'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { BookingEnquiryItem } from '@/lib/types';
import BookingEnquiryModal from './BookingEnquiryModal';

interface BookingEnquiryContextValue {
  open: (item: BookingEnquiryItem) => void;
  close: () => void;
}

const BookingEnquiryContext = createContext<BookingEnquiryContextValue | null>(null);

export function BookingEnquiryProvider({ children }: { children: ReactNode }) {
  const [item, setItem] = useState<BookingEnquiryItem | null>(null);

  const open = useCallback((next: BookingEnquiryItem) => setItem(next), []);
  const close = useCallback(() => setItem(null), []);

  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <BookingEnquiryContext.Provider value={value}>
      {children}
      {item && <BookingEnquiryModal item={item} onClose={close} />}
    </BookingEnquiryContext.Provider>
  );
}

export function useBookingEnquiry() {
  const ctx = useContext(BookingEnquiryContext);
  if (!ctx) throw new Error('useBookingEnquiry must be used within BookingEnquiryProvider');
  return ctx;
}
