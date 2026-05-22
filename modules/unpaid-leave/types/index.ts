import { Employee } from "@/modules/employee/employee/types"
import { PaginationMeta } from "@/types"
import { ReactNode } from "react"

export interface UnpaidLeaveType {
  id: number
  name: string
  background_color: string
  border_color: string
  text_color: string
  limit: number | null
  is_annual_leave_deduction: boolean
}

export interface UnpaidLeaveApproval {
  id: number
  approver_id?: number | number[]
  approver_name: string | null
  role?: string | null
  status: string
  note?: string | null
  updated_at: string
  is_current?: boolean
  actor?: {
    id: number
    name: string
    profileUrl?: string | null
  } | null
}

export interface UnpaidLeave {
  id: number
  employee: Employee
  type: {
    id: number
    name: string
  }
  date: string
  created_at: string
  start_date: string
  end_date: string
  total_days: number
  note?: string | null
  attachment_url: string
  attachments?: string[]
  confirmed_at?: string | null
  settled_at?: string | null
  status: string
  approvals?: UnpaidLeaveApproval[]
}

export interface UnpaidLeaveCalendarItem {
  id: number
  employee_id: number
  employee_name: string
  start_date: string
  end_date: string
  status: string
  unpaid_leave_type_name: string
  color: string
}

export interface HolidayCalendarItem {
  id: number
  name: string
  date: string
  is_national: boolean
}

export interface UnpaidLeaveCalendarData {
  leaves: UnpaidLeaveCalendarItem[]
  holidays: HolidayCalendarItem[]
}
export interface Holiday {
  id: number
  name: string
  date: string
  created_at: string
  updated_at: string
}
