'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { PencilEdit01Icon, Delete01Icon } from '@hugeicons/core-free-icons';
import { SalaryComponent } from '@/modules/payroll/salary-components/types';
import { useSalaryComponentMutation } from '@/modules/payroll/salary-components/hooks';

interface ColumnsProps {
  onEdit: (component: SalaryComponent) => void;
}

export const columns = ({ onEdit }: ColumnsProps): ColumnDef<SalaryComponent>[] => [
  {
    accessorKey: 'name',
    header: 'Nama Komponen',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.name}</span>
        <span className="text-xs text-muted-foreground">{row.original.code}</span>
      </div>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Kategori',
    cell: ({ row }) => {
      const category = row.original.category;
      return (
        <Badge variant={category === 'allowance' ? 'success' : category === 'deduction' ? 'destructive' : 'outline'}>
          {category}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'type',
    header: 'Tipe',
    cell: ({ row }) => (
      <Badge variant="secondary" className="capitalize">
        {row.original.type}
      </Badge>
    ),
  },
  {
    accessorKey: 'default_amount',
    header: 'Nominal Default',
    cell: ({ row }) => {
      const amount = row.original.default_amount;
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(amount);
    },
  },
  {
    accessorKey: 'is_taxable',
    header: 'Pajak',
    cell: ({ row }) => (
      <Badge variant={row.original.is_taxable ? 'outline' : 'secondary'}>
        {row.original.is_taxable ? 'Kena Pajak' : 'Bukan Objek'}
      </Badge>
    ),
  },
  {
    accessorKey: 'is_active',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.original.is_active ? 'success' : 'secondary'}>
        {row.original.is_active ? 'Aktif' : 'Non-aktif'}
      </Badge>
    ),
  },
  {
    id: 'actions',
    header: () => <div className="text-right">Aksi</div>,
    cell: ({ row }) => {
      const { remove, isDeleting } = useSalaryComponentMutation();

      return (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(row.original)}
          >
            <HugeiconsIcon icon={PencilEdit01Icon} className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive"
            onClick={() => {
              if (confirm('Apakah Anda yakin ingin menghapus komponen ini?')) {
                remove(row.original.id);
              }
            }}
            disabled={isDeleting}
          >
            <HugeiconsIcon icon={Delete01Icon} className="w-4 h-4" />
          </Button>
        </div>
      );
    },
  },
];
