import * as z from 'zod';

export const groupSchema = z.object({
  name: z.string().min(1, 'Nama grup harus diisi'),
  description: z.string().optional(),
});

export type GroupFormValues = z.infer<typeof groupSchema>;
