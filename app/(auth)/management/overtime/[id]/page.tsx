import { Metadata } from 'next'
import { OvertimeDetailClient } from './components/overtime-detail-client'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id
  return {
    title: `Detail Lembur #${id}`,
    description: `Rincian pengajuan lembur karyawan dengan ID #${id}.`,
  }
}

export default function OvertimeDetailPage() {
  return <OvertimeDetailClient />
}
