import { Metadata } from 'next'
import { ApprovalInboxClient } from '@/modules/approval-workflow/actions/components/approval-inbox-client'

export const metadata: Metadata = {
  title: 'Kotak Masuk Persetujuan',
  description: 'Satu tempat untuk mengelola semua permintaan yang menunggu keputusan Anda.',
}

export default function ApprovalInboxPage() {
  return <ApprovalInboxClient />
}
