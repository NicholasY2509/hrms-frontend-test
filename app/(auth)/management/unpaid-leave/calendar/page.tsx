import { Metadata } from 'next'
import { UnpaidLeaveCalendarClient } from './components/unpaid-leave-calendar-client'

export const metadata: Metadata = {
  title: 'Kalender Izin',
  description: 'Tampilan jadwal izin karyawan dalam seminggu.',
}

export default function UnpaidLeaveCalendarPage() {
  return <UnpaidLeaveCalendarClient />
}
