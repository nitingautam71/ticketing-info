import { z } from 'zod';

export const testimonialSchema = z.object({
  name: z.string().trim().min(2).max(120),
  location: z.string().trim().max(120).optional().or(z.literal('')),
  quote: z.string().trim().min(5).max(1000),
  rating: z.coerce.number().int().min(1).max(5),
  published: z.boolean().optional(),
});

export const faqSchema = z.object({
  category: z.string().trim().max(80).optional().or(z.literal('')),
  question: z.string().trim().min(3).max(300),
  answer: z.string().trim().min(3).max(3000),
  published: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

export const blogPostSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase, alphanumeric, and hyphen-separated'),
  title: z.string().trim().min(2).max(200),
  excerpt: z.string().trim().max(500).optional().or(z.literal('')),
  content: z.string().trim().min(10),
  coverImage: z.string().trim().max(500).optional().or(z.literal('')),
  published: z.boolean().optional(),
});

export const siteSettingSchema = z.object({
  key: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[a-zA-Z0-9._-]+$/, 'Key can only contain letters, numbers, dots, dashes, and underscores'),
  value: z.string().trim().min(1).max(5000),
});
