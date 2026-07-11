# Ticketing-Info

Lead-generation OTA platform: search flights, hotels, cruises, car rentals, vacation packages, airport transfers, trains, and travel insurance, then book via call, WhatsApp, or an enquiry form — a real consultant closes the sale.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS 4
- Prisma (SQLite locally, Postgres in production)
- Gemini (`@google/genai`) for the AI travel planner

## Local development

```bash
npm install
npm run db:push   # creates prisma/dev.db locally
npm run db:seed   # optional: seeds FAQs + testimonials
npm run dev
```

Copy `.env.example` to `.env.local` and fill in:
- `GEMINI_API_KEY` — optional; without it the AI planner runs in a fallback mode.
- `ADMIN_PASSWORD` — gates `/admin`.
- `NEXT_PUBLIC_BUSINESS_PHONE` / `NEXT_PUBLIC_WHATSAPP_NUMBER` / `NEXT_PUBLIC_BUSINESS_EMAIL` — used in Call Now / WhatsApp CTAs sitewide.
- `DATABASE_URL` — defaults to local SQLite; point at Postgres (e.g. Neon) in production.

## Architecture notes

- **Supplier data is mocked.** `src/lib/providers/*` defines one adapter per vertical (flights, hotels, cruises, trains, cars, transfers, insurance, packages, visas). Each currently returns realistic generated data. Swap the exported provider instance for a real supplier integration (Amadeus, Duffel, etc.) without touching any page or route code.
- **No online payments yet.** `src/components/leads/BookingEnquiryModal.tsx` captures a lead (call/WhatsApp click or enquiry form) instead of collecting payment. Admins convert leads to bookings manually from `/admin` once a sale is confirmed offline.
- **Admin auth** is a single shared-password gate (`middleware.ts` + `ADMIN_PASSWORD`) suitable for one operator. Replace with real multi-user auth before adding more admins.
