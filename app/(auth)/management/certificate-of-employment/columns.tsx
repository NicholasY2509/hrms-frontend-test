import { ColumnDef } from '@tanstack/react-table';
import { CertificateOfEmploymentModel } from '@/modules/employee/certificate-of-employment/types';
import { Badge } from '@/components/ui/badge';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ProfileIcon,
  Calendar01Icon,
  AttachmentIcon,
  DocumentValidationIcon,
  Briefcase01Icon
} from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

export const getCertificateColumns = (
  onView: (item: CertificateOfEmploymentModel) => void
): ColumnDef<CertificateOfEmploymentModel>[] => [
    {
      accessorKey: 'document_no',
      header: 'No. Dokumen',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={DocumentValidationIcon} size={14} className="text-muted-foreground" />
          <span className="text-sm font-medium">{row.original.document_no || '-'}</span>
        </div>
      ),
    },
    {
      accessorKey: 'employee',
      header: 'Karyawan',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold text-sm leading-none">{row.original.employee.name}</span>
          <span className="text-xs text-muted-foreground mt-1">NIK: {row.original.employee.nik}</span>
        </div>
      ),
    },
    {
      accessorKey: 'work_position',
      header: 'Jabatan',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <HugeiconsIcon icon={Briefcase01Icon} size={14} className="text-muted-foreground" />
          <span className="text-xs">{row.original.work_position?.name || '-'}</span>
        </div>
      ),
    },
    {
      accessorKey: 'request_date',
      header: 'Tgl Pengajuan',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={Calendar01Icon} size={14} className="text-muted-foreground" />
          <span className="text-sm">
            {row.original.request_date ? format(new Date(row.original.request_date), 'dd MMM yyyy', { locale: localeId }) : '-'}
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
            Unduh
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
