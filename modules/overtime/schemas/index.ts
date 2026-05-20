import * as z from "zod";
import { format, subDays, isAfter, isBefore, startOfDay } from "date-fns";

export const overtimeSchema = z.object({
  date: z.string().min(1, "Tanggal wajib diisi"),
  type: z.enum(["UMUM", "DAC", "NATIONAL"], {
    message: "Jenis lembur wajib dipilih",
  }),
  overtime_type_id: z.number().optional().nullable(),
  start_time: z.string().min(1, "Waktu mulai wajib diisi"),
  finish_time: z.string().min(1, "Waktu selesai wajib diisi"),
  note: z.string().optional(),
  estimated_cost: z.number().optional(),
  attachments: z.array(z.any()).optional(),
}).refine((data) => {
  if (data.start_time && data.finish_time) {
    const isDac = data.type === "DAC";
    const start = isDac ? new Date(data.start_time) : new Date(`2000-01-01T${data.start_time}`);
    const finish = isDac ? new Date(data.finish_time) : new Date(`2000-01-01T${data.finish_time}`);
    
    let diff = (finish.getTime() - start.getTime()) / (1000 * 60 * 60);
    if (!isDac && diff < 0) diff += 24;

    // Minimal 2 hours for non-DAC
    if (data.type !== "DAC" && diff < 1.99) {
        return false;
    }
  }
  return true;
}, {
  message: "Total waktu lembur tidak boleh kurang dari 2 jam!",
  path: ["finish_time"],
}).refine((data) => {
    if (data.start_time && data.finish_time) {
        const isDac = data.type === "DAC";
        const start = isDac ? new Date(data.start_time) : new Date(`2000-01-01T${data.start_time}`);
        const finish = isDac ? new Date(data.finish_time) : new Date(`2000-01-01T${data.finish_time}`);
        
        let diff = (finish.getTime() - start.getTime()) / (1000 * 60 * 60);
        if (!isDac && diff < 0) diff += 24;

        // Maximal 4 hours for non-holiday and non-DAC
        if (!["NATIONAL", "DAC"].includes(data.type) && diff > 4.01) {
            return false;
        }
    }
    return true;
}, {
    message: "Total waktu lembur tidak boleh lebih dari 4 jam!",
    path: ["finish_time"],
})
.refine((data) => {
    if (data.date) {
        const overtimeDate = startOfDay(new Date(data.date));
        const today = startOfDay(new Date());
        const threeDaysAgo = subDays(today, 3);

        if (isBefore(overtimeDate, threeDaysAgo)) {
            return false;
        }
        if (isAfter(overtimeDate, today)) {
            return false;
        }
    }
    return true;
}, {
    message: "Tanggal lembur harus dalam 3 hari terakhir dan tidak boleh di masa depan!",
    path: ["date"],
});

export type OvertimeFormValues = z.infer<typeof overtimeSchema>;
