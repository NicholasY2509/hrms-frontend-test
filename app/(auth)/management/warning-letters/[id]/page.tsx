import { Metadata } from 'next'
import { WarningLetterDetailClient } from './components/warning-letter-detail-client'

type Props = {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params
    return {
        title: `Detail SP #${id}`,
        description: `Rincian Surat Peringatan ID #${id}`,
    }
}

export default function WarningLetterDetailPage() {
    return <WarningLetterDetailClient />
}
