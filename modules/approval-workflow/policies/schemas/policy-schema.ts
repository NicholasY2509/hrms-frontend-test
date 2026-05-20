import * as z from 'zod';

export const policySchema = z.object({
  name: z.string().min(1, 'Nama kebijakan wajib diisi'),
  approvable_type: z.string().min(1, 'Tipe pengajuan wajib diisi'),
  is_default: z.boolean(),
  work_position_id: z.number().nullable(),
  is_active: z.boolean(),
}).refine((data) => data.is_default || data.work_position_id, {
  message: 'Pilih jabatan atau centang sebagai Default',
  path: ['work_position_id'],
});

export type PolicyFormValues = z.infer<typeof policySchema>;
