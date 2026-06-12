import { Metadata } from 'next'
import { SalaryComponentsClient } from './salary-components-client'

export const metadata: Metadata = {
  title: 'Komponen Gaji | HRMS',
  description: 'Kelola master data komponen gaji, tunjangan, dan potongan.',
}

export default function SalaryComponentsPage() {
  return <SalaryComponentsClient />
}
