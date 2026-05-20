'use client';

import { ColumnDef } from '@tanstack/react-table';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  MoreHorizontalIcon,
  Delete02Icon,
  PencilEdit01Icon,
  Tick01Icon,
  Cancel01Icon
} from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ApprovalStepType } from '@/modules/approval-workflow/step-types/types';
import { Badge } from '@/components/ui/badge';

export const createColumns = (
  onEdit: (type: ApprovalStepType) => void,
  onDelete: (type: ApprovalStepType) => void
): ColumnDef<ApprovalStepType>[] => [
    {
      accessorKey: 'name',
      header: 'Nama',
      cell: ({ row }) => (
        <div className="font-medium text-primary">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'slug',
      header: 'Slug',
      cell: ({ row }) => (
        <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
          {row.getValue('slug')}
        </code>
      ),
    },
    {
      accessorKey: 'needs_target',
      header: 'Butuh Target',
      cell: ({ row }) => {
        const needsTarget = row.getValue('needs_target') as boolean;
        return (
          <Badge variant={needsTarget ? 'default' : 'secondary'} className="gap-1">
            {needsTarget ? (
              <>
                <HugeiconsIcon icon={Tick01Icon} className="h-3 w-3" />
                Ya
              </>
            ) : (
              <>
                <HugeiconsIcon icon={Cancel01Icon} className="h-3 w-3" />
                Tidak
              </>
            )}
          </Badge>
        );
      },
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
      id: 'actions',
      cell: ({ row }) => {
        const type = row.original;

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
              <DropdownMenuItem onClick={() => onEdit(type)}>
                <HugeiconsIcon icon={PencilEdit01Icon} className="mr-2 h-4 w-4" />
                Ubah Tipe
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(type)}
              >
                <HugeiconsIcon icon={Delete02Icon} className="mr-2 h-4 w-4" />
                Hapus Tipe
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
