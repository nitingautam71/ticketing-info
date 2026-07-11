import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { prisma } from '@/lib/db';
import { taskSchema } from '@/lib/tasks';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = taskSchema.parse(body);
    const task = await prisma.task.create({
      data: {
        title: input.title,
        description: input.description || undefined,
        dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
        assignedAgentId: input.assignedAgentId || undefined,
        leadId: input.leadId || undefined,
        bookingId: input.bookingId || undefined,
      },
    });
    return NextResponse.json({ success: true, task });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: 'Invalid input', issues: err.issues }, { status: 400 });
    }
    console.error('Failed to create task:', err);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
