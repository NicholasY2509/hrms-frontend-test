import { Metadata } from 'next'
import { CallbackClient } from './callback-client'

export const metadata: Metadata = {
  title: 'Autentikasi | HRMS',
  description: 'Memproses login Anda...',
}

export default function CallbackPage() {
  return <CallbackClient />
}
