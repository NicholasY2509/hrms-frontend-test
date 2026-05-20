import * as z from 'zod';

export const ruleSchema = z.object({
  work_position_id: z.number().optional().nullable(),
  department_id: z.number().optional().nullable(),
  work_location_id: z.number().optional().nullable(),
});

export type RuleFormValues = z.infer<typeof ruleSchema>;
