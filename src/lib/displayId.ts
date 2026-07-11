import { prisma } from '@/lib/db';

function formatYYYYMMDD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}${m}${day}`;
}

async function nextDisplayId(prefix: string, countToday: (start: Date, end: Date) => Promise<number>): Promise<string> {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  const count = await countToday(start, end);
  return `${prefix}-${formatYYYYMMDD(now)}-${String(count + 1).padStart(6, '0')}`;
}

export const generateLeadDisplayId = () =>
  nextDisplayId('LD', (start, end) => prisma.lead.count({ where: { createdAt: { gte: start, lt: end } } }));

export const generateBookingDisplayId = () =>
  nextDisplayId('BK', (start, end) => prisma.booking.count({ where: { createdAt: { gte: start, lt: end } } }));

export const generateQuotationDisplayId = () =>
  nextDisplayId('QT', (start, end) => prisma.quotation.count({ where: { createdAt: { gte: start, lt: end } } }));
