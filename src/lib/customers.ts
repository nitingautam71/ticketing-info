import { z } from 'zod';

export const customerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  whatsapp: z.string().trim().max(40).optional().or(z.literal('')),

  gender: z.string().trim().max(40).optional().or(z.literal('')),
  dob: z.string().trim().optional().or(z.literal('')),
  nationality: z.string().trim().max(80).optional().or(z.literal('')),
  passportNumber: z.string().trim().max(40).optional().or(z.literal('')),
  passportExpiry: z.string().trim().optional().or(z.literal('')),
  visaStatus: z.string().trim().max(120).optional().or(z.literal('')),

  addressStreet: z.string().trim().max(200).optional().or(z.literal('')),
  addressCity: z.string().trim().max(120).optional().or(z.literal('')),
  addressCountry: z.string().trim().max(120).optional().or(z.literal('')),
  addressZip: z.string().trim().max(20).optional().or(z.literal('')),

  notes: z.string().trim().max(3000).optional().or(z.literal('')),
});

export type CustomerInput = z.infer<typeof customerSchema>;

export function toCustomerData(input: CustomerInput) {
  return {
    name: input.name,
    email: input.email,
    phone: input.phone || undefined,
    whatsapp: input.whatsapp || undefined,
    gender: input.gender || undefined,
    dob: input.dob ? new Date(input.dob) : undefined,
    nationality: input.nationality || undefined,
    passportNumber: input.passportNumber || undefined,
    passportExpiry: input.passportExpiry ? new Date(input.passportExpiry) : undefined,
    visaStatus: input.visaStatus || undefined,
    addressStreet: input.addressStreet || undefined,
    addressCity: input.addressCity || undefined,
    addressCountry: input.addressCountry || undefined,
    addressZip: input.addressZip || undefined,
    notes: input.notes || undefined,
  };
}
