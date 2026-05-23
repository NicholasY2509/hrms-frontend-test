import * as z from "zod"

export const positionHierarchyMatrixSchema = z.object({
  work_location_id: z.number().nullable().optional(),
  department_id: z.number().min(1, "Required"),
  work_position_id: z.number().min(1, "Required"),
  supervisor_work_position_id: z.number().min(1, "Required"),
})

export type PositionHierarchyMatrixFormValues = z.infer<
  typeof positionHierarchyMatrixSchema
>
