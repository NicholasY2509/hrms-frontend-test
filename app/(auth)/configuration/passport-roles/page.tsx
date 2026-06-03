import { Metadata } from 'next';
import { PassportRolesClient } from './components/passport-roles-client';

export const metadata: Metadata = {
  title: 'Konfigurasi Peran Passport',
  description: 'Kelola peran passport untuk global dan posisi kerja.',
};

export default function PassportRolesPage() {
  return <PassportRolesClient />;
}
