import { Metadata } from 'next'
import { AttendanceWorkingHourClient } from './components/attendance-working-hour-client'

export const metadata: Metadata = {
  title: 'Jadwal Kerja Karyawan',
  description: 'Kelola dan pantau jadwal kerja serta shift harian karyawan.',
}

export default function AttendanceWorkingHourPage() {
  return <AttendanceWorkingHourClient />
}
