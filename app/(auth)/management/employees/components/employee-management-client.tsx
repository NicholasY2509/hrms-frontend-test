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
import { FilterCard, FilterGrid } from "@/components/layout/filter-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCallback } from 'react';

import { ExportEmployeeDialog } from '@/modules/employee/employee/components/export-employee-dialog';
import { Button } from '@/components/ui/button';

export function EmployeeManagementClient() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const getParam = (key: string, defaultValue: string = '') => searchParams.get(key) || defaultValue;

    const [search, setSearch] = React.useState(getParam('search'));
    const [page, setPage] = React.useState(Number(getParam('page', '1')));
    const [perPage, setPerPage] = React.useState(getParam('per_page', '15'));
    const [departmentId, setDepartmentId] = React.useState<number | null>(searchParams.get('department_id') ? Number(searchParams.get('department_id')) : null);
    const [teamId, setTeamId] = React.useState<number | null>(searchParams.get('team_id') ? Number(searchParams.get('team_id')) : null);
    const [locationId, setLocationId] = React.useState<number | null>(searchParams.get('location_id') ? Number(searchParams.get('location_id')) : null);
    const [positionId, setPositionId] = React.useState<number | null>(searchParams.get('position_id') ? Number(searchParams.get('position_id')) : null);
    const [workStatusId, setWorkStatusId] = React.useState<string>(getParam('work_status_id', 'all'));
    const [employeeStatusId, setEmployeeStatusId] = React.useState<string>(getParam('employee_status_id', 'all'));

    const debouncedSearch = useDebounce(search, 500);

    const updateQuery = useCallback((updates: Record<string, string | number | null | undefined>) => {
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

    const activeFilters = React.useMemo(() => ({
        search: debouncedSearch,
        department_id: departmentId || undefined,
        team_id: teamId || undefined,
        work_location_id: locationId || undefined,
        work_position_id: positionId || undefined,
        work_employee_status_id: workStatusId === 'all' ? undefined : workStatusId,
        employee_status_id: employeeStatusId === 'all' ? undefined : employeeStatusId,
    }), [debouncedSearch, departmentId, teamId, locationId, positionId, workStatusId, employeeStatusId]);

    // Update URL when debounced search changes
    React.useEffect(() => {
        if (debouncedSearch !== getParam('search')) {
            updateQuery({ search: debouncedSearch });
        }
    }, [debouncedSearch, updateQuery]);

    // Fetch Employees with all filters
    const { employees, summary, meta, isLoading } = useManagementEmployees({
        ...activeFilters,
        page,
        per_page: Number(perPage),
    });

    const handleView = (item: Employee) => {
        router.push(`/management/employees/${item.id}`);
    };

    const handleResetFilters = () => {
        setSearch('');
        setDepartmentId(null);
        setTeamId(null);
        setLocationId(null);
        setPositionId(null);
        setWorkStatusId('all');
        setEmployeeStatusId('all');
        setPage(1);
        router.replace(pathname, { scroll: false });
    };

    const columns = React.useMemo(() => getEmployeeColumns(handleView), []);

    const hasActiveFilters = search !== '' || departmentId !== null || teamId !== null || locationId !== null || positionId !== null || workStatusId !== 'all' || employeeStatusId !== 'all';

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
                            placeholder="Cari nama atau NIK..."
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

                    <WorkPositionPicker
                        value={positionId}
                        onChange={(v) => {
                            setPositionId(v);
                            updateQuery({ position_id: v });
                        }}
                        placeholder="Semua Jabatan"
                    />

                    <WorkLocationPicker
                        value={locationId}
                        onChange={(v) => {
                            setLocationId(v);
                            updateQuery({ location_id: v });
                        }}
                        placeholder="Semua Lokasi"
                    />

                    <TeamPicker
                        value={teamId}
                        onChange={(v) => {
                            setTeamId(v);
                            updateQuery({ team_id: v });
                        }}
                        placeholder="Semua Tim"
                    />

                    <Select value={workStatusId?.toString()} onValueChange={(v) => {
                        setWorkStatusId(v);
                        updateQuery({ work_status_id: v });
                    }}>
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
                </FilterGrid>
            </FilterCard>

            <DataTable
                columns={columns}
                data={employees}
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
