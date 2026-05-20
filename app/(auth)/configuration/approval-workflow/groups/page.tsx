import { Metadata } from 'next'
import { ApprovalGroupsClient } from './components/approval-groups-client'

export const metadata: Metadata = {
  title: 'Grup Persetujuan',
  description: 'Kelola kumpulan pengguna yang dapat menyetujui permintaan secara kolektif.',
}

export default function ApprovalGroupsPage() {
  return <ApprovalGroupsClient />
}
