import { Metadata } from 'next'
import { CoEManagementClient } from './components/coe-management-client'

export const metadata: Metadata = {
  title: 'Surat Keterangan Kerja',
  description: 'Kelola dan pantau pengajuan Surat Keterangan Kerja karyawan.',
}

export default function CertificateOfEmploymentManagementPage() {
  return <CoEManagementClient />
}
