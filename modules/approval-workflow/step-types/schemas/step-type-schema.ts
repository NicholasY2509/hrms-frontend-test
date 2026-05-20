import * as z from 'zod';

export const stepTypeSchema = z.object({
  name: z.string().min(1, 'Nama harus diisi'),
  slug: z.string().min(1, 'Slug harus diisi').regex(/^[a-z0-9_]+$/, 'Slug hanya boleh berisi huruf kecil, angka, dan underscore'),
  needs_target: z.boolean(),
  description: z.string().optional(),
});

export type StepTypeFormValues = z.infer<typeof stepTypeSchema>;
