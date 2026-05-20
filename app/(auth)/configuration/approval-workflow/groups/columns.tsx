'use client';

import { ColumnDef } from '@tanstack/react-table';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  MoreHorizontalIcon,
  UserGroupIcon,
  Delete02Icon,
  PencilEdit01Icon
} from '@hugeicons/core-free-icons';
import { useApprovalGroups } from '@/modules/approval-workflow/groups/hooks/use-approval-groups';
import { MemberManagementDialog } from '@/modules/approval-workflow/groups/components/member-management-dialog';
import { GroupFormDialog } from '@/modules/approval-workflow/groups/components/group-form-dialog';
import { GroupMembers } from '@/modules/approval-workflow/groups/components/group-members';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ApprovalGroup } from '@/modules/approval-workflow/groups/types';

export const createColumns = (
  onManageMembers: (group: ApprovalGroup) => void,
  onEdit: (group: ApprovalGroup) => void,
  onDelete: (group: ApprovalGroup) => void
): ColumnDef<ApprovalGroup>[] => [
    {
      accessorKey: 'name',
      header: 'Nama Grup',
      cell: ({ row }) => (
        <div className="font-medium text-primary">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Deskripsi',
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate text-muted-foreground">
          {row.getValue('description') || '-'}
        </div>
      ),
    },
    {
      accessorKey: 'members_count',
      header: 'Anggota',
      cell: ({ row }) => <GroupMembers group={row.original} />,
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const group = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Buka menu</span>
                <HugeiconsIcon icon={MoreHorizontalIcon} className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onManageMembers(group)}>
                <HugeiconsIcon icon={UserGroupIcon} className="mr-2 h-4 w-4" />
                Kelola Anggota
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(group)}>
                <HugeiconsIcon icon={PencilEdit01Icon} className="mr-2 h-4 w-4" />
                Ubah Grup
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(group)}
              >
                <HugeiconsIcon icon={Delete02Icon} className="mr-2 h-4 w-4" />
                Hapus Grup
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
