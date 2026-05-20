import { Metadata } from 'next'
import { UnpaidLeaveClient } from './components/unpaid-leave-client'

export const metadata: Metadata = {
  title: 'Pengajuan Cuti',
  description: 'Daftar pengajuan cuti anda',
}

export default function UnpaidLeaveRequestsPage() {
  return <UnpaidLeaveClient />
}
