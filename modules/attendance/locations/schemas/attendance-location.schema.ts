import * as z from "zod";

export const attendanceLocationSchema = z.object({
  name: z.string().min(1, "Nama lokasi wajib diisi").max(255),
  latitude: z.string().min(1, "Latitude wajib diisi"),
  longitude: z.string().min(1, "Longitude wajib diisi"),
  distance: z.number().min(1, "Jarak minimal 1 meter"),
  work_location_id: z.number().min(1, "Lokasi kerja wajib dipilih"),
});

export type AttendanceLocationFormValues = z.infer<typeof attendanceLocationSchema>;
