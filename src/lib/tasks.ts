import { z } from 'zod';

export const TASK_STATUSES = ['pending', 'in_progress', 'done', 'cancelled'] as const;

export const taskSchema = z.object({
  title: z.string().trim().min(2).max(200),
  description: z.string().trim().max(2000).optional().or(z.literal('')),
  dueDate: z.string().trim().optional().or(z.literal('')),
  assignedAgentId: z.string().trim().optional().or(z.literal('')),
  leadId: z.string().trim().optional().or(z.literal('')),
  bookingId: z.string().trim().optional().or(z.literal('')),
});

export type TaskInput = z.infer<typeof taskSchema>;
