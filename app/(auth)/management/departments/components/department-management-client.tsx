'use client';

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon, Search01Icon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { DataTable } from '@/components/data-table/data-table';
import { PageHeader } from '@/components/layout/page-header';
import { getDepartmentColumns } from '../columns';
import { useDepartments } from '@/modules/organization/department/hooks/use-departments';
import { useDeleteDepartment } from '@/modules/organization/department/hooks/use-department-mutation';
import { useDebounce } from '@/hooks/use-debounce';
import { Department } from '@/modules/organization/department/types';
import { DepartmentFormDialog } from '@/modules/organization/department/components/department-form-dialog';
import { ConfirmModal } from '@/components/ui/confirm-modal';

export function DepartmentManagementClient() {
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedDepartment, setSelectedDepartment] = React.useState<Department | null>(null);
  const [confirmModal, setConfirmModal] = React.useState<{
    isOpen: boolean;
    department: Department | null;
  }>({
    isOpen: false,
    department: null,
  });
  const debouncedSearch = useDebounce(search, 500);

  const { items: departments, meta, isLoading, mutate } = useDepartments({
    params: {
      search: debouncedSearch,
      page
    }
  });

  const { deleteDepartment } = useDeleteDepartment();

  const handleAdd = () => {
    setSelectedDepartment(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (department: Department) => {
    setSelectedDepartment(department);
    setIsDialogOpen(true);
  };

  const handleDelete = (department: Department) => {
    setConfirmModal({
      isOpen: true,
      department,
    });
  };

  const onConfirmDelete = async () => {
    if (!confirmModal.department) return;
    const success = await deleteDepartment(confirmModal.department.id);
    if (success) {
      mutate();
      setConfirmModal({ isOpen: false, department: null });
    }
  };

  const columns = React.useMemo(
    () => getDepartmentColumns(handleEdit, handleDelete),
    []
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Departemen"
        description="Kelola departemen organisasi dan kepalanya."
      >
        <Button className="gap-2" variant="default" onClick={handleAdd}>
          <HugeiconsIcon icon={Add01Icon} className="h-4 w-4" /> Tambah Departemen
        </Button>
      </PageHeader>

      <div className="flex items-center gap-4">
        <InputGroup className="flex-1 max-w-sm bg-background">
          <InputGroupAddon>
            <HugeiconsIcon icon={Search01Icon} className="text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Cari departemen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
      </div>

      <DataTable
        columns={columns}
        data={departments}
        isLoading={isLoading}
        pagination={
          meta
            ? {
              ...meta,
              onPageChange: (p) => setPage(p),
            }
            : undefined
        }
      />

      <DepartmentFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        department={selectedDepartment}
        onSuccess={() => mutate()}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, department: null })}
        onConfirm={onConfirmDelete}
        title="Hapus Departemen"
        description={`Apakah Anda yakin ingin menghapus departemen "${confirmModal.department?.name}"? Tindakan ini tidak dapat dibatalkan.`}
      />
    </div>
  );
}
