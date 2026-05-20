'use client';

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon, Search01Icon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { DataTable } from '@/components/data-table/data-table';
import { PageHeader } from '@/components/layout/page-header';
import { getTeamColumns } from '../columns';
import { useTeams } from '@/modules/organization/teams/hooks/use-teams';
import { useDeleteTeam } from '@/modules/organization/teams/hooks/use-team-mutation';
import { useDebounce } from '@/hooks/use-debounce';
import { Team } from '@/modules/organization/teams/types';
import { TeamFormDialog } from '@/modules/organization/teams/components/team-form-dialog';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { useCallback, useState } from 'react';

export function TeamManagementClient() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = React.useState<Team | null>(null);
  const [confirmModal, setConfirmModal] = React.useState<{
    isOpen: boolean;
    team: Team | null;
  }>({
    isOpen: false,
    team: null,
  });
  const debouncedSearch = useDebounce(search, 500);

  const { items: teams, meta, isLoading } = useTeams({
    params: {
      search: debouncedSearch,
      page
    }
  });

  const { deleteTeam } = useDeleteTeam();

  const handleAdd = useCallback(() => {
    setSelectedTeam(null);
    setIsDialogOpen(true);
  }, []);

  const handleEdit = useCallback((team: Team) => {
    setSelectedTeam(team);
    setIsDialogOpen(true);
  }, []);

  const handleDelete = useCallback((team: Team) => {
    setConfirmModal({
      isOpen: true,
      team,
    });
  }, []);

  const onConfirmDelete = async () => {
    if (!confirmModal.team) return;
    await deleteTeam(confirmModal.team.id);
    setConfirmModal({ isOpen: false, team: null });
  };

  const handleSuccess = React.useCallback(() => {
    setIsDialogOpen(false);
    setSelectedTeam(null);
  }, []);

  const columns = React.useMemo(
    () => getTeamColumns(handleEdit, handleDelete),
    [handleEdit, handleDelete]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tim"
        description="Kelola tim organisasi dan kepalanya."
      >
        <Button className="gap-2" variant="default" onClick={handleAdd}>
          <HugeiconsIcon icon={Add01Icon} className="h-4 w-4" /> Tambah Tim
        </Button>
      </PageHeader>

      <div className="flex items-center gap-4">
        <InputGroup className="flex-1 max-w-sm bg-background">
          <InputGroupAddon>
            <HugeiconsIcon icon={Search01Icon} className="text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Cari tim..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
      </div>

      <DataTable
        columns={columns}
        data={teams}
        isLoading={isLoading && (teams?.length ?? 0) === 0}
        pagination={
          meta
            ? {
              ...meta,
              onPageChange: (p) => setPage(p),
            }
            : undefined
        }
      />

      <TeamFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        team={selectedTeam}
        onSuccess={handleSuccess}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, team: null })}
        onConfirm={onConfirmDelete}
        title="Hapus Tim"
        description={`Apakah Anda yakin ingin menghapus tim "${confirmModal.team?.name}"? Tindakan ini tidak dapat dibatalkan.`}
      />
    </div>
  );
}
