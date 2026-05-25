import { Metadata } from "next"
import { EmployeeManagementClient } from "./components/employee-management-client"

export const metadata: Metadata = {
  title: "Data Karyawan",
  description: "Kelola dan pantau data profil seluruh karyawan.",
}

export default function EmployeeManagementPage() {
  return <EmployeeManagementClient />
}
