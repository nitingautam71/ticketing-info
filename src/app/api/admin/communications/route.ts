import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { prisma } from '@/lib/db';
import { communicationSchema } from '@/lib/communications';
import { requireAdmin } from '@/lib/adminAuth';
import { logAdminAction } from '@/lib/adminAudit';

export async function POST(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    const body = await req.json();
    const input = communicationSchema.parse(body);
    const communication = await prisma.communicationLog.create({
      data: {
        channel: input.channel,
        direction: input.direction,
        content: input.content,
        leadId: input.leadId || undefined,
        customerId: input.customerId || undefined,
        bookingId: input.bookingId || undefined,
      },
    });
    await logAdminAction('communication.created', 'CommunicationLog', communication.id, { channel: input.channel });
    return NextResponse.json({ success: true, communication });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: 'Invalid input', issues: err.issues }, { status: 400 });
    }
    console.error('Failed to log communication:', err);
    return NextResponse.json({ error: 'Failed to log communication' }, { status: 500 });
  }
}
