import { WorkingHour } from "@/modules/attendance/attendances/types"
import { Employee } from "@/modules/employee/employee/types"

export interface ShiftExchange {
  id: number
  date: string
  employee: Employee
  original_working_hour: WorkingHour
  requested_working_hour: WorkingHour
  exchange_with_employee?: Employee | null
  reason: string
  status: string
  created_at: string
  approval_request?: any
}
