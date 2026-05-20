import { Metadata } from 'next'
import { PolicyRulesClient } from './components/policy-rules-client'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id
  return {
    title: `Kebijakan Persetujuan #${id}`,
    description: `Konfigurasi aturan dan alur persetujuan untuk kategori pengajuan #${id}.`,
  }
}

export default function SchemeDetailPage() {
  return <PolicyRulesClient />
}
