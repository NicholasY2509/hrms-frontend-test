import {
  Calendar01Icon,
  Clock01Icon,
  Mail01Icon,
  Location01Icon,
  PassportIcon,
  IdentificationIcon,
  PhoneCall
} from '@hugeicons/core-free-icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Employee } from '../../types';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { HugeiconsIcon } from '@hugeicons/react';

interface EmployeeSidebarProps {
  employee: Employee;
}

export function EmployeeSidebar({ employee }: EmployeeSidebarProps) {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Informasi Pribadi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-4">
          <InfoRow
            icon={IdentificationIcon}
            label="NIK"
            value={employee.nik}
          />
          <InfoRow
            icon={PhoneCall}
            label="Nomor Telepon"
            value={employee.phone_number || '-'}
          />
          <InfoRow
            icon={Mail01Icon}
            label="Email"
            value={employee.email}
          />
          <InfoRow
            icon={Calendar01Icon}
            label="Tanggal Lahir"
            value={employee.date_birth ? format(new Date(employee.date_birth), 'dd MMM yyyy', { locale: idLocale }) : '-'}
          />
          <InfoRow
            icon={PassportIcon}
            label="Nomor Induk KTP"
            value={employee.id_card_number}
          />
          <InfoRow
            icon={Location01Icon}
            label="Alamat Domisili"
            value={employee.current_address || '-'}
          />
          <InfoRow
            icon={Clock01Icon}
            label="Bergabung Sejak"
            value={employee.join_date ? format(new Date(employee.join_date), 'dd MMM yyyy', { locale: idLocale }) : '-'}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value
}: {
  icon?: any;
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="flex items-start gap-3 group">
      {Icon && (
        <div className="mt-0.5 flex-shrink-0 w-7 h-7 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
          <HugeiconsIcon icon={Icon} className="w-3.5 h-3.5" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70 mb-0.5">
          {label}
        </p>
        <p className="text-sm font-medium text-foreground break-words leading-tight">
          {value || '-'}
        </p>
      </div>
    </div>
  );
}
