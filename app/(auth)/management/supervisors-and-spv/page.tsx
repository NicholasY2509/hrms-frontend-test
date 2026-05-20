import { Metadata } from 'next'
import { SupervisorsClient } from './components/supervisors-client'

export const metadata: Metadata = {
  title: 'Daftar Atasan & SPV',
  description: 'Kelola daftar karyawan yang didaftarkan sebagai Atasan atau SPV.',
}

export default function SupervisorManagementPage() {
  return <SupervisorsClient />
}
