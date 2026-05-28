import { Department } from "@/modules/organization/department/types"
import { WorkPosition } from "@/modules/organization/work-position/types"
import { WorkLocation } from "@/modules/organization/work-location/types"

export interface Employee {
  id: number
  nik: string
  employee_id_number: string
  id_card_number: string
  full_name: string
  name: string
  first_name: string
  last_name: string
  initial_name: string | null
  position: WorkPosition
  department: Department
  work_location: WorkLocation
  email: string
  company_email: string | null
  photo_url: string | null
  profileUrl: string | null
  join_date: string
  resign_date: string | null
  phone_number: string | null
  handphone: string | null
  current_address: string
  place_birth: string
  date_birth: string
  work_employee_status_id: number
  work_position_id: number
  department_id: number
  work_location_id: number
  team_id: number | null
  supervisor_id: number | null
  annual_leave_2: number
  annual_leave_3: number
  supervisor?: {
    id: number
    name: string
    nik: string
  }
}

export interface EmployeeOverview {
  employee_id_number: string
  initial: string | null
  company_email: string | null
  position: { id: number; name: string }
  department: { id: number; name: string }
  work_location: { id: number; name: string }
  work_employee_status: { id: number; name: string }
  employee_status: { id: number; name: string }
  team: { id: number | null; name: string | null }
  work_employee_type: { id: number | null; name: string | null }
  supervisor: { id: number; name: string }
  annual_leave_2: number
  annual_leave_3: number
  is_get_annual_leaves?: boolean
}

export interface EmployeePersonal {
  full_name: string
  first_name: string
  last_name: string
  phone_number: string | null
  handphone: string | null
  email: string
  gender: { id: number; name: string }
  marital_status: { id: number; name: string }
  id_card_number: string
  religion: { id: number; name: string }
  blood_group: { id: number; name: string }
  place_birth?: string
  date_birth?: string
  birth_place?: string
  birth_date?: string
  current_address: string
  residence_address: string
}

export interface EmployeeSummary {
  id: number
  name: string
  count: number
}

export interface EmployeeFamily {
  id: number
  family_relationship:
    | {
        id: number
        name: string
      }
    | number
  full_name: string
  gender:
    | {
        id: number
        name: string
      }
    | number
  place_birth: string | null
  date_birth: string
  id_card_number: string
}

export interface EmployeeEmergencyContact {
  id: number
  full_name: string
  current_address: string
  phone_number: string
  family_relationship:
    | {
        id: number | null
        name: string | null
      }
    | number
}

export interface EmployeeEducation {
  id: number
  study: string
  start_year: string
  end_year: string
  school_name: string
}

export interface EmployeeExperience {
  id: number
  office_name: string
  office_address: string
  office_phone: string
  start_year: string
  end_year: string
  work_position: string
  reason: string
}

export interface EmployeeVehicle {
  id: number
  vehicle_name: string
  vehicle_year: string
  plate_number: string
  vehicle_owner: string
}

export interface EmployeeLicense {
  id: number
  license_number: string
  driver_license_type: {
    id: number
    name: string
  }
}

export interface EmployeeWarning {
  id: number
  start_date: string
  end_date: string
  attachment: string | null
  attachment_url: string | null
  warning_at: string
  confirmed_at: string | null
  settled_at: string | null
  document_no: string
  warning_letter_type: {
    id: number
    name: string
  }
}

export interface EmployeeInsurance {
  id: number
  insurance_name: string
  card_number: string
}

export interface TaxProfile {
  id?: number
  employee_id: number
  npwp_number: string | null
  ptkp_setting_id: number | null
  ptkp_setting?: {
    id: number
    code: string
    ter_category: {
      id: number
      name: string
    }
  }
  tax_method: "gross" | "gross_up" | "net"
}

export interface EmployeeBank {
  id: number
  bank_name: string
  account_number: string
  account_name: string
}

export interface EmployeeAttendanceUser {
  id: number | null
  uid: number
  zkteco_machine_id: number
  machine?: {
    id: number
    name: string
  } | null
}
