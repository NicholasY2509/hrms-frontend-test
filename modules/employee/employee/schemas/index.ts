import * as z from "zod"

export const employeeOverviewSchema = z.object({
  employee_id_number: z.string().min(1, "Wajib diisi").max(255),
  initial_name: z.string().max(50).nullable(),
  company_email: z
    .string()
    .email("Email Tidak Valid")
    .toLowerCase()
    .nullable()
    .or(z.literal("")),
  department_id: z.number({ error: "Wajib diisi" }).min(1, "Wajib diisi"),
  work_position_id: z.number({ error: "Wajib diisi" }).min(1, "Wajib diisi"),
  work_location_id: z.number({ error: "Wajib diisi" }).min(1, "Wajib diisi"),
  employee_status_id: z.number({ error: "Wajib diisi" }).min(1, "Wajib diisi"),
  work_employee_status_id: z
    .number({ error: "Wajib diisi" })
    .min(1, "Wajib diisi"),
  team_id: z.number().nullable(),
  join_date: z.string().min(1, "Wajib diisi"),
})

export type EmployeeOverviewFormValues = z.infer<typeof employeeOverviewSchema>

export const employeeUserBaseSchema = z.object({
  email: z.string().email("Email Tidak Valid").toLowerCase(),
  password: z.string().min(8, "Minimal 8 karakter"),
  password_confirmation: z.string().min(1, "Wajib diisi"),
})

export const employeeUserSchema = employeeUserBaseSchema.refine(
  (data) => data.password === data.password_confirmation,
  {
    message: "Konfirmasi password tidak cocok",
    path: ["password_confirmation"],
  }
)

export type EmployeeUserFormValues = z.infer<typeof employeeUserSchema>

export const employeePersonalSchema = z.object({
  first_name: z.string().min(1, "Wajib diisi").max(255),
  last_name: z.string().max(255).nullable(),
  full_name: z.string().max(255).nullable(),
  gender_id: z.number().nullable(),
  marital_status_id: z.number().nullable(),
  religion_id: z.number({ error: "Wajib diisi" }).min(1, "Wajib diisi"),
  blood_group_id: z.number({ error: "Wajib diisi" }).min(1, "Wajib diisi"),
  place_birth: z.string().max(255).nullable(),
  date_birth: z.string().nullable(),
  phone_number: z.string().max(20).nullable(),
  handphone: z.string().max(20).nullable(),
  email: z
    .string()
    .email("Email Tidak Valid")
    .toLowerCase()
    .nullable()
    .or(z.literal("")),
  id_card_number: z.string().max(255).nullable(),
  current_address: z.string().min(1, "Wajib diisi"),
  residence_address: z.string().min(1, "Wajib diisi"),
  avatar: z.any().optional(),
})

export type EmployeePersonalFormValues = z.infer<typeof employeePersonalSchema>

export const employeeAttachmentSchema = z.object({
  ktp: z.any().optional().nullable(),
  kartu_keluarga: z.any().optional().nullable(),
  ijazah: z.any().optional().nullable(),
  file_pendukung: z.array(z.any()).optional().nullable(),
})

export type EmployeeAttachmentFormValues = z.infer<
  typeof employeeAttachmentSchema
>

export const familySchema = z.object({
  full_name: z.string().min(1, "Wajib diisi").max(255),
  family_relationship_id: z
    .number({ error: "Wajib diisi" })
    .min(1, "Wajib diisi"),
  gender_id: z.number({ error: "Wajib diisi" }).min(1, "Wajib diisi"),
  place_birth: z.string().max(255).nullable(),
  date_birth: z.string().min(1, "Wajib diisi"),
  id_card_number: z.string().min(1, "Wajib diisi").max(255),
})

export type FamilyFormValues = z.infer<typeof familySchema>

export const createEmployeeSchema = employeeOverviewSchema
  .merge(employeePersonalSchema)
  .merge(employeeUserBaseSchema)
  .merge(employeeAttachmentSchema)
  .refine((data) => data.password === data.password_confirmation, {
    message: "Konfirmasi password tidak cocok",
    path: ["password_confirmation"],
  })

export type CreateEmployeeFormValues = z.infer<typeof createEmployeeSchema>

export const emergencyContactSchema = z.object({
  full_name: z.string().min(1, "Wajib diisi").max(255),
  family_relationship_id: z
    .number({ error: "Wajib diisi" })
    .min(1, "Wajib diisi"),
  current_address: z.string().min(1, "Wajib diisi"),
  phone_number: z.string().min(1, "Wajib diisi").max(20),
})

export type EmergencyContactFormValues = z.infer<typeof emergencyContactSchema>

export const educationSchema = z.object({
  study: z.string().max(255).optional(),
  start_year: z.string().min(4, "Min 4 karakter").max(4),
  end_year: z.string().min(4, "Min 4 karakter").max(4),
  school_name: z.string().min(1, "Wajib diisi").max(255),
})

export type EducationFormValues = z.infer<typeof educationSchema>

export const experienceSchema = z.object({
  office_name: z.string().min(1, "Wajib diisi").max(255),
  office_address: z.string().min(1, "Wajib diisi"),
  office_phone: z.string().min(1, "Wajib diisi").max(20),
  start_year: z
    .string({ error: "Wajib diisi" })
    .min(4, "Min 4 karakter")
    .max(4),
  end_year: z.string({ error: "Wajib diisi" }).min(4, "Min 4 karakter").max(4),
  work_position: z.string().min(1, "Wajib diisi").max(255),
  reason: z.string().min(1, "Wajib diisi"),
})

export type ExperienceFormValues = z.infer<typeof experienceSchema>

export const vehicleSchema = z.object({
  vehicle_name: z.string().min(1, "Wajib diisi").max(255),
  vehicle_year: z.string().min(4, "Min 4 karakter").max(4),
  plate_number: z.string().min(1, "Wajib diisi").max(50),
  vehicle_owner: z.string().min(1, "Wajib diisi").max(255),
})

export type VehicleFormValues = z.infer<typeof vehicleSchema>

export const licenseSchema = z.object({
  license_number: z.string().min(1, "Wajib diisi").max(50),
  driver_license_type_id: z
    .number({ error: "Wajib diisi" })
    .min(1, "Wajib diisi"),
})

export type LicenseFormValues = z.infer<typeof licenseSchema>

export const insuranceSchema = z.object({
  insurance_name: z.string().min(1, "Wajib diisi").max(255),
  card_number: z.string().min(1, "Wajib diisi").max(50),
})

export type InsuranceFormValues = z.infer<typeof insuranceSchema>

export const bankSchema = z.object({
  bank_name: z.string().min(1, "Wajib diisi").max(255),
  account_number: z.string().min(1, "Wajib diisi").max(50),
  account_name: z.string().min(1, "Wajib diisi").max(255),
})

export type BankFormValues = z.infer<typeof bankSchema>

export const taxProfileSchema = z.object({
  npwp_number: z.string().nullable().optional(),
  ptkp_setting_id: z.number().min(1, "Wajib diisi").nullable().optional(),
  tax_method: z.enum(["gross", "gross_up", "net"]),
})

export type TaxProfileFormValues = z.infer<typeof taxProfileSchema>

export const attendanceUserSchema = z.object({
  uid: z.number({ error: "Harus berupa angka" }).min(1, "Wajib diisi"),
  zkteco_machine_id: z.number({ error: "Wajib diisi" }).min(1, "Wajib diisi"),
})

export type AttendanceUserFormValues = z.infer<typeof attendanceUserSchema>
