'use client';

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon, Search01Icon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { DataTable } from '@/components/data-table/data-table';
import { PageHeader } from '@/components/layout/page-header';
import { getWorkPositionColumns } from '../columns';
import { useWorkPositions } from '@/modules/organization/work-position/hooks/use-work-positions';
import { useDebounce } from '@/hooks/use-debounce';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { WorkPosition } from '@/modules/organization/work-position/types';
import { toast } from 'sonner';

export function WorkPositionManagementClient() {
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [confirmModal, setConfirmModal] = React.useState<{
    isOpen: boolean;
    position: WorkPosition | null;
  }>({
    isOpen: false,
    position: null,
  });
  const debouncedSearch = useDebounce(search, 500);

  const { items: positions, meta, isLoading } = useWorkPositions({
    params: {
      search: debouncedSearch,
      page,
    }
  });

  const handleAdd = () => {
    toast.info('Fitur tambah posisi kerja segera hadir');
  };

  const handleEdit = (position: WorkPosition) => {
    toast.info(`Edit posisi: ${position.name}`);
  };

  const handleDelete = (position: WorkPosition) => {
    setConfirmModal({
      isOpen: true,
      position,
    });
  };

  const onConfirmDelete = async () => {
    toast.error('Fitur hapus belum tersedia');
  };

  const columns = React.useMemo(
    () => getWorkPositionColumns(handleEdit, handleDelete),
    []
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Posisi Kerja"
        description="Kelola daftar posisi kerja, tunjangan, dan lokasi penempatan."
      >
        <Button className="gap-2" variant="default" onClick={handleAdd}>
          <HugeiconsIcon icon={Add01Icon} className="h-4 w-4" /> Tambah Posisi
        </Button>
      </PageHeader>

      <div className="flex items-center gap-4">
        <InputGroup className="flex-1 max-w-sm bg-background">
          <InputGroupAddon>
            <HugeiconsIcon icon={Search01Icon} className="text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Cari posisi kerja..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // Reset to first page on search
            }}
          />
        </InputGroup>
      </div>

      <DataTable
        columns={columns}
        data={positions}
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
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, position: null })}
        onConfirm={onConfirmDelete}
        title="Hapus Posisi Kerja"
        description={`Apakah Anda yakin ingin menghapus posisi "${confirmModal.position?.name}"? Tindakan ini tidak dapat dibatalkan.`}
      />
    </div>
  );
}
