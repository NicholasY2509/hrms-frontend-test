import { Metadata } from 'next'
import { CertificateOfEmploymentDetailClient } from './components/coe-detail-client'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id
  return {
    title: `Detail CoE #${id}`,
    description: `Rincian pengajuan Surat Keterangan Kerja karyawan dengan ID #${id}.`,
  }
}

export default function CertificateOfEmploymentDetailPage() {
  return <CertificateOfEmploymentDetailClient />
}
