import * as z from "zod";

export const workingHourSchema = z.object({
  name: z.string().min(1, "Nama jam kerja wajib diisi").max(255),
  clock_in: z.string().min(1, "Jam masuk wajib diisi"),
  clock_out: z.string().min(1, "Jam pulang wajib diisi"),
});

export type WorkingHourFormValues = z.infer<typeof workingHourSchema>;
