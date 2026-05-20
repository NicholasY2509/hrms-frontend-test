import * as z from "zod";

export const holidaySchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  date: z.string().min(1, "Tanggal wajib diisi"),
});

export type HolidayFormValues = z.infer<typeof holidaySchema>;
