import { Metadata } from 'next'
import { AuditLogClient } from './components/audit-log-client'

export const metadata: Metadata = {
  title: 'Activity Logs',
  description: 'View all system activities and attribute changes across the application.',
}

export default function AuditLogsPage() {
  return <AuditLogClient />
}
