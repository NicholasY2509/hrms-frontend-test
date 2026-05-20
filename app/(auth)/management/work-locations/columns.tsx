'use client';

import { ColumnDef } from '@tanstack/react-table';
import { HugeiconsIcon } from '@hugeicons/react';
import { PencilEdit01Icon, Delete02Icon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { WorkLocation } from '@/modules/organization/work-location/types';

export const getWorkLocationColumns = (
  onEdit: (location: WorkLocation) => void,
  onDelete: (location: WorkLocation) => void
): ColumnDef<WorkLocation>[] => [
    {
      accessorKey: 'name',
      header: 'Nama Lokasi',
    },
    {
      id: 'actions',
      header: 'Aksi',
      cell: ({ row }) => {
        const location = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(location)}
            >
              <HugeiconsIcon icon={PencilEdit01Icon} className="h-4 w-4" />
            </Button>
            <Button
              variant={'ghost'}
              size="icon"
              onClick={() => onDelete(location)}
            >
              <HugeiconsIcon icon={Delete02Icon} className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];
