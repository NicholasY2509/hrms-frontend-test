import { Metadata } from 'next'
import { ShiftExchangeDetailClient } from './components/shift-exchange-detail-client'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id
  return {
    title: `Detail Tukar Shift #${id}`,
    description: `Rincian pengajuan tukar shift karyawan dengan ID #${id}.`,
  }
}

export default function ShiftExchangeDetailPage() {
  return <ShiftExchangeDetailClient />
}
