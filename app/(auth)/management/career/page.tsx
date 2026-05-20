import { Metadata } from 'next'
import { CareerManagementClient } from './components/career-management-client'

export const metadata: Metadata = {
  title: 'Riwayat Karir',
  description: 'Kelola mutasi, promosi, dan perubahan jabatan karyawan.',
}

export default function CareerManagementPage() {
  return <CareerManagementClient />
}
