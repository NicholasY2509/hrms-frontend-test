import { Metadata } from 'next'
import { OvertimeTypesClient } from './components/overtime-types-client'

export const metadata: Metadata = {
  title: 'Tipe Lembur',
  description: 'Kelola kategori dan tarif lembur karyawan berdasarkan ketentuan perusahaan.',
}

export default function OvertimeTypeManagementPage() {
  return <OvertimeTypesClient />
}
