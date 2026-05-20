import { Employee } from "@/modules/employee/employee/types"
import { WorkLocation } from "../../work-location/types"

export interface Team {
  id: number
  name: string
  team_head_id: number | null
  head: Employee | null
  work_location: WorkLocation
  work_location_id: number
  employees_count: number
}
