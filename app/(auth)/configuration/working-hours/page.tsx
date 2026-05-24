import { Metadata } from 'next'
import { WorkingHoursClient } from './components/working-hours-client'

export const metadata: Metadata = {
  title: 'Master Jam Kerja',
  description: 'Kelola data master jam kerja dan shift yang berlaku di perusahaan.',
}

export default function WorkTimesPage() {
  return <WorkingHoursClient />
}
