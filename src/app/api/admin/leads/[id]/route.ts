import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { LEAD_STAGES, LEAD_PRIORITIES } from '@/lib/leadLifecycle';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const data: Record<string, unknown> = {};

  if (typeof body.stage === 'string') {
    if (!LEAD_STAGES.includes(body.stage)) {
      return NextResponse.json({ error: 'Invalid stage' }, { status: 400 });
    }
    data.stage = body.stage;
  }

  if (typeof body.priority === 'string') {
    if (!LEAD_PRIORITIES.includes(body.priority)) {
      return NextResponse.json({ error: 'Invalid priority' }, { status: 400 });
    }
    data.priority = body.priority;
  }

  if ('assignedAgentId' in body) {
    data.assignedAgentId = body.assignedAgentId || null;
  }

  if (typeof body.notes === 'string') {
    data.notes = body.notes;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  const lead = await prisma.lead.update({ where: { id }, data });
  return NextResponse.json({ success: true, lead });
}
