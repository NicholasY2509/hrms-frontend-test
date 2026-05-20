import { Metadata } from 'next'
import { WarningLettersManagementClient } from './components/warning-letter-management-client'

export const metadata: Metadata = {
  title: 'Surat Peringatan',
  description: 'Kelola dan pantau surat peringatan (SP) karyawan.',
}

export default function WarningLettersManagementPage() {
  return <WarningLettersManagementClient />
}
