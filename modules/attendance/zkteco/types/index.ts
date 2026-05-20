import { WorkLocationModel } from "../../locations/types"

export interface ZktecoMachineModel {
  id: number
  name: string
  ip_address: string
  soap_port: string
  udp_port: string
  serial_number: string
  work_location_id: number
  work_location: WorkLocationModel
  attendance_location_id: number | null
  attendance_location: any | null
  online: boolean
  created_at: string
  updated_at: string
}

export interface ZktecoAttendanceModel {
  uid: number | string
  timestamp: string
  attendance_at: string
  zkteco_machine_id: number
  zkteco_machine: {
    id: number
    name: string
  }
  attendance_user: {
    id: number
    employee_id: number
    employee_name: string
  } | null
  created_at: string
}

export interface ZktecoUserModel {
  uid: number | string
  name: string | null
  zkteco_machine_id: number
  machine: {
    id: number
    name: string
  }
  is_mapped: boolean
  attendance_user: {
    id: number
    employee_name: string
  } | null
  created_at: string
  updated_at: string
}
