import * as z from "zod";

export const careerTransitionSchema = z.object({
  employee_id: z.number({ error: "Wajib diisi" }).min(1, "Wajib diisi"),
  career_type_id: z.number({ error: "Wajib diisi" }),

  before_employee_status_id: z.number({ error: "Wajib diisi" }),
  before_work_position_id: z.number({ error: "Wajib diisi" }),
  before_department_id: z.number({ error: "Wajib diisi" }),
  before_work_location_id: z.number({ error: "Wajib diisi" }),
  before_team_id: z.number().nullable().optional(),
  before_supervisor_id: z.number().nullable().optional(),

  after_employee_status_id: z.number({ error: "Wajib diisi" }),
  after_work_position_id: z.number({ error: "Wajib diisi" }),
  after_department_id: z.number({ error: "Wajib diisi" }),
  after_work_location_id: z.number({ error: "Wajib diisi" }),
  after_team_id: z.number().nullable().optional(),
  after_supervisor_id: z.number().nullable().optional(),

  career_at: z.date({ error: "Wajib diisi" }).refine((date) => date instanceof Date && !isNaN(date.getTime()), { error: "Wajib diisi" }),
  note: z.string().nullable().optional(),
});

export type CareerTransitionFormValues = z.infer<typeof careerTransitionSchema>;
