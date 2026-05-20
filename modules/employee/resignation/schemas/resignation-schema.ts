import * as z from "zod";

export const resignationSchema = z.object({
  effective_date: z.string().min(1, "Wajib diisi"),
  reason: z.string().min(1, "Wajib diisi"),
  attachment: z.any().optional(),
});

export type ResignationFormValues = z.infer<typeof resignationSchema>;
