import { Metadata } from "next"
import { EmployeeDashboardClient } from "./components/employee-dashboard-client"

export const metadata: Metadata = {
  title: "Dashboard Karyawan",
  description:
    "Dashboard Mandiri Karyawan untuk mengelola kehadiran, pengajuan izin, dan lembur.",
}

export default function EmployeeDashboardPage() {
  return <EmployeeDashboardClient />
}
