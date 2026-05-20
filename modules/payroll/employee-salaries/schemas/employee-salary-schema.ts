import * as z from "zod";

export const employeeSalarySchema = z.object({
  employee_id: z.coerce.number(),
  bpjs_base_amount: z.coerce.number().min(0, "Wajib diisi"),
  actual_base_amount: z.coerce.number().min(0, "Wajib diisi"),
  effective_date: z.string().min(1, "Wajib diisi"),
  reason: z.string().min(1, "Alasan wajib diisi"),
});

export type EmployeeSalaryFormValues = z.infer<typeof employeeSalarySchema>;
