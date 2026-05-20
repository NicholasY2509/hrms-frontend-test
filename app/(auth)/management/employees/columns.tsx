import { ColumnDef } from '@tanstack/react-table';
import { Employee } from '@/modules/employee/employee/types';
import { Badge } from '@/components/ui/badge';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ProfileIcon,
  UserIcon,
  Briefcase01Icon,
  Building01Icon,
  Location01Icon,
  Calendar01Icon
} from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const getEmployeeColumns = (
  onView: (item: Employee) => void
): ColumnDef<Employee>[] => [
    {
      accessorKey: 'name',
      header: 'Karyawan',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-border/50">
            <AvatarImage src={row.original.photo_url || ''} alt={row.original.name} />
            <AvatarFallback className="bg-primary/5 text-primary text-xs">
              {row.original.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-sm leading-none">{row.original.name}</span>
            <span className="text-xs text-muted-foreground mt-1">NIK: {row.original.nik}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'position',
      header: 'Jabatan',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={Briefcase01Icon} size={14} className="text-muted-foreground" />
          <span className="text-sm">{row.original.position.name}</span>
        </div>
      ),
    },
    {
      accessorKey: 'department',
      header: 'Departemen',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={Building01Icon} size={14} className="text-muted-foreground" />
          <span className="text-sm">{row.original.department.name}</span>
        </div>
      ),
    },
    {
      accessorKey: 'work_location',
      header: 'Lokasi',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={Location01Icon} size={14} className="text-muted-foreground" />
          <span className="text-sm">{row.original.work_location.name}</span>
        </div>
      ),
    },
    {
      accessorKey: 'join_date',
      header: 'Tgl Bergabung',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={Calendar01Icon} size={14} className="text-muted-foreground" />
          <span className="text-sm">
            {row.original.join_date ? format(new Date(row.original.join_date), 'dd MMM yyyy', { locale: localeId }) : '-'}
          </span>
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Aksi',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
            onClick={() => onView(row.original)}
          >
            <HugeiconsIcon icon={ProfileIcon} className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];
