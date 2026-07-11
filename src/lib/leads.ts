import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import type { BookingVertical } from '@/lib/types';

export const leadSchema = z.object({
  vertical: z.enum(['flight', 'hotel', 'cruise', 'train', 'car', 'transfer', 'insurance', 'package', 'visa']),
  contactMethod: z.enum(['call', 'whatsapp', 'callback', 'form', 'email']),
  name: z.string().trim().min(2, 'Name is required').max(120),
  email: z.string().trim().email().optional().or(z.literal('')),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  message: z.string().trim().max(2000).optional().or(z.literal('')),
  sourcePage: z.string().trim().max(200).optional(),
  payload: z.record(z.string(), z.unknown()).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

export async function createLead(input: LeadInput) {
  const lead = await prisma.lead.create({
    data: {
      vertical: input.vertical as BookingVertical,
      contactMethod: input.contactMethod,
      name: input.name,
      email: input.email || undefined,
      phone: input.phone || undefined,
      message: input.message || undefined,
      sourcePage: input.sourcePage,
      payload: input.payload as Prisma.InputJsonValue | undefined,
    },
  });

  await prisma.auditLog.create({
    data: {
      actor: 'system',
      action: 'lead.created',
      entity: 'Lead',
      entityId: lead.id,
      meta: { vertical: lead.vertical, contactMethod: lead.contactMethod },
    },
  });

  return lead;
}
