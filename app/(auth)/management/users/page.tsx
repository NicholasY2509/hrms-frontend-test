import { Metadata } from 'next'
import { UserManagementClient } from './components/user-management-client'

export const metadata: Metadata = {
  title: 'Manajemen Pengguna',
  description: 'Kelola akun pengguna dan akses sistem.',
}

export default function UserManagementPage() {
  return <UserManagementClient />
}
