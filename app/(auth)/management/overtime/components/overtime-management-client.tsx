'use client';

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon, PrinterIcon } from '@hugeicons/core-free-icons';
import { DataTable } from '@/components/data-table/data-table';
import { PageHeader } from '@/components/layout/page-header';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { useDebounce } from '@/hooks/use-debounce';
import { useOvertimeManagementList } from '@/modules/overtime/hooks/use-overtime';
import { getOvertimeColumns } from '../columns';
import { Overtime } from '@/modules/overtime/types';
import { useRouter, usePathname } from 'next/navigation';
import { ManagementFilter } from '@/components/layout/management-filter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUrlFilters } from '@/hooks/use-url-filters';
import { DepartmentPicker } from '@/modules/organization/department/components/department-picker';
import { DatePicker } from '@/components/ui/date-picker';
import { format, parse } from 'date-fns';
import { OvertimeExportDialog } from '@/modules/overtime/components/overtime-export-dialog';
import { Button } from '@/components/ui/button';

export function OvertimeManagementClient() {
    const router = useRouter();
    const pathname = usePathname();
    const { filters, setFilter, resetFilters, hasActiveFilters } = useUrlFilters({
        page: 1,
        per_page: 15,
        search: '',
        department_id: null as number | null,
        type: 'all',
        is_settled: 'all',
        start_date: undefined as string | undefined,
        end_date: undefined as string | undefined,
    });

    const [isExportDialogOpen, setIsExportDialogOpen] = React.useState(false);

    const debouncedSearch = useDebounce(filters.search, 500);

    const activeFilters = React.useMemo(() => ({
        search: debouncedSearch,
        department_id: filters.department_id ? Number(filters.department_id) : undefined,
        type: filters.type === 'all' ? undefined : filters.type,
        is_settled: filters.is_settled === 'all' ? undefined : filters.is_settled,
        start_date: filters.start_date,
        end_date: filters.end_date,
    }), [debouncedSearch, filters]);

    const { items, meta, isLoading } = useOvertimeManagementList({
        ...activeFilters,
        page: filters.page,
        per_page: Number(filters.per_page),
    });

    const handleView = (item: Overtime) => {
        router.push(`/management/overtime/${item.id}`);
    };

    const columns = React.useMemo(() => getOvertimeColumns(handleView), []);

    return (
        <div className="space-y-6">
            <PageHeader
                title="Manajemen Lembur"
                description="Tinjau dan kelola permohonan lembur karyawan."
            >
                <Button
                    onClick={() => setIsExportDialogOpen(true)}
                >
                    <HugeiconsIcon icon={PrinterIcon} size={18} />
                    Cetak Laporan
                </Button>
            </PageHeader>

            <OvertimeExportDialog
                isOpen={isExportDialogOpen}
                onClose={() => setIsExportDialogOpen(false)}
            />

            <ManagementFilter
                onReset={resetFilters}
                hasActiveFilters={hasActiveFilters}
                perPage={String(filters.per_page)}
                onPerPageChange={(v) => setFilter('per_page', v)}
                search={{
                    value: filters.search,
                    onChange: (v) => setFilter('search', v),
                    placeholder: "Cari nama karyawan..."
                }}
                department={{
                    value: filters.department_id ? Number(filters.department_id) : null,
                    onChange: (v) => setFilter('department_id', v),
                    placeholder: "Semua Departemen"
                }}
                startDate={{
                    value: filters.start_date ? new Date(filters.start_date) : undefined,
                    onChange: (date) => setFilter('start_date', date ? format(date, 'yyyy-MM-dd') : undefined),
                    placeholder: "Tanggal Mulai"
                }}
                endDate={{
                    value: filters.end_date ? new Date(filters.end_date) : undefined,
                    onChange: (date) => setFilter('end_date', date ? format(date, 'yyyy-MM-dd') : undefined),
                    placeholder: "Tanggal Selesai"
                }}
            >
                <Select value={String(filters.type)} onValueChange={(v) => setFilter('type', v)}>
                    <SelectTrigger className="h-9 bg-background">
                        <SelectValue placeholder="Semua Tipe Lembur" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Tipe Lembur</SelectItem>
                        <SelectItem value="UMUM">UMUM</SelectItem>
                        <SelectItem value="DAC">DAC</SelectItem>
                        <SelectItem value="NATIONAL">NATIONAL</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={String(filters.is_settled)} onValueChange={(v) => setFilter('is_settled', v)}>
                    <SelectTrigger className="h-9 bg-background">
                        <SelectValue placeholder="Semua Status Settle" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Status Settle</SelectItem>
                        <SelectItem value="1">Settled</SelectItem>
                        <SelectItem value="0">Unsettled</SelectItem>
                    </SelectContent>
                </Select>
            </ManagementFilter>

            <DataTable
                columns={columns}
                data={items}
                isLoading={isLoading}
                pagination={
                    meta
                        ? {
                            ...meta,
                            onPageChange: (p) => setFilter('page', p),
                        }
                        : undefined
                }
            />
        </div>
    );
}
