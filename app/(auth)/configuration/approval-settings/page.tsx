import { Metadata } from 'next'
import { ApprovalSettingsClient } from './components/approval-settings-client'

export const metadata: Metadata = {
  title: 'Pengaturan Persetujuan',
  description: 'Konfigurasi batas waktu otomatis dan parameter alur kerja persetujuan.',
}

export default function ApprovalSettingsPage() {
  return <ApprovalSettingsClient />
}
