import * as z from 'zod';

export const schemeSchema = z.object({
  name: z.string().min(1, 'Nama kategori harus diisi').max(255),
  model_class: z.string().min(1, 'Model class harus diisi').max(255),
  description: z.string().nullable().optional(),
});

export type SchemeFormValues = z.infer<typeof schemeSchema>;
