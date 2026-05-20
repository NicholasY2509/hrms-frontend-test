import * as z from "zod";

export const employeeSalaryComponentSchema = z.object({
  employee_id: z.coerce.number(),
  salary_component_id: z.coerce.number().min(1, "Wajib dipilih"),
  amount: z.coerce.number().min(0, "Wajib diisi"),
  effective_date: z.string().min(1, "Wajib diisi"),
  is_calculated: z.boolean().default(false),
});

export type EmployeeSalaryComponentFormValues = z.infer<typeof employeeSalaryComponentSchema>;
