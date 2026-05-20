import { Metadata } from 'next'
import { AnnualLeaveManagementClient } from './components/annual-leave-management-client'

export const metadata: Metadata = {
  title: 'Daftar Cuti Tahunan',
  description: 'Pantau dan kelola penggunaan cuti tahunan karyawan.',
}

export default function AnnualLeaveManagementPage() {
  return <AnnualLeaveManagementClient />
}
