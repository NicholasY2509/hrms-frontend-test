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
import { useUserList } from '@/modules/user/hooks/use-user';
import { useDeleteUser } from '@/modules/user/hooks/use-user-mutation';
import { getUserColumns } from '../columns';
import { UserModel } from '@/modules/user/types';
import { UserFormDialog } from '@/modules/user/components/user-form-dialog';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { FilterCard, FilterGrid } from '@/components/layout/filter-card';

export function UserManagementClient() {
  // Filters State
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState('15');

  // Modal State
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<UserModel | null>(null);
  const [confirmModal, setConfirmModal] = React.useState<{
    isOpen: boolean;
    user: UserModel | null;
  }>({
    isOpen: false,
    user: null,
  });

  const debouncedSearch = useDebounce(search, 500);

  // Fetch Users
  const { items, meta, isLoading, mutate } = useUserList({
    search: debouncedSearch,
    page,
    per_page: Number(perPage),
  });

  const { deleteUser } = useDeleteUser();

  const handleAdd = () => {
    setSelectedUser(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (user: UserModel) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleDelete = (user: UserModel) => {
    setConfirmModal({
      isOpen: true,
      user,
    });
  };

  const onConfirmDelete = async () => {
    if (!confirmModal.user) return;
    await deleteUser(confirmModal.user.id);
    mutate();
  };

  const handleResetFilters = () => {
    setSearch('');
    setPage(1);
  };

  const columns = React.useMemo(
    () => getUserColumns(handleEdit, handleDelete),
    []
  );

  const hasActiveFilters = search !== '';

  return (
    <div className="space-y-6 w-full min-w-0">
      <PageHeader
        title="Manajemen Pengguna"
        description="Kelola akun pengguna dan akses sistem."
      >
        <Button className="gap-2" variant="default" onClick={handleAdd}>
          <HugeiconsIcon icon={Add01Icon} className="h-4 w-4" /> Tambah Pengguna
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
              placeholder="Cari email atau nama..."
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

      <UserFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        user={selectedUser}
        onSuccess={() => mutate()}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, user: null })}
        onConfirm={onConfirmDelete}
        title="Hapus Pengguna"
        description={`Apakah Anda yakin ingin menghapus pengguna "${confirmModal.user?.email}"? Tindakan ini tidak dapat dibatalkan.`}
      />
    </div>
  );
}
