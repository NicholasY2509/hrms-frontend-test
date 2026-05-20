import { Metadata } from 'next'
import { EmployeeDetailClient } from './components/employee-detail-client'

type Props = {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params
    return {
        title: `Profil Karyawan #${id}`,
        description: `Rincian profil karyawan ID #${id}`,
    }
}

export default function EmployeeDetailPage() {
    return <EmployeeDetailClient />
}
