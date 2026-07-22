import { NextResponse, after } from 'next/server';
import { ZodError } from 'zod';
import { leadSchema, createLead } from '@/lib/leads';
import { notifyNewLead } from '@/lib/notifications';
import { rateLimit, clientIp, tooManyRequestsResponse } from '@/lib/rateLimit';

export async function POST(req: Request) {
  const { allowed, resetAt } = rateLimit(`leads:${clientIp(req)}`, 8, 60_000);
  if (!allowed) return tooManyRequestsResponse(resetAt);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  try {
    const input = leadSchema.parse(body);
    const lead = await createLead(input);
    // Alert the team after the response is sent — the enquiry is already saved,
    // so a slow/failing webhook can't delay or break lead capture.
    after(() => notifyNewLead(lead));
    return NextResponse.json({ success: true, id: lead.id });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: 'Invalid input', issues: err.issues }, { status: 400 });
    }
    console.error('Failed to create lead:', err);
    return NextResponse.json({ error: 'Failed to save enquiry' }, { status: 500 });
  }
}
