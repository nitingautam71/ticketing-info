import { z } from 'zod';

export const agentSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
});

export type AgentInput = z.infer<typeof agentSchema>;
