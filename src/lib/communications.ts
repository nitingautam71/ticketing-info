import { z } from 'zod';

export const COMM_CHANNELS = ['call', 'email', 'whatsapp', 'sms', 'internal_note'] as const;

export const communicationSchema = z.object({
  channel: z.enum(COMM_CHANNELS),
  direction: z.enum(['inbound', 'outbound']).default('outbound'),
  content: z.string().trim().min(1).max(3000),
  leadId: z.string().trim().optional().or(z.literal('')),
  customerId: z.string().trim().optional().or(z.literal('')),
  bookingId: z.string().trim().optional().or(z.literal('')),
});

export type CommunicationInput = z.infer<typeof communicationSchema>;
