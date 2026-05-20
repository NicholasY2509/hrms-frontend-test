import { Metadata } from 'next'
import { ResignationDetailClient } from './components/resignation-detail-client'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id
  return {
    title: `Detail Resign #${id}`,
    description: `Rincian pengajuan pengunduran diri karyawan dengan ID #${id}.`,
  }
}

export default function ResignationDetailPage() {
  return <ResignationDetailClient />
}
