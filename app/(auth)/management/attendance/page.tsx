import { Metadata } from 'next'
import { AttendanceManagementClient } from './components/attendance-management-client'

export const metadata: Metadata = {
  title: 'Manajemen Kehadiran',
  description: 'Pantau dan kelola data kehadiran karyawan harian.',
}

export default function AttendanceManagementPage() {
  return <AttendanceManagementClient />
}
