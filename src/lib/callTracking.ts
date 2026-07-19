import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';

const touchPointSchema = z.object({
  ts: z.number(),
  landingPage: z.string().max(600),
  referrer: z.string().max(600).optional(),
  params: z.record(z.string(), z.string().max(200)),
});

export const callClickSchema = z.object({
  channel: z.enum(['call', 'whatsapp']),
  placement: z.string().trim().min(1).max(80),
  page: z.string().trim().min(1).max(300),
  vertical: z.enum(['flight', 'hotel', 'cruise', 'train', 'car', 'transfer', 'insurance', 'package', 'visa']).optional(),
  phone: z.string().trim().max(40).optional(),
  attribution: z
    .object({
      firstTouch: touchPointSchema,
      lastTouch: touchPointSchema,
    })
    .optional(),
});

export type CallClickInput = z.infer<typeof callClickSchema>;

export async function createCallClick(input: CallClickInput) {
  return prisma.callClick.create({
    data: {
      channel: input.channel,
      placement: input.placement,
      page: input.page,
      vertical: input.vertical,
      phone: input.phone || undefined,
      attribution: input.attribution as Prisma.InputJsonValue | undefined,
    },
  });
}
