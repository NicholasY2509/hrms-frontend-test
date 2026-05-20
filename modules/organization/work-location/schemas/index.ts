import * as z from "zod";

export const workLocationSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
});

export type WorkLocationFormValues = z.infer<typeof workLocationSchema>;
