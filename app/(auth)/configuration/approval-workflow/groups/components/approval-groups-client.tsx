'use client';

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon, Search01Icon, Loading03Icon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { DataTable } from '@/components/data-table/data-table';
import { PageHeader } from '@/components/layout/page-header';
import { createColumns } from '../columns';
import { useApprovalGroups } from '@/modules/approval-workflow/groups/hooks/use-approval-groups';
import { useDeleteApprovalGroup } from '@/modules/approval-workflow/groups/hooks/use-approval-group-mutation';
import { MemberManagementDialog } from '@/modules/approval-workflow/groups/components/member-management-dialog';
import { GroupFormDialog } from '@/modules/approval-workflow/groups/components/group-form-dialog';
import { ApprovalGroup } from '@/modules/approval-workflow/groups/types';
import { useDebounce } from '@/hooks/use-debounce';
import { ConfirmModal } from '@/components/ui/confirm-modal';

export function ApprovalGroupsClient() {
  const { deleteGroup } = useDeleteApprovalGroup();
  const [search, setSearch] = React.useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = React.useState(1);

  const { items: groups, meta, isLoading, mutate } = useApprovalGroups({
    search: debouncedSearch,
    page
  });

  const [selectedGroup, setSelectedGroup] = React.useState<ApprovalGroup | null>(null);
  const [isMemberDialogOpen, setIsMemberDialogOpen] = React.useState(false);

  const [editingGroup, setEditingGroup] = React.useState<ApprovalGroup | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [confirmModal, setConfirmModal] = React.useState<{
    isOpen: boolean;
    group: ApprovalGroup | null;
  }>({
    isOpen: false,
    group: null,
  });

  const handleCreateGroup = () => {
    setEditingGroup(null);
    setIsFormOpen(true);
  };

  const handleEditGroup = (group: ApprovalGroup) => {
    setEditingGroup(group);
    setIsFormOpen(true);
  };

  const handleManageMembers = (group: ApprovalGroup) => {
    setSelectedGroup(group);
    setIsMemberDialogOpen(true);
  };

  const handleDeleteGroup = (group: ApprovalGroup) => {
    setConfirmModal({
      isOpen: true,
      group,
    });
  };

  const onConfirmDelete = async () => {
    if (!confirmModal.group) return;
    try {
      await deleteGroup(confirmModal.group.id);
      mutate();
      setConfirmModal({ isOpen: false, group: null });
    } catch (error) { }
  };


  const columns = React.useMemo(
    () => createColumns(handleManageMembers, handleEditGroup, handleDeleteGroup),
    []
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Grup Persetujuan"
        description="Kelola kumpulan pengguna yang dapat menyetujui permintaan secara kolektif."
      >
        <Button className="gap-2" onClick={handleCreateGroup}>
          <HugeiconsIcon icon={Add01Icon} className="h-4 w-4" /> Buat Grup Baru
        </Button>
      </PageHeader>

      <div className="flex items-center gap-4">
        <InputGroup className="flex-1 max-w-sm bg-background">
          <InputGroupAddon>
            <HugeiconsIcon icon={Search01Icon} className="text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Cari grup..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <HugeiconsIcon icon={Loading03Icon} className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Memuat grup...</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={groups}
        />
      )}

      <MemberManagementDialog
        group={selectedGroup}
        isOpen={isMemberDialogOpen}
        onClose={() => {
          setIsMemberDialogOpen(false);
          setSelectedGroup(null);
        }}
        onSuccess={() => mutate()}
      />

      <GroupFormDialog
        group={editingGroup}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingGroup(null);
        }}
        onSuccess={() => mutate()}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, group: null })}
        onConfirm={onConfirmDelete}
        title="Hapus Grup Persetujuan"
        description={`Apakah Anda yakin ingin menghapus grup "${confirmModal.group?.name}"? Tindakan ini tidak dapat dibatalkan.`}
      />
    </div>
  );
}
