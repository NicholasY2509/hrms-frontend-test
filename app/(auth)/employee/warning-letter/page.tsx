import { Metadata } from 'next'
import { WarningLetterClient } from './components/warning-letter-client'

export const metadata: Metadata = {
  title: 'Surat Peringatan Saya',
  description: 'Daftar surat peringatan Anda',
}

export default function WarningLetterPage() {
  return <WarningLetterClient />
}
