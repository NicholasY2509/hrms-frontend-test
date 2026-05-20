import * as z from "zod";

export const dayTypeOptions = [
  { value: "Weekday", label: "Weekday" },
  { value: "Weekend", label: "Weekend" },
] as const;

export enum UploadType {
  NON_SECURITY = "non_security",
  SECURITY = "security",
}

export const uploadTypeOptions = [
  { value: UploadType.NON_SECURITY, label: "Non Security" },
  { value: UploadType.SECURITY, label: "Security" },
] as const;

export const importWorkingHourSchema = z.object({
  file: z.any().refine((file) => file instanceof File, "File wajib diunggah"),
  month: z.date({
    error: "Bulan wajib diisi",
  }),
  upload_type: z.nativeEnum(UploadType, {
    error: "Jenis unggahan wajib diisi",
  }),
  day_type: z.enum(["Weekday", "Weekend"]).optional(),
}).refine((data) => {
  if (data.upload_type === "non_security" && !data.day_type) {
    return false;
  }
  return true;
}, {
  message: "Tipe hari wajib dipilih untuk tipe Non Security",
  path: ["day_type"],
});

export type ImportWorkingHourFormValues = z.infer<typeof importWorkingHourSchema>;
