'use client';

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon, Search01Icon, Loading03Icon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { DataTable } from '@/components/data-table/data-table';
import { createColumns } from '../columns';
import { PageHeader } from '@/components/layout/page-header';
import { useApprovalStepTypes } from '@/modules/approval-workflow/step-types/hooks/use-step-types';
import { useDeleteStepType } from '@/modules/approval-workflow/step-types/hooks/use-step-types-mutation';
import { StepTypeFormDialog } from '@/modules/approval-workflow/step-types/components/step-type-form-dialog';
import { ApprovalStepType } from '@/modules/approval-workflow/step-types/types';
import { useDebounce } from '@/hooks/use-debounce';
import { ConfirmModal } from '@/components/ui/confirm-modal';

export function StepTypesClient() {
  const { deleteStepType } = useDeleteStepType();
  const [search, setSearch] = React.useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = React.useState(1);

  const { stepTypes, meta, isLoading, mutate } = useApprovalStepTypes({
    search: debouncedSearch,
    page
  });

  const [selectedType, setSelectedType] = React.useState<ApprovalStepType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [confirmModal, setConfirmModal] = React.useState<{
    isOpen: boolean;
    type: ApprovalStepType | null;
  }>({
    isOpen: false,
    type: null,
  });

  const handleEdit = (type: ApprovalStepType) => {
    setSelectedType(type);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedType(null);
    setIsDialogOpen(true);
  };

  const handleDelete = (type: ApprovalStepType) => {
    setConfirmModal({
      isOpen: true,
      type,
    });
  };

  const onConfirmDelete = async () => {
    if (!confirmModal.type) return;
    await deleteStepType(confirmModal.type.id);
    mutate();
    setConfirmModal({ isOpen: false, type: null });
  };

  const columns = React.useMemo(
    () => createColumns(handleEdit, handleDelete),
    []
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tipe Tahapan"
        description="Kelola tipe tahapan persetujuan yang tersedia di sistem."
      >
        <Button className="gap-2" onClick={handleCreate}>
          <HugeiconsIcon icon={Add01Icon} className="h-4 w-4" /> Buat Tipe Baru
        </Button>
      </PageHeader>

      <div className="flex items-center gap-4">
        <InputGroup className="flex-1 max-w-sm bg-background">
          <InputGroupAddon>
            <HugeiconsIcon icon={Search01Icon} className="text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Cari tipe tahapan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <HugeiconsIcon icon={Loading03Icon} className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Memuat tipe tahapan...</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={stepTypes}
        />
      )}

      <StepTypeFormDialog
        type={selectedType}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedType(null);
        }}
        onSuccess={() => mutate()}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: null })}
        onConfirm={onConfirmDelete}
        title="Hapus Tipe Tahapan"
        description={`Apakah Anda yakin ingin menghapus tipe tahapan "${confirmModal.type?.name}"? Tindakan ini tidak dapat dibatalkan.`}
      />
    </div>
  );
}
