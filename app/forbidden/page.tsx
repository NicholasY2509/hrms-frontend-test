import { AccessDenied } from '@/components/layout/access-denied';

export const metadata = {
  title: '403 Forbidden - HRMS',
  description: 'Anda tidak memiliki akses ke halaman ini.',
};

export default function ForbiddenPage() {
  return <AccessDenied status={403} />;
}
