import { Metadata } from 'next'
import { ZktecoUsersClient } from './components/zkteco-users-client'

export const metadata: Metadata = {
  title: 'User Mesin Biometrik',
  description: 'Daftar user yang tersimpan di dalam memori mesin fingerprint biometrik.',
}

export default function ZktecoUsersPage() {
  return <ZktecoUsersClient />
}
