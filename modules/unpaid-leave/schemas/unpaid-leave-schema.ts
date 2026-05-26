import { z } from "zod";

export const unpaidLeaveSchema = z.object({
  unpaid_leave_type_id: z.coerce.number({ message: "Tipe cuti wajib diisi" }),
  start_date: z.date({
    message: "Tanggal mulai wajib diisi",
  }),
  end_date: z.date({
    message: "Tanggal selesai wajib diisi",
  }),
  note: z.string().optional(),
  attachment: z.any().optional(),
}).refine((data) => data.end_date >= data.start_date, {
  message: "Tanggal selesai tidak boleh sebelum tanggal mulai",
  path: ["end_date"],
});

export type UnpaidLeaveFormValues = z.infer<typeof unpaidLeaveSchema>;

export const unpaidLeaveManagementSchema = unpaidLeaveSchema.extend({
  employee_id: z.string().or(z.number()),
});

export type UnpaidLeaveManagementFormValues = z.infer<typeof unpaidLeaveManagementSchema>;
