import { Metadata } from 'next'
import { UnpaidLeaveManagementClient } from './components/unpaid-leave-management-client'

export const metadata: Metadata = {
  title: 'Pengajuan Izin',
  description: 'Tinjau dan kelola permohonan izin karyawan.',
}

export default function UnpaidLeaveManagementPage() {
  return <UnpaidLeaveManagementClient />
}