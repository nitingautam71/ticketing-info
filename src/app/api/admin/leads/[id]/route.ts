import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const VALID_STATUSES = ['new', 'contacted', 'quoted', 'converted', 'closed'];

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { status } = await req.json();

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const lead = await prisma.lead.update({ where: { id }, data: { status } });
  return NextResponse.json({ success: true, lead });
}
