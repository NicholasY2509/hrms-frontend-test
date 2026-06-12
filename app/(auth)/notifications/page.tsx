import { Metadata } from 'next'
import { NotificationsClient } from './notifications-client'

export const metadata: Metadata = {
  title: 'Pusat Notifikasi | HRMS',
  description: 'Pantau semua aktivitas dan pemberitahuan sistem Anda di sini.',
}

export default function NotificationsPage() {
  return <NotificationsClient />
}
