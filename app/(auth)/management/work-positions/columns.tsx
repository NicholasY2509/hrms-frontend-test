import { ColumnDef } from '@tanstack/react-table';
import { WorkPosition } from '@/modules/organization/work-position/types';
import { Badge } from '@/components/ui/badge';
import { HugeiconsIcon } from '@hugeicons/react';
import { PencilEdit01Icon, Delete02Icon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

export const getWorkPositionColumns = (
  onEdit: (position: WorkPosition) => void,
  onDelete: (position: WorkPosition) => void
): ColumnDef<WorkPosition>[] => [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => <span className="text-muted-foreground">#{row.original.id}</span>,
  },
  {
    accessorKey: 'name',
    header: 'Nama Posisi',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.name}</span>
        {row.original.alias && (
          <span className="text-xs text-muted-foreground">{row.original.alias}</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'lokasi',
    header: 'Lokasi',
    cell: ({ row }) => row.original.lokasi || '-',
  },
  {
    accessorKey: 'uang_makan',
    header: 'Uang Makan',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span>{formatCurrency(row.original.uang_makan || 0)}</span>
        {row.original.potongan_uang_makan && (
          <span className="text-[10px] text-destructive">
            Potongan: {formatCurrency(row.original.potongan_uang_makan)}
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'uang_transport',
    header: 'Uang Transport',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span>{formatCurrency(row.original.uang_transport || 0)}</span>
        {row.original.potongan_uang_transport && (
          <span className="text-[10px] text-destructive">
            Potongan: {formatCurrency(row.original.potongan_uang_transport)}
          </span>
        )}
      </div>
    ),
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
