import { z } from 'zod';
import { prisma } from '@/lib/db';

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  subject: z.string().trim().max(200).optional().or(z.literal('')),
  message: z.string().trim().min(5).max(3000),
});

export type ContactInput = z.infer<typeof contactSchema>;

export async function createContactMessage(input: ContactInput) {
  return prisma.contactMessage.create({
    data: {
      name: input.name,
      email: input.email,
      subject: input.subject || undefined,
      message: input.message,
    },
  });
}
