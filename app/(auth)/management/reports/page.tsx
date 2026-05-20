import { Metadata } from 'next'
import { ReportsClient } from './components/reports-client'

export const metadata: Metadata = {
  title: 'Riwayat Laporan & Export',
  description: 'Daftar semua permintaan export data dan status pemrosesan dokumen.',
}

export default function ReportsPage() {
  return <ReportsClient />
}
