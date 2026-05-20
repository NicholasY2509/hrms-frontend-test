'use client';

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Search01Icon,
  Add01Icon
} from '@hugeicons/core-free-icons';
import { DataTable } from '@/components/data-table/data-table';
import { PageHeader } from '@/components/layout/page-header';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/use-debounce';
import { SupervisorModel } from '@/modules/employee/supervisor/types';
import { SupervisorFormDialog } from '@/modules/employee/supervisor/components/supervisor-form-dialog';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { FilterCard, FilterGrid } from '@/components/layout/filter-card';
import { useSupervisors } from '@/modules/employee/supervisor/hooks/use-supervisors';
import { getSupervisorColumns } from '../columns';
import { useDeleteSupervisor } from '@/modules/employee/supervisor/hooks/use-supervisor-mutation';

export function SupervisorsClient() {
  // Filters State
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState('15');

  // Modal State
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = React.useState<SupervisorModel | null>(null);
  const [confirmModal, setConfirmModal] = React.useState<{
    isOpen: boolean;
    supervisor: SupervisorModel | null;
  }>({
    isOpen: false,
    supervisor: null,
  });

  const debouncedSearch = useDebounce(search, 500);

  // Fetch Supervisors
  const { items, meta, isLoading, mutate } = useSupervisors({
    params: {
      search: debouncedSearch,
      page,
      per_page: Number(perPage),
    }
  });

  const { deleteSupervisor } = useDeleteSupervisor({
    onSuccess: () => mutate()
  });

  const handleAdd = () => {
    setSelectedSupervisor(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (supervisor: SupervisorModel) => {
    setSelectedSupervisor(supervisor);
    setIsDialogOpen(true);
  };

  const handleDelete = (supervisor: SupervisorModel) => {
    setConfirmModal({
      isOpen: true,
      supervisor,
    });
  };

  const onConfirmDelete = async () => {
    if (!confirmModal.supervisor) return;
    await deleteSupervisor(confirmModal.supervisor.id);
    setConfirmModal({ isOpen: false, supervisor: null });
  };

  const handleResetFilters = () => {
    setSearch('');
    setPage(1);
  };

  const columns = React.useMemo(
    () => getSupervisorColumns(handleEdit, handleDelete),
    []
  );

  const hasActiveFilters = search !== '';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daftar Atasan & SPV"
        description="Kelola daftar karyawan yang didaftarkan sebagai Atasan atau SPV."
      >
        <Button className="gap-2" variant="default" onClick={handleAdd}>
          <HugeiconsIcon icon={Add01Icon} className="h-4 w-4" /> Daftarkan Atasan
        </Button>
      </PageHeader>

      <FilterCard
        onReset={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
        perPage={perPage}
        onPerPageChange={setPerPage}
      >
        <FilterGrid cols={4}>
          <InputGroup className="bg-background">
            <InputGroupAddon>
              <HugeiconsIcon icon={Search01Icon} className="text-muted-foreground" size={14} />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Cari nama atau NIK..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </FilterGrid>
      </FilterCard>

      <DataTable
        columns={columns}
        data={items}
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

      <SupervisorFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        supervisor={selectedSupervisor}
        onSuccess={() => mutate()}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, supervisor: null })}
        onConfirm={onConfirmDelete}
        title="Hapus Atasan"
        description={`Apakah Anda yakin ingin menghapus "${confirmModal.supervisor?.employee?.name}" dari daftar atasan? Karyawan yang terhubung dengan atasan ini mungkin perlu diperbarui.`}
      />
    </div>
  );
}
