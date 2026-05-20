import * as z from "zod";

export const teamSchema = z.object({
  name: z.string().min(1, "Nama tim wajib diisi"),
  team_head_id: z.number().nullable(),
});

export type TeamFormValues = z.infer<typeof teamSchema>;
