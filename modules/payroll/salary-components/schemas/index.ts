import { z } from "zod";

export const salaryComponentSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  code: z.string().min(1, "Kode wajib diisi"),
  category: z.enum(['allowance', 'deduction', 'benefit']),
  type: z.enum(['fixed', 'calculated', 'one-time']),
  default_amount: z.coerce.number().min(0),
  is_taxable: z.boolean().default(true),
  is_active: z.boolean().default(true),
});

export type SalaryComponentFormValues = z.infer<typeof salaryComponentSchema>;
