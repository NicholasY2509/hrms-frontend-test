import * as z from "zod";

export const overtimeTypeSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  price: z.string().min(1, "Harga wajib diisi"),
});

export type OvertimeTypeFormValues = z.infer<typeof overtimeTypeSchema>;
