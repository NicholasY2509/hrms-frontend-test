import { Metadata } from 'next'
import { WorkPositionManagementClient } from './components/work-position-management-client'

export const metadata: Metadata = {
  title: 'Posisi Kerja',
  description: 'Kelola daftar posisi kerja, tunjangan, dan lokasi penempatan.',
}

export default function WorkPositionsPage() {
  return <WorkPositionManagementClient />
}
