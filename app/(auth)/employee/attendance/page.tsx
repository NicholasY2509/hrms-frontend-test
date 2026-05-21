import { AttendanceClient } from "./components/attendance-client"

export const metadata = {
  title: "Riwayat Kehadiran Saya",
  description: "Pantau riwayat presensi masuk dan keluar Anda.",
}

export default function AttendancePage() {
  return <AttendanceClient />
}
