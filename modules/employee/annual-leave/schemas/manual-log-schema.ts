import * as z from "zod";

export const manualLogSchema = z.object({
  employee_id: z.number({ error: "Karyawan wajib dipilih" }),
  total: z.number({ error: "Total cuti wajib diisi" }),
  annual_leave_year: z.number().nullable().optional(),
  annual_leave_at: z.string({ error: "Tanggal wajib diisi" }),
  status: z.string({ error: "Status wajib diisi" }),
  keterangan: z.string().max(255, "Maksimal 255 karakter").min(1, "Keterangan wajib diisi"),
  deduction_details_array: z.array(z.object({
    year: z.string().min(4, "Tahun wajib diisi"),
    deduction: z.number({ error: "Jumlah wajib diisi" })
  })),
});

export type ManualLogFormValues = z.infer<typeof manualLogSchema>;
