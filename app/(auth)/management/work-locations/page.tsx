import { Metadata } from 'next'
import { WorkLocationManagementClient } from './components/work-location-management-client'

export const metadata: Metadata = {
  title: 'Lokasi Kerja',
  description: 'Kelola daftar lokasi kerja organisasi.',
}

export default function WorkLocationsPage() {
  return <WorkLocationManagementClient />
}