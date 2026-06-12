'use client';

import * as React from 'react';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { PageHeader } from '@/components/layout/page-header';
import { PageError } from '@/components/layout/page-error';
import { Button } from '@/components/ui/button';
import { PlusSignIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { columns } from './columns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSalaryComponents } from '@/modules/payroll/salary-components/hooks';
import { SalaryComponent } from '@/modules/payroll/salary-components/types';
import { SalaryComponentForm } from '@/modules/payroll/salary-components/components/salary-component-form';

export function SalaryComponentsClient() {
  const { items, isLoading, isError } = useSalaryComponents();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedComponent, setSelectedComponent] = React.useState<SalaryComponent | undefined>();

  const handleEdit = (component: SalaryComponent) => {
    setSelectedComponent(component);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedComponent(undefined);
    setIsDialogOpen(true);
  };

  if (isError) return <PageError />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Komponen Gaji"
        description="Kelola master data komponen gaji, tunjangan, dan potongan."
      />

      <Button onClick={handleCreate}>
        <HugeiconsIcon icon={PlusSignIcon} className="w-4 h-4 mr-2" />
        Tambah Komponen
      </Button>

      {isLoading ? (
        <DataTableSkeleton rowCount={5} columnCount={6} />
      ) : (
        <DataTable
          columns={columns({ onEdit: handleEdit })}
          data={items}
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedComponent ? 'Edit Komponen Gaji' : 'Tambah Komponen Gaji'}</DialogTitle>
          </DialogHeader>
          <SalaryComponentForm
            initialData={selectedComponent}
            onSuccess={() => setIsDialogOpen(false)}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
