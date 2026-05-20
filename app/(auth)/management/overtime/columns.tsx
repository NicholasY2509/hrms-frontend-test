'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { ProfileIcon } from '@hugeicons/core-free-icons';
import { Overtime } from '@/modules/overtime/types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export const getOvertimeColumns = (onView: (item: Overtime) => void): ColumnDef<Overtime>[] => [
    {
        accessorKey: 'document_no',
        header: 'Nomor Pengajuan',
        cell: ({ row }) => <span className="font-medium">{row.original.document_no}</span>,
    },
    {
        accessorKey: 'employee.full_name',
        header: 'Karyawan',
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-medium">{row.original.employee.name}</span>
                <span className="text-xs text-muted-foreground">NIK: {row.original.employee.nik}</span>
            </div>
        ),
    },
    {
        accessorKey: 'employee.position.name',
        header: 'Jabatan',
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-medium">{row.original.employee.position?.name || '-'}</span>
                <span className="text-xs text-muted-foreground">{row.original.employee.department?.name || '-'}</span>
            </div>
        ),
    },
    {
        accessorKey: 'type.name',
        header: 'Tipe Lembur',
        cell: ({ row }) => {
            const type = row.original.type;
            const dacType = row.original.dac_type;

            if (dacType) {
                return <span className="font-medium">DAC ({dacType})</span>;
            }
            return <span className="font-medium">{type}</span>;
        }
    },
    {
        accessorKey: 'date',
        header: 'Tanggal',
        cell: ({ row }) => format(new Date(row.original.date), 'dd MMM yyyy', { locale: id }),
    },
    {
        accessorKey: 'total_time',
        header: 'Durasi',
        cell: ({ row }) => (
            <div className='flex flex-col'>
                <span className="font-medium">{row.original.total_time} Jam</span>
                <span className='text-xs text-muted-foreground'>{format(new Date(row.original.start_time), 'HH:mm')} s/d {format(new Date(row.original.finish_time), 'HH:mm')}</span>
            </div>
        )
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.original.status.toLowerCase();
            if (status.includes('approved') || status.includes('disetujui')) return <Badge variant="success">{row.original.status}</Badge>;
            if (status.includes('rejected') || status.includes('ditolak')) return <Badge variant="destructive">{row.original.status}</Badge>;
            if (status.includes('pending') || status.includes('menunggu')) return <Badge variant="warning" className="whitespace-nowrap">{row.original.status}</Badge>;
            if (status.includes('settled') || status.includes('selesai')) return <Badge variant="default">{row.original.status}</Badge>;
            return <Badge variant="secondary">{row.original.status}</Badge>;
        },
    },
    {
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => (
            <Button
                variant="ghost"
                size="icon"
                onClick={() => onView(row.original)}
                className="hover:bg-primary/10 hover:text-primary transition-colors"
            >
                <HugeiconsIcon icon={ProfileIcon} size={18} />
            </Button>
        ),
    },
];
