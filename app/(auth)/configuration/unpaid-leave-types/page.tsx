import { Metadata } from 'next'
import { UnpaidLeaveTypesClient } from './components/unpaid-leave-types-client'

export const metadata: Metadata = {
  title: 'Tipe Izin/Cuti',
  description: 'Kelola daftar tipe izin atau cuti yang berlaku di perusahaan.',
}

export default function UnpaidLeaveTypeManagementPage() {
  return <UnpaidLeaveTypesClient />
}
