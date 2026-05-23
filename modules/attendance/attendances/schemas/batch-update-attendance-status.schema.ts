import * as z from "zod"

export const batchUpdateAttendanceStatusSchema = z.object({
  attendance_ids: z.array(z.number()).min(1, "Pilih minimal 1 kehadiran"),
  attendance_status_id: z.number({
    error: "Status kehadiran wajib dipilih",
  }),
})

export type BatchUpdateAttendanceStatusFormValues = z.infer<
  typeof batchUpdateAttendanceStatusSchema
>
