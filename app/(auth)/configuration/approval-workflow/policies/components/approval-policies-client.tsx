'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon, Search01Icon, Loading03Icon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { DataTable } from '@/components/data-table/data-table';
import { PageHeader } from '@/components/layout/page-header';
import { useApprovalSchemes } from '@/modules/approval-workflow/schemes/hooks/use-schemes';
import { useDeleteScheme } from '@/modules/approval-workflow/schemes/hooks/use-schemes-mutation';
import { useDebounce } from '@/hooks/use-debounce';
import { toast } from 'sonner';
import { SchemeFormDialog } from '@/modules/approval-workflow/schemes/components/scheme-form-dialog';
import { getSchemeColumns } from '../columns';
import { ConfirmModal } from '@/components/ui/confirm-modal';

export function ApprovalPoliciesClient() {
  const router = useRouter();
  const { deleteScheme } = useDeleteScheme();
  const [search, setSearch] = React.useState('');
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [confirmModal, setConfirmModal] = React.useState<{
    isOpen: boolean;
    scheme: any | null;
  }>({
    isOpen: false,
    scheme: null,
  });
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = React.useState(1);

  const { items: schemes, meta, isLoading, mutate } = useApprovalSchemes({
    search: debouncedSearch,
    page
  });

  const handleManageRules = (scheme: any) => {
    router.push(`/configuration/approval-workflow/policies/${scheme.id}`);
  };

  const handleEditScheme = (scheme: any) => {
    toast.info('Fitur ubah kategori akan segera hadir');
  };

  const handleDeleteScheme = (scheme: any) => {
    setConfirmModal({
      isOpen: true,
      scheme,
    });
  };

  const onConfirmDelete = async () => {
    if (!confirmModal.scheme) return;
    try {
      await deleteScheme(confirmModal.scheme.id);
      mutate();
      setConfirmModal({ isOpen: false, scheme: null });
    } catch (error) { }

  };

  const columns = React.useMemo(
    () => getSchemeColumns(handleEditScheme, handleManageRules, handleDeleteScheme),
    []
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Konfigurasi Kebijakan"
        description="Pilih kategori pengajuan untuk mengatur alur persetujuan default dan khusus jabatan."
      >
        <Button className="gap-2" variant="outline" onClick={() => setIsDialogOpen(true)}>
          <HugeiconsIcon icon={Add01Icon} className="h-4 w-4" /> Tambah Kategori
        </Button>
      </PageHeader>

      <div className="flex items-center gap-4">
        <InputGroup className="flex-1 max-w-sm bg-background">
          <InputGroupAddon>
            <HugeiconsIcon icon={Search01Icon} className="text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Cari kategori (Cuti, Lembur, dll)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <HugeiconsIcon icon={Loading03Icon} className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Memuat kategori...</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={schemes}
          pagination={
            meta
              ? {
                ...meta,
                onPageChange: (p) => setPage(p),
              }
              : undefined
          }
        />
      )}

      <SchemeFormDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          mutate();
        }}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, scheme: null })}
        onConfirm={onConfirmDelete}
        title="Hapus Kategori Kebijakan"
        description={`Apakah Anda yakin ingin menghapus kategori "${confirmModal.scheme?.name}"? Semua aturan di dalamnya akan ikut terhapus. Tindakan ini tidak dapat dibatalkan.`}
      />
    </div>
  );
}
