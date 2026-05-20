import * as z from "zod";

export const userSchema = z.object({
  email: z.string().email("Email tidak valid").min(1, "Wajib diisi"),
  password: z.string().min(8, "Password minimal 8 karakter").optional().or(z.literal("")),
  password_confirmation: z.string().optional().or(z.literal("")),
  employee_id: z.number().nullable().optional(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Konfirmasi password tidak cocok",
  path: ["password_confirmation"],
});

export type UserFormValues = z.infer<typeof userSchema>;
