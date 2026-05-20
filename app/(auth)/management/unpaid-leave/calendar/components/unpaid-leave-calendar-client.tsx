'use client';

import * as React from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    ArrowLeft01Icon,
    ArrowRight01Icon,
    Calendar01Icon,
    FilterIcon,
    ListViewIcon
} from '@hugeicons/core-free-icons';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
    format,
    startOfWeek,
    endOfWeek,
    addWeeks,
    subWeeks,
    eachDayOfInterval,
    isSameDay,
    isToday,
    parseISO,
    startOfDay,
    differenceInDays
} from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { useUnpaidLeaveCalendar } from '@/modules/unpaid-leave/hooks/use-unpaid-leave';
import { FilterCard, FilterGrid } from '@/components/layout/filter-card';
import { DepartmentPicker } from '@/modules/organization/department/components/department-picker';
import { UnpaidLeaveTypePicker } from '@/modules/unpaid-leave/components/unpaid-leave-type-picker';
import { EmployeePicker } from '@/modules/employee/employee/components/employee-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover';
import {
    InformationCircleIcon,
    ViewIcon
} from '@hugeicons/core-free-icons';
import { MonthPicker } from '@/components/ui/month-picker';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function UnpaidLeaveCalendarClient() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Filters State
    const [departmentId, setDepartmentId] = React.useState<number | null>(searchParams.get('department_id') ? Number(searchParams.get('department_id')) : null);
    const [employeeId, setEmployeeId] = React.useState<number | null>(searchParams.get('employee_id') ? Number(searchParams.get('employee_id')) : null);
    const [typeId, setTypeId] = React.useState<number | null>(searchParams.get('unpaid_leave_type_id') ? Number(searchParams.get('unpaid_leave_type_id')) : null);
    const [status, setStatus] = React.useState<string>(searchParams.get('status') || 'all');

    // Date Range (Weekly by default)
    const [currentDate, setCurrentDate] = React.useState(() => {
        const dateParam = searchParams.get('date');
        return dateParam ? parseISO(dateParam) : new Date();
    });

    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const activeFilters = React.useMemo(() => ({
        start_date: format(weekStart, 'yyyy-MM-dd'),
        end_date: format(weekEnd, 'yyyy-MM-dd'),
        department_id: departmentId || undefined,
        employee_id: employeeId || undefined,
        unpaid_leave_type_id: typeId || undefined,
        status: status === 'all' ? undefined : status,
    }), [weekStart, weekEnd, departmentId, employeeId, typeId, status]);

    const { data, isLoading } = useUnpaidLeaveCalendar(activeFilters);

    const updateQuery = React.useCallback((updates: Record<string, string | number | null | undefined>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === undefined || value === '' || value === 'all') {
                params.delete(key);
            } else {
                params.set(key, String(value));
            }
        });
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, [pathname, router, searchParams]);

    const handlePreviousWeek = () => {
        const newDate = subWeeks(currentDate, 1);
        setCurrentDate(newDate);
        updateQuery({ date: format(newDate, 'yyyy-MM-dd') });
    };

    const handleNextWeek = () => {
        const newDate = addWeeks(currentDate, 1);
        setCurrentDate(newDate);
        updateQuery({ date: format(newDate, 'yyyy-MM-dd') });
    };

    const handleToday = () => {
        const newDate = new Date();
        setCurrentDate(newDate);
        updateQuery({ date: format(newDate, 'yyyy-MM-dd') });
    };

    const handleMonthChange = (date: Date | undefined) => {
        if (date) {
            setCurrentDate(date);
            updateQuery({ date: format(date, 'yyyy-MM-dd') });
        }
    };

    const handleResetFilters = () => {
        setDepartmentId(null);
        setEmployeeId(null);
        setTypeId(null);
        setStatus('all');
        const today = new Date();
        setCurrentDate(today);
        router.replace(pathname, { scroll: false });
    };

    const hasActiveFilters = departmentId !== null || employeeId !== null || typeId !== null || status !== 'all' || !isSameDay(currentDate, new Date());

    return (
        <div className="space-y-6">
            <PageHeader
                title="Kalender Izin"
                description="Tampilan jadwal izin karyawan dalam seminggu."
            >
                <div className="flex items-center gap-2">
                    <Button asChild variant="outline">
                        <Link href="/management/unpaid-leave">
                            <HugeiconsIcon icon={ListViewIcon} className="mr-2" size={16} />
                            Tampilan Daftar
                        </Link>
                    </Button>
                </div>
            </PageHeader>

            <FilterCard
                onReset={handleResetFilters}
                hasActiveFilters={hasActiveFilters}
            >
                <FilterGrid cols={5}>
                    <MonthPicker
                        value={currentDate}
                        onChange={handleMonthChange}
                    />
                    <DepartmentPicker
                        value={departmentId}
                        onChange={(v) => {
                            setDepartmentId(v);
                            updateQuery({ department_id: v });
                        }}
                        placeholder="Semua Departemen"
                    />
                    <EmployeePicker
                        value={employeeId}
                        onChange={(v) => {
                            setEmployeeId(v);
                            updateQuery({ employee_id: v });
                        }}
                        placeholder="Semua Karyawan"
                    />
                    <UnpaidLeaveTypePicker
                        value={typeId}
                        onChange={(v) => {
                            setTypeId(v);
                            updateQuery({ unpaid_leave_type_id: v });
                        }}
                        placeholder="Semua Tipe Izin"
                    />
                    <Select value={status} onValueChange={(v) => {
                        setStatus(v);
                        updateQuery({ status: v });
                    }}>
                        <SelectTrigger className="h-9 bg-background">
                            <SelectValue placeholder="Semua Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </FilterGrid>
            </FilterCard>

            <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between bg-muted/50">
                    <div className="flex items-center gap-4">
                        <div className="w-48 shrink-0">
                            <h2 className="text-lg font-semibold capitalize truncate">
                                {format(weekStart, 'MMMM yyyy', { locale: localeId })}
                            </h2>
                        </div>
                        <div className="flex items-center gap-1 border rounded-lg bg-background p-1 shrink-0 shadow-sm">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handlePreviousWeek}>
                                <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 px-3 text-xs font-medium" onClick={handleToday}>
                                Hari Ini
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleNextWeek}>
                                <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                            </Button>
                        </div>
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                        {format(weekStart, 'dd MMM', { locale: localeId })} - {format(weekEnd, 'dd MMM yyyy', { locale: localeId })}
                    </div>
                </div>

                <div className="relative border-b">
                    <div className="grid grid-cols-7 divide-x h-full absolute inset-0 pointer-events-none">
                        {days.map((day) => (
                            <div
                                key={day.toString()}
                                className={cn(
                                    "h-full",
                                    isToday(day) && "bg-primary/5"
                                )}
                            />
                        ))}
                    </div>

                    <div className="grid grid-cols-7 border-b relative z-10">
                        {days.map((day) => {
                            const dayHoliday = data?.holidays.find(h => isSameDay(parseISO(h.date), day));
                            return (
                                <div
                                    key={day.toString()}
                                    className={cn(
                                        "p-2 text-center flex flex-col items-center justify-center min-h-[60px]",
                                        dayHoliday && "bg-red-50 dark:bg-red-950/20"
                                    )}
                                >
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-1">
                                        {format(day, 'EEE', { locale: localeId })}
                                    </div>
                                    <div className={cn(
                                        "inline-flex items-center justify-center h-7 w-7 rounded-full text-sm font-semibold mb-1",
                                        isToday(day) ? "bg-primary text-primary-foreground" : "text-foreground"
                                    )}>
                                        {format(day, 'd')}
                                    </div>
                                    {dayHoliday && (
                                        <div className="text-[9px] font-bold text-red-500 leading-tight truncate w-full px-1" title={dayHoliday.name}>
                                            {dayHoliday.name}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="relative min-h-[600px] bg-background/50">
                    {/* Background Grid Lines & Holiday Highlights */}
                    <div className="grid grid-cols-7 divide-x h-full absolute inset-0 pointer-events-none">
                        {days.map((day) => {
                            const dayHoliday = data?.holidays.find(h => isSameDay(parseISO(h.date), day));
                            return (
                                <div
                                    key={day.toString()}
                                    className={cn(
                                        "h-full",
                                        dayHoliday && "bg-red-50/50 dark:bg-red-950/10",
                                        isToday(day) && "bg-primary/5"
                                    )}
                                />
                            );
                        })}
                    </div>

                    <div className="relative z-10 p-2">
                        {/* Leaves Grid */}
                        <div className="grid grid-cols-7 grid-rows-[repeat(20,minmax(auto,1fr))] gap-y-1 relative">
                            {(() => {
                                if (isLoading) {
                                    return Array.from({ length: 7 }).map((_, i) => (
                                        <div key={i} className="px-2 space-y-2" style={{ gridColumn: i + 1 }}>
                                            <div className="h-16 rounded-lg bg-muted animate-pulse" />
                                            <div className="h-16 rounded-lg bg-muted animate-pulse" />
                                        </div>
                                    ));
                                }

                                if (!data?.leaves.length) return null;

                                // Sorting leaves by start date and duration to optimize track placement
                                const sortedLeaves = [...data.leaves].sort((a, b) => {
                                    const startA = parseISO(a.start_date).getTime();
                                    const startB = parseISO(b.start_date).getTime();
                                    if (startA !== startB) return startA - startB;

                                    const durationA = parseISO(a.end_date).getTime() - startA;
                                    const durationB = parseISO(b.end_date).getTime() - startB;
                                    return durationB - durationA;
                                });

                                const tracks: { [trackIndex: number]: { start: number; end: number }[] } = {};

                                return sortedLeaves.map((leave) => {
                                    const leaveStart = parseISO(leave.start_date);
                                    const leaveEnd = parseISO(leave.end_date);

                                    const isContinuingStart = leaveStart < weekStart;
                                    const isContinuingEnd = leaveEnd > weekEnd;

                                    // Compact Color Mapping based on Type
                                    const getTypeColor = (typeName: string, defaultColor: string) => {
                                        const name = typeName.toLowerCase();
                                        if (name.includes('sakit')) return '#10B981'; // Green
                                        if (name.includes('tahunan')) return '#3B82F6'; // Blue
                                        if (name.includes('dinas')) return '#F59E0B'; // Orange
                                        if (name.includes('melahirkan')) return '#EC4899'; // Pink
                                        if (name.includes('meninggal') || name.includes('duka')) return '#6B7280'; // Grey
                                        if (name.includes('haji') || name.includes('umroh')) return '#8B5CF6'; // Purple
                                        if (name.includes('pernikahan') || name.includes('menikah')) return '#F43F5E'; // Rose
                                        return defaultColor;
                                    };

                                    const displayColor = getTypeColor(leave.unpaid_leave_type_name, leave.color);

                                    // Calculate relative start/end columns (1-7)
                                    let startCol = days.findIndex(d => isSameDay(d, startOfDay(leaveStart))) + 1;
                                    if (startCol === 0) startCol = 1; // Started before this week

                                    let endCol = days.findIndex(d => isSameDay(d, startOfDay(leaveEnd))) + 1;
                                    if (endCol === 0) endCol = 7; // Ends after this week

                                    // Find available track
                                    let trackIndex = 0;
                                    while (true) {
                                        const conflicts = tracks[trackIndex]?.some(t =>
                                            (startCol >= t.start && startCol <= t.end) ||
                                            (endCol >= t.start && endCol <= t.end) ||
                                            (startCol <= t.start && endCol >= t.end)
                                        );

                                        if (!conflicts) break;
                                        trackIndex++;
                                    }

                                    if (!tracks[trackIndex]) tracks[trackIndex] = [];
                                    tracks[trackIndex].push({ start: startCol, end: endCol });

                                    return (
                                        <div
                                            key={leave.id}
                                            className="px-0.5"
                                            style={{
                                                gridColumnStart: startCol,
                                                gridColumnEnd: endCol + 1,
                                                gridRowStart: trackIndex + 1
                                            }}
                                        >
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <div
                                                        className={cn(
                                                            "p-1.5 text-[10px] shadow-sm border border-current/10 group cursor-pointer hover:brightness-95 transition-all animate-in fade-in slide-in-from-top-1 h-7 flex items-center justify-between relative overflow-hidden",
                                                            !isContinuingStart ? "rounded-l-md" : "rounded-l-none border-l-0",
                                                            !isContinuingEnd ? "rounded-r-md" : "rounded-r-none border-r-0"
                                                        )}
                                                        style={{
                                                            backgroundColor: `${displayColor}20`,
                                                            borderLeft: !isContinuingStart ? `3px solid ${displayColor}` : undefined,
                                                            color: displayColor
                                                        }}
                                                        title={`${leave.employee_name} - ${leave.unpaid_leave_type_name}`}
                                                    >
                                                        {isContinuingStart && (
                                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-r from-current/30 to-transparent" />
                                                        )}
                                                        {isContinuingEnd && (
                                                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-l from-current/30 to-transparent" />
                                                        )}

                                                        <div className="z-10 flex items-center gap-1.5 min-w-0 flex-1">
                                                            {isContinuingStart && <HugeiconsIcon icon={ArrowLeft01Icon} className="h-2.5 w-2.5 shrink-0" />}
                                                            <span className="font-bold truncate">{leave.employee_name}</span>
                                                            <span className="opacity-70 truncate hidden sm:inline">• {leave.unpaid_leave_type_name}</span>
                                                            {isContinuingEnd && <HugeiconsIcon icon={ArrowRight01Icon} className="h-2.5 w-2.5 shrink-0" />}
                                                        </div>

                                                        <div className="flex items-center gap-2 z-10 shrink-0 ml-2">
                                                            <span className="opacity-60 font-medium tabular-nums hidden md:inline">
                                                                {format(leaveStart, 'd/M')} - {format(leaveEnd, 'd/M')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-72 gap-0 p-0 overflow-hidden" side="top" align="start">
                                                    <div
                                                        className="px-4 py-3 border-b"
                                                        style={{ backgroundColor: displayColor, borderBottomColor: displayColor }}
                                                    >
                                                        <div className="flex items-start justify-between gap-4 text-white">
                                                            <div className="min-w-0">
                                                                <h4 className="font-bold text-sm leading-none mb-1.5 truncate">
                                                                    {leave.employee_name}
                                                                </h4>
                                                                <p className="text-[11px] font-medium opacity-80 truncate">
                                                                    {leave.unpaid_leave_type_name}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="p-4 space-y-4 bg-card">
                                                        <div className="grid gap-2.5">
                                                            <div className="flex items-center gap-2.5 text-xs text-muted-foreground font-medium">
                                                                <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center shrink-0">
                                                                    <HugeiconsIcon icon={Calendar01Icon} size={14} />
                                                                </div>
                                                                <span>
                                                                    {format(leaveStart, 'dd MMM yyyy', { locale: localeId })} - {format(leaveEnd, 'dd MMM yyyy', { locale: localeId })}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2.5 text-xs text-muted-foreground font-medium">
                                                                <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center shrink-0">
                                                                    <HugeiconsIcon icon={InformationCircleIcon} size={14} />
                                                                </div>
                                                                <span>
                                                                    <span className="text-primary font-bold">
                                                                        {differenceInDays(leaveEnd, leaveStart) + 1} Hari Kalender
                                                                    </span>
                                                                    <span className="mx-1.5 opacity-30">|</span>
                                                                    <span
                                                                        className="font-bold uppercase tracking-wider text-[10px]"
                                                                        style={{ color: displayColor }}
                                                                    >
                                                                        {leave.status}
                                                                    </span>
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <Button asChild variant="link" className="w-full h-auto p-0 justify-start text-primary font-bold group">
                                                            <Link href={`/management/unpaid-leave/${leave.id}`}>
                                                                <HugeiconsIcon icon={ViewIcon} size={14} className="mr-2" />
                                                                Lihat Detail Selengkapnya
                                                                <HugeiconsIcon icon={ArrowRight01Icon} className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
