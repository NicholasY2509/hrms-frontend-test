import { Metadata } from 'next'
import { AttendanceMobileLogClient } from './components/attendance-mobile-log-client'

export const metadata: Metadata = {
  title: 'Log Absensi Mobile',
  description: 'Daftar riwayat absensi yang dilakukan melalui aplikasi mobile.',
}

export default function AttendanceMobileLogPage() {
  return <AttendanceMobileLogClient />
}
