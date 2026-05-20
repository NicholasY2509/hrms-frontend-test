import { Metadata } from 'next'
import { ManagementDashboardClient } from './components/management-dashboard-client'

export const metadata: Metadata = {
  title: 'Dashboard Manajemen',
  description: 'Ringkasan komprehensif metrik tenaga kerja, absensi, dan payroll.',
}

export default function ManagementDashboardPage() {
  return <ManagementDashboardClient />
}
