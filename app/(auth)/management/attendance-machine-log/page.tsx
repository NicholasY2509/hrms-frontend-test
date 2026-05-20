import { Metadata } from "next"
import { AttendanceMachineLogClient } from "./components/attendance-machine-log-client"

export const metadata: Metadata = {
  title: "Log Absensi Mesin",
  description:
    "Data mentah transaksi absen yang ditarik langsung dari mesin fingerprint biometrik.",
}

export default function AttendanceSummaryPage() {
  return <AttendanceMachineLogClient />
}
