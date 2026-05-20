import * as z from "zod";

export const unpaidLeaveTypeSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  background_color: z.string().min(4, "Warna background wajib diisi").regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Format warna tidak valid"),
  border_color: z.string().min(4, "Warna border wajib diisi").regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Format warna tidak valid"),
  text_color: z.string().min(4, "Warna teks wajib diisi").regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Format warna tidak valid"),
  limit: z.number().nullable(),
  is_annual_leave_deduction: z.boolean(),
});

export type UnpaidLeaveTypeFormValues = z.infer<typeof unpaidLeaveTypeSchema>;
