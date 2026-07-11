import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { prisma } from '@/lib/db';
import { faqSchema } from '@/lib/cms';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = faqSchema.parse(body);
    const faq = await prisma.faqEntry.create({
      data: {
        category: input.category || undefined,
        question: input.question,
        answer: input.answer,
        published: input.published ?? true,
        sortOrder: input.sortOrder ?? 0,
      },
    });
    return NextResponse.json({ success: true, faq });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: 'Invalid input', issues: err.issues }, { status: 400 });
    }
    console.error('Failed to create FAQ:', err);
    return NextResponse.json({ error: 'Failed to create FAQ' }, { status: 500 });
  }
}
