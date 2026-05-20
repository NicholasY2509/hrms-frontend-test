import { Metadata } from "next"
import { AttendanceUserClient } from "./components/attendance-user-client"

export const metadata: Metadata = {
  title: "Pemetaan User Absensi",
  description:
    "Kelola sinkronisasi ID karyawan dengan ID user di mesin absensi fingerprint.",
}

export default function AttendanceUserPage() {
  return <AttendanceUserClient />
}
