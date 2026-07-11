import { prisma } from '@/lib/db';

function formatYYYYMMDD(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}${m}${day}`;
}

// Always bucket "today" in UTC, regardless of the server's local timezone —
// must be consistent whether it runs on a laptop or a Vercel function.
//
// Uses a single atomic UPSERT (INSERT ... ON CONFLICT DO UPDATE count = count + 1)
// against a per-day counter row, not a "count existing rows" read-then-write —
// the latter races under concurrent requests (two requests can read the same
// count before either commits), which is exactly what caused duplicate
// display IDs in production.
async function nextDisplayId(prefix: string): Promise<string> {
  const now = new Date();
  const key = `${prefix}-${formatYYYYMMDD(now)}`;

  const counter = await prisma.dailyCounter.upsert({
    where: { id: key },
    create: { id: key, count: 1 },
    update: { count: { increment: 1 } },
  });

  return `${key}-${String(counter.count).padStart(6, '0')}`;
}

export const generateLeadDisplayId = () => nextDisplayId('LD');
export const generateBookingDisplayId = () => nextDisplayId('BK');
export const generateQuotationDisplayId = () => nextDisplayId('QT');
