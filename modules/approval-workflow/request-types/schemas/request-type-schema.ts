import { z } from 'zod';

export const requestTypeSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  slug: z.string().min(1, 'Slug wajib diisi'),
  description: z.string().nullable().optional(),
  is_active: z.boolean(),
});

export type RequestTypeFormValues = z.infer<typeof requestTypeSchema>;
