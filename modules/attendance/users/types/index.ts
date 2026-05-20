import { ZktecoMachineModel } from "../../zkteco/types";

export interface AttendanceUserModel {
  id: number;
  employee_id: number;
  employee: {
    id: number;
    nik: string;
    name: string;
    position: string;
    department: string;
    work_location: string;
    photo_url: string;
  };
  uid: number | string;
  zkteco_machine_id: number;
  zkteco_machine: ZktecoMachineModel;
  created_at: string;
  updated_at: string;
}
