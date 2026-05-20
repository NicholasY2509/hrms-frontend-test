import { AccessDenied } from '@/components/layout/access-denied';

export const metadata = {
  title: '401 Unauthorized - HRMS',
  description: 'Sesi Anda telah berakhir atau Anda tidak terautentikasi.',
};

export default function UnauthorizedPage() {
  return <AccessDenied status={401} />;
}
