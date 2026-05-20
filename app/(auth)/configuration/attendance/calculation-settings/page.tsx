import { Metadata } from 'next'
import { CalculationSettingsClient } from './components/calculation-settings-client'

export const metadata: Metadata = {
  title: 'Pengaturan Kalkulasi Absensi',
  description: 'Konfigurasi parameter untuk logika perhitungan dan status absensi.',
}

export default function AttendanceCalculationSettingsPage() {
  return <CalculationSettingsClient />
}
