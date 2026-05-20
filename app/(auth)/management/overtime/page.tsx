import { Metadata } from 'next'
import { OvertimeManagementClient } from './components/overtime-management-client'

export const metadata: Metadata = {
    title: 'Manajemen Lembur',
    description: 'Tinjau dan kelola permohonan lembur karyawan.',
}

export default function OvertimeManagementPage() {
    return <OvertimeManagementClient />
}