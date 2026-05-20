import * as z from 'zod';

export const attendanceWorkingHourSchema = z.object({
  working_hour_id: z.number({ error: "Jadwal kerja wajib diisi" }),
  attendance_at: z.date({ error: "Tanggal wajib diisi" }),
});

export type AttendanceWorkingHourFormValues = z.infer<typeof attendanceWorkingHourSchema>;
