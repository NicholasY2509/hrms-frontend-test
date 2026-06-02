import { ColumnDef } from '@tanstack/react-table';
import { EmployeeSalary } from '@/modules/payroll/employee-salaries/types';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Edit01Icon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';

export const getEmployeeSalaryColumns = (
  onEdit: (employeeSalary: EmployeeSalary) => void
): ColumnDef<EmployeeSalary>[] => [
  {
    accessorKey: 'employee_id',
    header: 'Karyawan',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.employee?.name || `ID: ${row.original.employee_id}`}</span>
        <span className="text-xs text-muted-foreground">{row.original.employee?.nik || '-'}</span>
      </div>
    ),
  },
  {
    accessorKey: 'bpjs_base_amount',
    header: 'Sub Total 1',
    cell: ({ row }) => {
      const amount = row.original.bpjs_base_amount;
      const currency = row.original.currency || 'IDR';
      return <span>{currency} {amount.toLocaleString('id-ID')}</span>;
    },
  },
  {
    accessorKey: 'actual_base_amount',
    header: 'Sub Total 2',
    cell: ({ row }) => {
      const amount = row.original.actual_base_amount;
      const currency = row.original.currency || 'IDR';
      // Basic formatting, assuming formatCurrency handles the currency type
      return <span className="font-medium">{currency} {amount.toLocaleString('id-ID')}</span>;
    },
  },
  
  {
    accessorKey: 'hourly_rate',
    header: 'Tarif Per Jam',
    cell: ({ row }) => {
      const amount = row.original.hourly_rate;
      const currency = row.original.currency || 'IDR';
      return <span>{currency} {amount.toLocaleString('id-ID')}</span>;
    },
  },
  {
    accessorKey: 'effective_date',
    header: 'Tanggal Efektif',
    cell: ({ row }) => {
      try {
        return <span>{format(new Date(row.original.effective_date), 'dd MMM yyyy', { locale: id })}</span>;
      } catch (e) {
        return <span>{row.original.effective_date}</span>;
      }
    },
  },
  {
    header: 'Aksi',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className='cursor-pointer hover:text-primary' onClick={() => onEdit(row.original)}>
            <HugeiconsIcon icon={Edit01Icon} />
          </Button>
        </div>
      )
    }
  }
];
