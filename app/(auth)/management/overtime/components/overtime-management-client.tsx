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
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { FilterCard, FilterGrid } from '@/components/layout/filter-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DepartmentPicker } from '@/modules/organization/department/components/department-picker';
import { DatePicker } from '@/components/ui/date-picker';
import { format, parse } from 'date-fns';
import { OvertimeExportDialog } from '@/modules/overtime/components/overtime-export-dialog';
import { Button } from '@/components/ui/button';

export function OvertimeManagementClient() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const getParam = (key: string, defaultValue: string = '') => searchParams.get(key) || defaultValue;

    // Filters State
    const [search, setSearch] = React.useState(getParam('search'));
    const [page, setPage] = React.useState(Number(getParam('page', '1')));
    const [perPage, setPerPage] = React.useState(getParam('per_page', '15'));
    const [departmentId, setDepartmentId] = React.useState<number | null>(searchParams.get('department_id') ? Number(searchParams.get('department_id')) : null);
    const [type, setType] = React.useState<string>(getParam('type', 'all'));
    const [isSettled, setIsSettled] = React.useState<string>(getParam('is_settled', 'all'));

    const [startDate, setStartDate] = React.useState<Date | undefined>(() => {
        const start = searchParams.get('start_date');
        return start ? parse(start, 'yyyy-MM-dd', new Date()) : undefined;
    });
    const [endDate, setEndDate] = React.useState<Date | undefined>(() => {
        const end = searchParams.get('end_date');
        return end ? parse(end, 'yyyy-MM-dd', new Date()) : undefined;
    });

    const [isExportDialogOpen, setIsExportDialogOpen] = React.useState(false);

    const debouncedSearch = useDebounce(search, 500);

    const updateQuery = React.useCallback((updates: Record<string, string | number | null | undefined>) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === undefined || value === '' || value === 'all') {
                params.delete(key);
            } else {
                params.set(key, String(value));
            }
        });

        if (!updates.hasOwnProperty('page')) {
            params.set('page', '1');
            setPage(1);
        }

        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, [pathname, router, searchParams]);

    // Update URL when debounced search changes
    React.useEffect(() => {
        if (debouncedSearch !== getParam('search')) {
            updateQuery({ search: debouncedSearch });
        }
    }, [debouncedSearch, updateQuery]);

    const activeFilters = React.useMemo(() => ({
        search: debouncedSearch,
        department_id: departmentId || undefined,
        type: type === 'all' ? undefined : type,
        is_settled: isSettled === 'all' ? undefined : isSettled,
        start_date: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
        end_date: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
    }), [debouncedSearch, departmentId, type, isSettled, startDate, endDate]);

    const { items, meta, isLoading } = useOvertimeManagementList({
        ...activeFilters,
        page,
        per_page: Number(perPage),
    });

    const handleView = (item: Overtime) => {
        router.push(`/management/overtime/${item.id}`);
    };

    const handleResetFilters = () => {
        setSearch('');
        setPage(1);
        setDepartmentId(null);
        setType('all');
        setIsSettled('all');
        setStartDate(undefined);
        setEndDate(undefined);
        router.replace(pathname, { scroll: false });
    };

    const columns = React.useMemo(() => getOvertimeColumns(handleView), []);

    const hasActiveFilters = search !== '' || departmentId !== null || type !== 'all' || isSettled !== 'all' || startDate !== undefined || endDate !== undefined;

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

            <FilterCard
                onReset={handleResetFilters}
                hasActiveFilters={hasActiveFilters}
                perPage={perPage}
                onPerPageChange={(v) => {
                    setPerPage(v);
                    updateQuery({ per_page: v });
                }}
            >
                <FilterGrid cols={4}>
                    <InputGroup className="bg-background">
                        <InputGroupAddon>
                            <HugeiconsIcon icon={Search01Icon} className="text-muted-foreground" size={14} />
                        </InputGroupAddon>
                        <InputGroupInput
                            placeholder="Cari nama karyawan..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </InputGroup>

                    <DepartmentPicker
                        value={departmentId}
                        onChange={(v) => {
                            setDepartmentId(v);
                            updateQuery({ department_id: v });
                        }}
                        placeholder="Semua Departemen"
                    />

                    <Select value={type} onValueChange={(v) => {
                        setType(v);
                        updateQuery({ type: v });
                    }}>
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

                    <Select value={isSettled} onValueChange={(v) => {
                        setIsSettled(v);
                        updateQuery({ is_settled: v });
                    }}>
                        <SelectTrigger className="h-9 bg-background">
                            <SelectValue placeholder="Semua Status Settle" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status Settle</SelectItem>
                            <SelectItem value="1">Settled</SelectItem>
                            <SelectItem value="0">Unsettled</SelectItem>
                        </SelectContent>
                    </Select>

                    <DatePicker
                        value={startDate}
                        onChange={(date) => {
                            setStartDate(date);
                            updateQuery({ start_date: date ? format(date, 'yyyy-MM-dd') : undefined });
                        }}
                        placeholder="Tanggal Mulai"
                    />

                    <DatePicker
                        value={endDate}
                        onChange={(date) => {
                            setEndDate(date);
                            updateQuery({ end_date: date ? format(date, 'yyyy-MM-dd') : undefined });
                        }}
                        placeholder="Tanggal Selesai"
                    />
                </FilterGrid>
            </FilterCard>

            <DataTable
                columns={columns}
                data={items}
                isLoading={isLoading}
                pagination={
                    meta
                        ? {
                            ...meta,
                            onPageChange: (p) => {
                                setPage(p);
                                updateQuery({ page: p });
                            },
                        }
                        : undefined
                }
            />
        </div>
    );
}
