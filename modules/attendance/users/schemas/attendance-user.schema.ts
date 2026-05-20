import * as z from "zod";

export const attendanceUserSchema = z.object({
  employee_id: z.number().min(1, "Karyawan wajib dipilih"),
  uid: z.union([z.string(), z.number()]).refine((val) => val !== "", {
    message: "UID wajib diisi",
  }),
  zkteco_machine_id: z.number().min(1, "Mesin absensi wajib dipilih"),
});

export type AttendanceUserFormValues = z.infer<typeof attendanceUserSchema>;
