import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { prisma } from '@/lib/db';
import { testimonialSchema } from '@/lib/cms';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = testimonialSchema.parse(body);
    const testimonial = await prisma.testimonial.create({
      data: {
        name: input.name,
        location: input.location || undefined,
        quote: input.quote,
        rating: input.rating,
        published: input.published ?? false,
      },
    });
    return NextResponse.json({ success: true, testimonial });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: 'Invalid input', issues: err.issues }, { status: 400 });
    }
    console.error('Failed to create testimonial:', err);
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}
