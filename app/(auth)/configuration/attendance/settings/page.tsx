import { Metadata } from 'next'
import { AttendanceSettingsClient } from './components/attendance-settings-client'

export const metadata: Metadata = {
  title: 'Pengaturan Operasional Absensi',
  description: 'Konfigurasi parameter operasional untuk sistem absensi harian.',
}

export default function AttendanceSettingsPage() {
  return <AttendanceSettingsClient />
}
