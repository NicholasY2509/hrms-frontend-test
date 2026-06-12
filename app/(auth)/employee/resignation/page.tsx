import { Metadata } from 'next'
import { ResignationClient } from '@/modules/employee/resignation/components/resignation-client'

export const metadata: Metadata = {
  title: 'Pengajuan Resign | HRMS',
  description: 'Formulir pengunduran diri resmi karyawan dan pantauan status.',
}

export default function ResignationPage() {
  return <ResignationClient />
}