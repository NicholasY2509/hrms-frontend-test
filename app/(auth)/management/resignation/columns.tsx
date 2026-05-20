import { ColumnDef } from '@tanstack/react-table';
import { ResignationModel } from '@/modules/employee/resignation/types';
import { Badge } from '@/components/ui/badge';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ProfileIcon,
  Calendar01Icon,
  AttachmentIcon,
  UserIcon,
  NoteIcon
} from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

export const getResignationColumns = (
  onView: (item: ResignationModel) => void
): ColumnDef<ResignationModel>[] => [
    {
      accessorKey: 'employee',
      header: 'Karyawan',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold text-sm leading-none">{row.original.employee.name}</span>
          <div className="flex items-center gap-1 mt-1 text-muted-foreground">
            <HugeiconsIcon icon={UserIcon} size={12} />
            <span className="text-xs">NIK: {row.original.employee.nik}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'effective_date',
      header: 'Tgl Efektif',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={Calendar01Icon} size={14} className="text-muted-foreground" />
          <span className="text-sm">
            {row.original.effective_date ? format(new Date(row.original.effective_date), 'dd MMM yyyy', { locale: localeId }) : '-'}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'reason',
      header: 'Alasan Resign',
      cell: ({ row }) => (
        <div className="flex items-start gap-2 max-w-[300px]">
          <HugeiconsIcon icon={NoteIcon} size={14} className="text-muted-foreground mt-0.5 shrink-0" />
          <span className="text-xs line-clamp-2" title={row.original.reason}>
            {row.original.reason || '-'}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status?.toLowerCase();
        if (status?.includes('approved') || status?.includes('disetujui')) return <Badge variant="success">{row.original.status}</Badge>;
        if (status?.includes('rejected') || status?.includes('ditolak')) return <Badge variant="destructive">{row.original.status}</Badge>;
        if (status?.includes('pending') || status?.includes('menunggu')) return <Badge variant="warning" className="whitespace-nowrap">{row.original.status}</Badge>;
        if (status?.includes('settled') || status?.includes('selesai')) return <Badge variant="default">{row.original.status}</Badge>;
        return <Badge variant="secondary">{row.original.status}</Badge>;
      },
    },
    {
      accessorKey: 'attachment',
      header: 'Lampiran',
      cell: ({ row }) => (
        row.original.attachment_url ? (
          <a
            href={row.original.attachment_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-primary hover:underline"
          >
            <HugeiconsIcon icon={AttachmentIcon} size={14} />
            Berkas
          </a>
        ) : (
          <span className="text-xs text-muted-foreground">-</span>
        )
      ),
    },
    {
      id: 'actions',
      header: 'Aksi',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
            onClick={() => onView(row.original)}
          >
            <HugeiconsIcon icon={ProfileIcon} className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];
