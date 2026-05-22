import * as z from "zod"

export const shiftExchangeSchema = z.object({
  date: z.string().min(1, "Wajib diisi"),
  original_working_hour_id: z.number().min(1, "Wajib diisi"),
  requested_working_hour_id: z.number().min(1, "Wajib diisi"),
  exchange_with_employee_id: z.number().nullable().optional(),
  reason: z.string().min(1, "Wajib diisi"),
})

export type ShiftExchangeFormValues = z.infer<typeof shiftExchangeSchema>
