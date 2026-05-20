'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Settings02Icon,
  PencilEdit01Icon,
  Delete02Icon,
  HierarchyIcon,
  More01Icon,
  ArrowRight01Icon
} from '@hugeicons/core-free-icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const getSchemeColumns = (
  onEdit: (scheme: any) => void,
  onManageRules: (scheme: any) => void,
  onDelete: (scheme: any) => void
): ColumnDef<any>[] => [
    {
      accessorKey: 'name',
      header: 'Kategori Pengajuan',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold text-primary">{row.getValue('name')}</span>
          <span className="text-xs text-muted-foreground font-mono">{row.original.model_class}</span>
        </div>
      ),
    },
    {
      accessorKey: 'rules_count',
      header: 'Konfigurasi Alur',
      cell: ({ row }) => {
        const posCount = row.original.position_rules_count || 0;
        const deptCount = row.original.department_rules_count || 0;
        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline" className="bg-primary/5">Default</Badge>
              <span className="text-muted-foreground text-xs">Aktif</span>
            </div>
            {(posCount > 0 || deptCount > 0) && (
              <div className="flex flex-col gap-0.5">
                {posCount > 0 && (
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <HugeiconsIcon icon={HierarchyIcon} className="h-2.5 w-2.5" />
                    {posCount} Jabatan
                  </div>
                )}
                {deptCount > 0 && (
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <HugeiconsIcon icon={HierarchyIcon} className="h-2.5 w-2.5" />
                    {deptCount} Departemen
                  </div>
                )}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ row }) => (
        row.original.is_active ? (
          <Badge variant="success">Aktif</Badge>
        ) : (
          <Badge variant="secondary">Nonaktif</Badge>
        )
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const scheme = row.original;

        return (
          <div className="flex items-center justify-end gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <HugeiconsIcon icon={More01Icon} className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuLabel>Aksi Kategori</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onManageRules(scheme)} className="gap-2">
                  <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4" />
                  Atur Alur
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(scheme)} className="gap-2">
                  <HugeiconsIcon icon={PencilEdit01Icon} className="h-4 w-4" />
                  Ubah Kategori
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(scheme)}
                  className="gap-2 text-destructive focus:text-destructive"
                >
                  <HugeiconsIcon icon={Delete02Icon} className="h-4 w-4" />
                  Hapus
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
