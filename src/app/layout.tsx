import type { Metadata, Viewport } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { BookingEnquiryProvider } from '@/components/leads/BookingEnquiryContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', weight: ['400', '500', '600', '700', '800', '900'] });
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', weight: ['300', '400', '500', '600'], style: ['normal', 'italic'] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Ticketing-Info — Where will the world take you?',
    template: '%s | Ticketing-Info',
  },
  description:
    'Ticketing-Info — search flights, hotels, cruises, car rentals, vacation packages, airport transfers, and travel insurance, then book with a real travel consultant by call, WhatsApp, or enquiry form.',
  openGraph: {
    type: 'website',
    siteName: 'Ticketing-Info',
    title: 'Ticketing-Info — Where will the world take you?',
    description:
      'Search flights, hotels, cruises, car rentals, vacation packages, and transfers. Book with a real travel consultant by call, WhatsApp, or enquiry form.',
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#070c18',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="min-h-screen bg-neutral-950 text-neutral-50 flex flex-col font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'TravelAgency',
              name: 'Ticketing-Info',
              url: siteUrl,
              logo: `${siteUrl}/favicon.png`,
            }),
          }}
        />
        <BookingEnquiryProvider>
          <Header />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </BookingEnquiryProvider>
      </body>
    </html>
  );
}
