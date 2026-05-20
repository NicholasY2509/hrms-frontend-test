import { Metadata } from 'next'
import { ApprovalPoliciesClient } from './components/approval-policies-client'

export const metadata: Metadata = {
  title: 'Konfigurasi Kebijakan Persetujuan',
  description: 'Atur alur persetujuan default dan khusus jabatan untuk berbagai kategori pengajuan.',
}

export default function ApprovalSchemesPage() {
  return <ApprovalPoliciesClient />
}
