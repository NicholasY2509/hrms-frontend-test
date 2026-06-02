'use client';

import * as React from 'react';
import { useEmployeeSalaryList } from '@/modules/payroll/employee-salaries/hooks/use-employee-salary';
import { DataTable } from '@/components/data-table/data-table';
import { getEmployeeSalaryColumns } from '../columns';
import { PageHeader } from '@/components/layout/page-header';
import { ManagementFilter } from '@/components/layout/management-filter';
import { useUrlFilters } from '@/hooks/use-url-filters';
import { useDebounce } from '@/hooks/use-debounce';
import { EmployeeSalaryFormDialog } from '@/modules/payroll/employee-salaries/components/employee-salary-form-dialog';
import { EmployeeSalary } from '@/modules/payroll/employee-salaries/types';

export function EmployeeSalaryClient() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedSalary, setSelectedSalary] = React.useState<EmployeeSalary | null>(null);

  const { filters, setFilter, resetFilters, hasActiveFilters } = useUrlFilters({
    page: 1,
    per_page: 15,
    search: '',
  });

  const debouncedSearch = useDebounce(filters.search, 500);

  const { items, meta, isLoading, mutate } = useEmployeeSalaryList({
    page: filters.page,
    per_page: Number(filters.per_page),
    search: debouncedSearch,
  });

  const handleEdit = React.useCallback((employeeSalary: EmployeeSalary) => {
    setSelectedSalary(employeeSalary);
    setIsDialogOpen(true);
  }, []);

  const columns = React.useMemo(() => getEmployeeSalaryColumns(handleEdit), [handleEdit]);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Gaji Karyawan" 
        description="Kelola dan pantau data gaji seluruh karyawan." 
      />
      
      <ManagementFilter
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
        perPage={String(filters.per_page)}
        onPerPageChange={(v) => setFilter('per_page', v)}
        search={{
          value: filters.search,
          onChange: (v) => setFilter('search', v),
          placeholder: "Cari gaji karyawan...",
        }}
      />

      <DataTable 
        columns={columns} 
        data={items} 
        isLoading={isLoading}
        pagination={
          meta
            ? {
              ...meta,
              onPageChange: (p) => setFilter('page', p),
            }
            : undefined
        }
      />

      <EmployeeSalaryFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        employeeSalary={selectedSalary}
        onSuccess={() => mutate()}
      />
    </div>
  );
}
