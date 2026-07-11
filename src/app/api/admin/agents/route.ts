import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { prisma } from '@/lib/db';
import { agentSchema } from '@/lib/agents';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = agentSchema.parse(body);
    const agent = await prisma.agent.create({
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone || undefined,
      },
    });
    return NextResponse.json({ success: true, agent });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: 'Invalid input', issues: err.issues }, { status: 400 });
    }
    if (err instanceof Error && 'code' in err && (err as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: 'An agent with this email already exists' }, { status: 409 });
    }
    console.error('Failed to create agent:', err);
    return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 });
  }
}
