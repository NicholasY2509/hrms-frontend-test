import * as z from "zod";

export const departmentSchema = z.object({
  name: z.string().min(1, "Nama departemen wajib diisi"),
  heads: z.array(z.object({
    work_location_id: z.number().nullable(),
    employee_id: z.number(),
  })),
});

export type DepartmentFormValues = z.infer<typeof departmentSchema>;
