import { Metadata } from 'next'
import { StepTypesClient } from './components/step-types-client'

export const metadata: Metadata = {
  title: 'Tipe Tahapan Persetujuan',
  description: 'Kelola tipe tahapan persetujuan yang tersedia di sistem.',
}

export default function StepTypesPage() {
  return <StepTypesClient />
}
