import { ColumnDef } from '@tanstack/react-table';
import { Department } from '@/modules/organization/department/types';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HugeiconsIcon } from '@hugeicons/react';
import { PencilEdit01Icon, Delete02Icon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';

export const getDepartmentColumns = (
  onEdit: (department: Department) => void,
  onDelete: (department: Department) => void
): ColumnDef<Department>[] => [
    {
      accessorKey: 'name',
      header: 'Nama Departemen',
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: 'heads',
      header: 'Kepala Departemen',
      cell: ({ row }) => {
        const heads = row.original.heads;
        if (!heads || heads.length === 0) {
          return <span className="text-muted-foreground italic text-sm">Tidak ada kepala yang ditugaskan</span>;
        }

        if (heads.length === 1) {
          const assignment = heads[0];
          return (
            <div className="flex items-center gap-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium leading-none">{assignment.employee.name}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  {assignment.work_location?.name ?? 'Semua Lokasi'}
                </span>
              </div>
            </div>
          );
        }

        return (
          <div className="flex flex-col gap-1">
            <Badge variant="outline" className="w-fit text-[10px] font-bold">
              {heads.length} Kepala (Lokasi Berbeda)
            </Badge>
            <div className="text-[11px] text-muted-foreground">
              {heads.slice(0, 2).map((h) => h.employee.name).join(', ')}
              {heads.length > 2 && '...'}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'employees_count',
      header: 'Karyawan',
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-mono">
          {row.original.employees_count}
        </Badge>
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
            className="h-8 w-8 text-muted-foreground hover:text-primary"
            onClick={() => onEdit(row.original)}
          >
            <HugeiconsIcon icon={PencilEdit01Icon} className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(row.original)}
          >
            <HugeiconsIcon icon={Delete02Icon} className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];
