export interface PositionHierarchyMatrix {
  id: number
  work_location_id: number
  department_id: number
  work_position_id: number
  supervisor_work_position_id: number
  location?: { id: number; name: string }
  department?: { id: number; name: string }
  position?: { id: number; name: string }
  supervisor_position?: {
    id: number
    name: string
    employees?: { id: number; name: string }[]
  }
  created_at?: string
  updated_at?: string
}
