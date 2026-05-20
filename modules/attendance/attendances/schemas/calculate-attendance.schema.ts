import * as z from "zod";

export const calculateAttendanceSchema = z.object({
  start_date: z.string().min(1, "Tanggal mulai wajib diisi"),
  end_date: z.string().min(1, "Tanggal selesai wajib diisi"),
}).refine((data) => {
  if (data.start_date && data.end_date) {
    return new Date(data.start_date) <= new Date(data.end_date);
  }
  return true;
}, {
  message: "Tanggal selesai tidak boleh sebelum tanggal mulai",
  path: ["end_date"],
});

export type CalculateAttendanceFormValues = z.infer<typeof calculateAttendanceSchema>;
