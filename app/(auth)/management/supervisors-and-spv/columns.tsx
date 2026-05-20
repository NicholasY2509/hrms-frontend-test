import { ColumnDef } from '@tanstack/react-table';
import { SupervisorModel } from '@/modules/employee/supervisor/types';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Delete01Icon,
  PencilEdit01Icon,
  IdCardLanyardIcon,
  Calendar01Icon
} from '@hugeicons/core-free-icons';

export const getSupervisorColumns = (
  onEdit?: (item: SupervisorModel) => void,
  onDelete?: (item: SupervisorModel) => void
): ColumnDef<SupervisorModel>[] => [
    {
      accessorKey: 'employee',
      header: 'Karyawan',
      cell: ({ row }) => {
        const employee = row.original.employee;
        const name = employee?.name || 'No Name';
        const nik = employee?.nik || '-';

        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-border/50">
              <AvatarFallback className="bg-primary/5 text-primary text-xs font-medium">
                {name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-sm leading-none">{name}</span>
              <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                <HugeiconsIcon icon={IdCardLanyardIcon} size={12} />
                <span className="text-xs">NIK: {nik}</span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Tgl Terdaftar',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={Calendar01Icon} size={14} className="text-muted-foreground" />
          <span className="text-sm">
            {format(new Date(row.original.created_at), 'dd MMM yyyy', { locale: localeId })}
          </span>
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Aksi',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
              onClick={() => onEdit(row.original)}
            >
              <HugeiconsIcon icon={PencilEdit01Icon} className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
              onClick={() => onDelete(row.original)}
            >
              <HugeiconsIcon icon={Delete01Icon} className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];
