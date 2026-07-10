import { NextResponse } from 'next/server';
import { contactSchema, createContactMessage } from '@/lib/contact';
import { rateLimit, clientIp, tooManyRequestsResponse } from '@/lib/rateLimit';

export async function POST(req: Request) {
  const { allowed, resetAt } = rateLimit(`contact:${clientIp(req)}`, 5, 60_000);
  if (!allowed) return tooManyRequestsResponse(resetAt);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', issues: parsed.error.issues }, { status: 400 });
  }

  const message = await createContactMessage(parsed.data);
  return NextResponse.json({ success: true, id: message.id });
}
