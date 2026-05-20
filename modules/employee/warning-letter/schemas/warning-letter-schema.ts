import * as z from "zod";

export const warningLetterSchema = z.object({
  employee_id: z.number().min(1, "Wajib diisi"),
  warning_letter_type_id: z.number({ error: "Wajib diisi" }),
  document_no: z.string().min(1, "Wajib diisi").max(255, "Maksimal 255 karakter"),
  name: z.string().min(1, "Wajib diisi").max(255, "Maksimal 255 karakter"),
  warning_at: z.date().min(1, "Wajib diisi"),
  start_date: z.date().min(1, "Wajib diisi"),
  end_date: z.date().min(1, "Wajib diisi"),
  note: z.string().optional().nullable(),
  attachment: z.any().optional().nullable(),
});

export type WarningLetterFormValues = z.infer<typeof warningLetterSchema>;