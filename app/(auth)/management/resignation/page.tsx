import { Metadata } from 'next'
import { ResignationManagementClient } from './components/resignation-management-client'

export const metadata: Metadata = {
  title: 'Manajemen Resign',
  description: 'Kelola dan pantau data pengunduran diri karyawan.',
}

export default function ResignationManagementPage() {
  return <ResignationManagementClient />
}
