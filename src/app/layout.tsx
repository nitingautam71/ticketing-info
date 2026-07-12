import type { Metadata, Viewport } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppFab from '@/components/layout/WhatsAppFab';
import { BookingEnquiryProvider } from '@/components/leads/BookingEnquiryContext';
import JsonLd from '@/components/seo/JsonLd';
import { travelAgencyJsonLd } from '@/lib/structuredData';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', weight: ['400', '500', '600', '700', '800', '900'] });
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', weight: ['300', '400', '500', '600'], style: ['normal', 'italic'] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Ticketing-Info — Flight Tickets, Train Tickets, Tour Packages & Visa Assistance',
    template: '%s | Ticketing-Info',
  },
  description:
    'Ticketing-Info helps domestic Indian and international travelers book flight tickets, train tickets, hotels, cruises, tour packages, and visa assistance — then book with a real travel consultant by call, WhatsApp, or enquiry form.',
  openGraph: {
    type: 'website',
    siteName: 'Ticketing-Info',
    title: 'Ticketing-Info — Flight Tickets, Train Tickets, Tour Packages & Visa Assistance',
    description:
      'Book flight tickets, train tickets, hotels, cruises, tour packages, and visa assistance for domestic Indian and international travel. Book with a real travel consultant by call, WhatsApp, or enquiry form.',
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  themeColor: '#070c18',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="min-h-screen bg-neutral-950 text-neutral-50 flex flex-col font-sans antialiased">
        <JsonLd data={travelAgencyJsonLd()} />
        <GoogleAnalytics />
        <BookingEnquiryProvider>
          <Header />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
          <WhatsAppFab />
        </BookingEnquiryProvider>
      </body>
    </html>
  );
}
