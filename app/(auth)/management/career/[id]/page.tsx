import { Metadata } from 'next'
import { CareerDetailClient } from './components/career-detail-client'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id
  return {
    title: `Detail Karir #${id}`,
    description: `Rincian riwayat perubahan karir karyawan dengan ID #${id}.`,
  }
}

export default function CareerDetailPage() {
  return <CareerDetailClient />
}
