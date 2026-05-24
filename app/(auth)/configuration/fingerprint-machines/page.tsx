import { Metadata } from 'next'
import { FingerprintMachinesClient } from './components/fingerprint-machines-client'

export const metadata: Metadata = {
  title: 'Mesin Absensi Biometrik',
  description: 'Monitor status konektivitas dan konfigurasi jaringan mesin fingerprint ZKTeco.',
}

export default function FingerprintMachinesPage() {
  return <FingerprintMachinesClient />
}
