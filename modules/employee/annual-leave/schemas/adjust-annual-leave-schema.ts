import * as z from "zod"

export const adjustAnnualLeaveSchema = z.object({
  annual_leave_2: z.number({ error: "Wajib diisi" }),
  annual_leave_3: z.number({ error: "Wajib diisi" }),
  keterangan: z.string().min(1, "Keterangan wajib diisi"),
})

export type AdjustAnnualLeaveFormValues = z.infer<
  typeof adjustAnnualLeaveSchema
>
