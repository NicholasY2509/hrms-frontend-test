import { Metadata } from 'next'
import { CreateEmployeeClient } from './components/create-employee-client'

export const metadata: Metadata = {
  title: 'Tambah Karyawan Baru',
  description: 'Tambah karyawan baru ke sistem HRMS Deltamas.',
}

export default function CreateEmployeePage() {
  return <CreateEmployeeClient />
}
