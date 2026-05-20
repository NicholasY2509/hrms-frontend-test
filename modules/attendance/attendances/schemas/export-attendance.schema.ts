import * as z from "zod"

const formatEnum = z.enum(["excel", "pdf", "csv", "txt"] as const)
const reportTypeEnum = z.enum(["daily_report", "personal_report", "team_report"] as const)

export const exportAttendanceSchema = z.object({
  start_date: z.string().min(1, "Tanggal mulai wajib diisi"),
  end_date: z.string().min(1, "Tanggal selesai wajib diisi"),
  report_type: reportTypeEnum.optional().nullable(),
  employee_id: z.number().nullable(),
  team_id: z.number().nullable(),
  department_id: z.number().nullable(),
  work_location_id: z.number().nullable(),
  attendance_status_id: z.number().nullable(),
  format: formatEnum,
}).superRefine((data, ctx) => {
  if (!data.report_type) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Tipe laporan wajib diisi",
      path: ["report_type"],
    });
  }
  
  if (data.report_type === 'personal_report' && !data.employee_id) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Karyawan wajib dipilih untuk laporan personal",
      path: ["employee_id"],
    });
  }
})

export type ExportAttendanceFormValues = z.infer<typeof exportAttendanceSchema>
