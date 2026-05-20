import { Metadata } from 'next'
import { AttendanceLocationsClient } from './components/attendance-locations-client'

export const metadata: Metadata = {
  title: 'Lokasi Absensi',
  description: 'Kelola titik koordinat dan radius absensi untuk pembatasan lokasi presensi mobile.',
}

export default function AttendanceLocationsPage() {
  return <AttendanceLocationsClient />
}
