import { Metadata } from 'next'
import { OvertimeClient } from './components/overtime-client'

export const metadata: Metadata = {
    title: 'Pengajuan Lembur',
    description: 'Kelola dan ajukan lembur Anda di sini.',
}

export default function OvertimePage() {
    return <OvertimeClient />
}