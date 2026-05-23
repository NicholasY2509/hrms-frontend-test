'use client';

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    Search01Icon,
    UserGroup02Icon,
    DoorIcon,
    UserIcon
} from '@hugeicons/core-free-icons';
import { DataTable } from '@/components/data-table/data-table';
import { PageHeader } from '@/components/layout/page-header';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { useDebounce } from '@/hooks/use-debounce';
import { useManagementEmployees } from '@/modules/employee/employee/hooks/use-employees';
import { DepartmentPicker } from '@/modules/organization/department/components/department-picker';
import { TeamPicker } from '@/modules/organization/teams/components/team-picker';
import { WorkLocationPicker } from '@/modules/organization/work-location/components/work-location-picker';
import { WorkPositionPicker } from '@/modules/organization/work-position/components/work-position-picker';
import { getEmployeeColumns } from '../columns';
import { Employee } from '@/modules/employee/employee/types';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ManagementFilter } from "@/components/layout/management-filter"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUrlFilters } from '@/hooks/use-url-filters';

import { ExportEmployeeDialog } from '@/modules/employee/employee/components/export-employee-dialog';
import { Button } from '@/components/ui/button';

export function EmployeeManagementClient() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { filters, setFilter, resetFilters, hasActiveFilters } = useUrlFilters({
        page: 1,
        per_page: 15,
        search: '',
        department_id: null as number | null,
        team_id: null as number | null,
        location_id: null as number | null,
        position_id: null as number | null,
        work_status_id: 'all',
        employee_status_id: 'all',
    });

    const debouncedSearch = useDebounce(filters.search, 500);

    const activeFilters = React.useMemo(() => ({
        search: debouncedSearch,
        department_id: filters.department_id ? Number(filters.department_id) : undefined,
        team_id: filters.team_id ? Number(filters.team_id) : undefined,
        work_location_id: filters.location_id ? Number(filters.location_id) : undefined,
        work_position_id: filters.position_id ? Number(filters.position_id) : undefined,
        work_employee_status_id: filters.work_status_id === 'all' ? undefined : filters.work_status_id,
        employee_status_id: filters.employee_status_id === 'all' ? undefined : filters.employee_status_id,
    }), [debouncedSearch, filters]);

    // Fetch Employees with all filters
    const { employees, summary, meta, isLoading } = useManagementEmployees({
        ...activeFilters,
        page: filters.page,
        per_page: Number(filters.per_page),
    });

    const handleView = (item: Employee) => {
        router.push(`/management/employees/${item.id}`);
    };

    const columns = React.useMemo(() => getEmployeeColumns(handleView), []);

    return (
        <div className="space-y-6 w-full min-w-0">
            <PageHeader
                title="Data Karyawan"
                description="Kelola dan pantau data profil seluruh karyawan."
            >
                <div className="flex items-center gap-2">
                    <ExportEmployeeDialog currentFilters={activeFilters} />
                    <Button onClick={() => router.push('/management/employees/create')}>
                        <HugeiconsIcon icon={UserIcon} className="w-4 h-4 mr-2" />
                        Tambah Karyawan
                    </Button>
                </div>
            </PageHeader>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-card border rounded-2xl p-5 flex items-center gap-5 animate-pulse">
                            <div className="h-12 w-12 rounded-xl bg-muted" />
                            <div className="space-y-2 flex-1">
                                <div className="h-3 w-20 bg-muted rounded" />
                                <div className="h-8 w-12 bg-muted rounded" />
                            </div>
                        </div>
                    ))
                ) : (
                    summary.map((item) => {
                        let icon = UserIcon;
                        let colorClass = "text-muted-foreground";
                        let bgClass = "bg-muted/10";

                        if (item.name.toLowerCase().includes('active')) {
                            icon = UserGroup02Icon;
                            colorClass = "text-white";
                            bgClass = "bg-primary";
                        } else if (item.name.toLowerCase().includes('resign')) {
                            icon = DoorIcon;
                            colorClass = "text-primary";
                            bgClass = "bg-primary/10";
                        } else if (item.name.toLowerCase().includes('nonaktif')) {
                            icon = UserIcon;
                            colorClass = "text-rose-600";
                            bgClass = "bg-rose-500/10";
                        }

                        return (
                            <div key={item.id} className="bg-card border rounded-lg p-5 flex items-center gap-5 transition-all hover:shadow-md">
                                <div className={`h-12 w-12 rounded-xl ${bgClass} flex items-center justify-center ${colorClass}`}>
                                    <HugeiconsIcon icon={icon} size={24} />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-sm text-muted-foreground font-medium">{item.name}</p>
                                    <p className="text-3xl font-bold tracking-tight">{item.count.toLocaleString()}</p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <ManagementFilter
                onReset={resetFilters}
                hasActiveFilters={hasActiveFilters}
                perPage={String(filters.per_page)}
                onPerPageChange={(v) => setFilter('per_page', v)}
                search={{
                    value: filters.search,
                    onChange: (v) => setFilter('search', v),
                    placeholder: "Cari nama atau NIK..."
                }}
                department={{
                    value: filters.department_id ? Number(filters.department_id) : null,
                    onChange: (v) => setFilter('department_id', v),
                    placeholder: "Semua Departemen"
                }}
                workPosition={{
                    value: filters.position_id ? Number(filters.position_id) : null,
                    onChange: (v) => setFilter('position_id', v),
                    placeholder: "Semua Jabatan"
                }}
                workLocation={{
                    value: filters.location_id ? Number(filters.location_id) : null,
                    onChange: (v) => setFilter('location_id', v),
                    placeholder: "Semua Lokasi"
                }}
                team={{
                    value: filters.team_id ? Number(filters.team_id) : null,
                    onChange: (v) => setFilter('team_id', v),
                    placeholder: "Semua Tim"
                }}
            >
                <Select value={String(filters.work_status_id)} onValueChange={(v) => setFilter('work_status_id', v)}>
                    <SelectTrigger className="h-7 text-xs bg-background">
                        <SelectValue placeholder="Semua Status Karyawan" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Status Karyawan</SelectItem>
                        <SelectItem value='1'>Aktif</SelectItem>
                        <SelectItem value='3'>Tidak Aktif</SelectItem>
                        <SelectItem value='2'>Resign</SelectItem>
                    </SelectContent>
                </Select>
            </ManagementFilter>

            <DataTable
                columns={columns}
                data={employees}
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
