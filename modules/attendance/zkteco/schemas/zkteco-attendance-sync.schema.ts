import * as z from "zod"

export const zktecoAttendanceSyncSchema = z
  .object({
    zkteco_machine_id: z.number().min(1, "Mesin fingerprint wajib dipilih"),
    start_date: z.string().min(1, "Tanggal mulai wajib diisi"),
    end_date: z.string().min(1, "Tanggal selesai wajib diisi"),
  })
  .refine(
    (data) => {
      if (data.start_date && data.end_date) {
        return new Date(data.start_date) <= new Date(data.end_date)
      }
      return true
    },
    {
      message: "Tanggal selesai tidak boleh sebelum tanggal mulai",
      path: ["end_date"],
    }
  )

export type ZktecoAttendanceSyncFormValues = z.infer<
  typeof zktecoAttendanceSyncSchema
>
