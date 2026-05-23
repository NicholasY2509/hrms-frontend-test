"use client"

import * as React from "react"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Calendar01Icon,
  FilterIcon,
  ListViewIcon,
} from "@hugeicons/core-free-icons"
import { useRouter } from "next/navigation"
import { useUrlFilters } from "@/hooks/use-url-filters"
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
  differenceInDays,
} from "date-fns"
import { id as localeId } from "date-fns/locale"
import { useUnpaidLeaveCalendar } from "@/modules/unpaid-leave/hooks/use-unpaid-leave"
import { ManagementFilter } from "@/components/layout/management-filter"
import { DepartmentPicker } from "@/modules/organization/department/components/department-picker"
import { UnpaidLeaveTypePicker } from "@/modules/unpaid-leave/components/unpaid-leave-type-picker"
import { EmployeePicker } from "@/modules/employee/employee/components/employee-picker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { InformationCircleIcon, ViewIcon } from "@hugeicons/core-free-icons"
import { MonthPicker } from "@/components/ui/month-picker"
import { cn } from "@/lib/utils"
import Link from "next/link"

export function UnpaidLeaveCalendarClient() {
  const router = useRouter()
  const { filters, setFilter, resetFilters, hasActiveFilters } = useUrlFilters({
    department_id: null as number | null,
    employee_id: null as number | null,
    unpaid_leave_type_id: null as number | null,
    status: "all",
    date: undefined as string | undefined,
  })

  // Date Range (Weekly by default)
  const currentDate = filters.date ? parseISO(filters.date) : new Date()

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const activeFilters = React.useMemo(
    () => ({
      start_date: format(weekStart, "yyyy-MM-dd"),
      end_date: format(weekEnd, "yyyy-MM-dd"),
      department_id: filters.department_id ? Number(filters.department_id) : undefined,
      employee_id: filters.employee_id ? Number(filters.employee_id) : undefined,
      unpaid_leave_type_id: filters.unpaid_leave_type_id ? Number(filters.unpaid_leave_type_id) : undefined,
      status: filters.status === "all" ? undefined : filters.status,
    }),
    [weekStart, weekEnd, filters]
  )

  const { data, isLoading } = useUnpaidLeaveCalendar(activeFilters)

  const handlePreviousWeek = () => {
    const newDate = subWeeks(currentDate, 1)
    setFilter("date", format(newDate, "yyyy-MM-dd"))
  }

  const handleNextWeek = () => {
    const newDate = addWeeks(currentDate, 1)
    setFilter("date", format(newDate, "yyyy-MM-dd"))
  }

  const handleToday = () => {
    const newDate = new Date()
    setFilter("date", format(newDate, "yyyy-MM-dd"))
  }

  const handleMonthChange = (date: Date | undefined) => {
    if (date) {
      setFilter("date", format(date, "yyyy-MM-dd"))
    }
  }

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

      <ManagementFilter
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
        month={{
          value: currentDate,
          onChange: handleMonthChange,
        }}
        department={{
          value: filters.department_id ? Number(filters.department_id) : null,
          onChange: (v) => setFilter("department_id", v),
          placeholder: "Semua Departemen",
        }}
        employee={{
          value: filters.employee_id ? Number(filters.employee_id) : null,
          onChange: (v) => setFilter("employee_id", v),
          placeholder: "Semua Karyawan",
        }}
        unpaidLeaveType={{
          value: filters.unpaid_leave_type_id ? Number(filters.unpaid_leave_type_id) : null,
          onChange: (v) => setFilter("unpaid_leave_type_id", v),
          placeholder: "Semua Tipe Izin",
        }}
      >
        <Select
          value={String(filters.status)}
          onValueChange={(v) => setFilter("status", v)}
        >
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
      </ManagementFilter>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b bg-muted/50 p-4">
          <div className="flex items-center gap-4">
            <div className="w-48 shrink-0">
              <h2 className="truncate text-lg font-semibold capitalize">
                {format(weekStart, "MMMM yyyy", { locale: localeId })}
              </h2>
            </div>
            <div className="flex shrink-0 items-center gap-1 rounded-lg border bg-background p-1 shadow-sm">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handlePreviousWeek}
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-xs font-medium"
                onClick={handleToday}
              >
                Hari Ini
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleNextWeek}
              >
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
              </Button>
            </div>
          </div>
          <div className="text-sm font-medium text-muted-foreground">
            {format(weekStart, "dd MMM", { locale: localeId })} -{" "}
            {format(weekEnd, "dd MMM yyyy", { locale: localeId })}
          </div>
        </div>

        <div className="relative border-b">
          <div className="pointer-events-none absolute inset-0 grid h-full grid-cols-7 divide-x">
            {days.map((day) => (
              <div
                key={day.toString()}
                className={cn("h-full", isToday(day) && "bg-primary/5")}
              />
            ))}
          </div>

          <div className="relative z-10 grid grid-cols-7 border-b">
            {days.map((day) => {
              const dayHoliday = data?.holidays.find((h) =>
                isSameDay(parseISO(h.date), day)
              )
              return (
                <div
                  key={day.toString()}
                  className={cn(
                    "flex min-h-[60px] flex-col items-center justify-center p-2 text-center",
                    dayHoliday && "bg-red-50 dark:bg-red-950/20"
                  )}
                >
                  <div className="mb-1 text-[10px] font-bold tracking-wider text-muted-foreground/60 uppercase">
                    {format(day, "EEE", { locale: localeId })}
                  </div>
                  <div
                    className={cn(
                      "mb-1 inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold",
                      isToday(day)
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground"
                    )}
                  >
                    {format(day, "d")}
                  </div>
                  {dayHoliday && (
                    <div
                      className="w-full truncate px-1 text-[9px] leading-tight font-bold text-red-500"
                      title={dayHoliday.name}
                    >
                      {dayHoliday.name}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="relative min-h-[600px] bg-background/50">
          {/* Background Grid Lines & Holiday Highlights */}
          <div className="pointer-events-none absolute inset-0 grid h-full grid-cols-7 divide-x">
            {days.map((day) => {
              const dayHoliday = data?.holidays.find((h) =>
                isSameDay(parseISO(h.date), day)
              )
              return (
                <div
                  key={day.toString()}
                  className={cn(
                    "h-full",
                    dayHoliday && "bg-red-50/50 dark:bg-red-950/10",
                    isToday(day) && "bg-primary/5"
                  )}
                />
              )
            })}
          </div>

          <div className="relative z-10 p-2">
            {/* Leaves Grid */}
            <div className="relative grid grid-cols-7 grid-rows-[repeat(20,minmax(auto,1fr))] gap-y-1">
              {(() => {
                if (isLoading) {
                  return Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      className="space-y-2 px-2"
                      style={{ gridColumn: i + 1 }}
                    >
                      <div className="h-16 animate-pulse rounded-lg bg-muted" />
                      <div className="h-16 animate-pulse rounded-lg bg-muted" />
                    </div>
                  ))
                }

                if (!data?.leaves.length) return null

                // Sorting leaves by start date and duration to optimize track placement
                const sortedLeaves = [...data.leaves].sort((a, b) => {
                  const startA = parseISO(a.start_date).getTime()
                  const startB = parseISO(b.start_date).getTime()
                  if (startA !== startB) return startA - startB

                  const durationA = parseISO(a.end_date).getTime() - startA
                  const durationB = parseISO(b.end_date).getTime() - startB
                  return durationB - durationA
                })

                const tracks: {
                  [trackIndex: number]: { start: number; end: number }[]
                } = {}

                return sortedLeaves.map((leave) => {
                  const leaveStart = parseISO(leave.start_date)
                  const leaveEnd = parseISO(leave.end_date)

                  const isContinuingStart = leaveStart < weekStart
                  const isContinuingEnd = leaveEnd > weekEnd

                  // Compact Color Mapping based on Type
                  const getTypeColor = (
                    typeName: string,
                    defaultColor: string
                  ) => {
                    const name = typeName.toLowerCase()
                    if (name.includes("sakit")) return "#10B981" // Green
                    if (name.includes("tahunan")) return "#3B82F6" // Blue
                    if (name.includes("dinas")) return "#F59E0B" // Orange
                    if (name.includes("melahirkan")) return "#EC4899" // Pink
                    if (name.includes("meninggal") || name.includes("duka"))
                      return "#6B7280" // Grey
                    if (name.includes("haji") || name.includes("umroh"))
                      return "#8B5CF6" // Purple
                    if (name.includes("pernikahan") || name.includes("menikah"))
                      return "#F43F5E" // Rose
                    return defaultColor
                  }

                  const displayColor = getTypeColor(
                    leave.unpaid_leave_type_name,
                    leave.color
                  )

                  // Calculate relative start/end columns (1-7)
                  let startCol =
                    days.findIndex((d) =>
                      isSameDay(d, startOfDay(leaveStart))
                    ) + 1
                  if (startCol === 0) startCol = 1 // Started before this week

                  let endCol =
                    days.findIndex((d) => isSameDay(d, startOfDay(leaveEnd))) +
                    1
                  if (endCol === 0) endCol = 7 // Ends after this week

                  // Find available track
                  let trackIndex = 0
                  while (true) {
                    const conflicts = tracks[trackIndex]?.some(
                      (t) =>
                        (startCol >= t.start && startCol <= t.end) ||
                        (endCol >= t.start && endCol <= t.end) ||
                        (startCol <= t.start && endCol >= t.end)
                    )

                    if (!conflicts) break
                    trackIndex++
                  }

                  if (!tracks[trackIndex]) tracks[trackIndex] = []
                  tracks[trackIndex].push({ start: startCol, end: endCol })

                  return (
                    <div
                      key={leave.id}
                      className="px-0.5"
                      style={{
                        gridColumnStart: startCol,
                        gridColumnEnd: endCol + 1,
                        gridRowStart: trackIndex + 1,
                      }}
                    >
                      <Popover>
                        <PopoverTrigger asChild>
                          <div
                            className={cn(
                              "group relative flex h-7 animate-in cursor-pointer items-center justify-between overflow-hidden border border-current/10 p-1.5 text-[10px] shadow-sm transition-all fade-in slide-in-from-top-1 hover:brightness-95",
                              !isContinuingStart
                                ? "rounded-l-md"
                                : "rounded-l-none border-l-0",
                              !isContinuingEnd
                                ? "rounded-r-md"
                                : "rounded-r-none border-r-0"
                            )}
                            style={{
                              backgroundColor: `${displayColor}20`,
                              borderLeft: !isContinuingStart
                                ? `3px solid ${displayColor}`
                                : undefined,
                              color: displayColor,
                            }}
                            title={`${leave.employee_name} - ${leave.unpaid_leave_type_name}`}
                          >
                            {isContinuingStart && (
                              <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-r from-current/30 to-transparent" />
                            )}
                            {isContinuingEnd && (
                              <div className="absolute top-0 right-0 bottom-0 w-1 bg-gradient-to-l from-current/30 to-transparent" />
                            )}

                            <div className="z-10 flex min-w-0 flex-1 items-center gap-1.5">
                              {isContinuingStart && (
                                <HugeiconsIcon
                                  icon={ArrowLeft01Icon}
                                  className="h-2.5 w-2.5 shrink-0"
                                />
                              )}
                              <span className="truncate font-bold">
                                {leave.employee_name}
                              </span>
                              <span className="hidden truncate opacity-70 sm:inline">
                                • {leave.unpaid_leave_type_name}
                              </span>
                              {isContinuingEnd && (
                                <HugeiconsIcon
                                  icon={ArrowRight01Icon}
                                  className="h-2.5 w-2.5 shrink-0"
                                />
                              )}
                            </div>

                            <div className="z-10 ml-2 flex shrink-0 items-center gap-2">
                              <span className="hidden font-medium tabular-nums opacity-60 md:inline">
                                {format(leaveStart, "d/M")} -{" "}
                                {format(leaveEnd, "d/M")}
                              </span>
                            </div>
                          </div>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-72 gap-0 overflow-hidden p-0"
                          side="top"
                          align="start"
                        >
                          <div
                            className="border-b px-4 py-3"
                            style={{
                              backgroundColor: displayColor,
                              borderBottomColor: displayColor,
                            }}
                          >
                            <div className="flex items-start justify-between gap-4 text-white">
                              <div className="min-w-0">
                                <h4 className="mb-1.5 truncate text-sm leading-none font-bold">
                                  {leave.employee_name}
                                </h4>
                                <p className="truncate text-[11px] font-medium opacity-80">
                                  {leave.unpaid_leave_type_name}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4 bg-card p-4">
                            <div className="grid gap-2.5">
                              <div className="flex items-center gap-2.5 text-xs font-medium text-muted-foreground">
                                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted">
                                  <HugeiconsIcon
                                    icon={Calendar01Icon}
                                    size={14}
                                  />
                                </div>
                                <span>
                                  {format(leaveStart, "dd MMM yyyy", {
                                    locale: localeId,
                                  })}{" "}
                                  -{" "}
                                  {format(leaveEnd, "dd MMM yyyy", {
                                    locale: localeId,
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center gap-2.5 text-xs font-medium text-muted-foreground">
                                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted">
                                  <HugeiconsIcon
                                    icon={InformationCircleIcon}
                                    size={14}
                                  />
                                </div>
                                <span>
                                  <span className="font-bold text-primary">
                                    {differenceInDays(leaveEnd, leaveStart) + 1}{" "}
                                    Hari Kalender
                                  </span>
                                  <span className="mx-1.5 opacity-30">|</span>
                                  <span
                                    className="text-[10px] font-bold tracking-wider uppercase"
                                    style={{ color: displayColor }}
                                  >
                                    {leave.status}
                                  </span>
                                </span>
                              </div>
                            </div>

                            <Button
                              asChild
                              variant="link"
                              className="group h-auto w-full justify-start p-0 font-bold text-primary"
                            >
                              <Link
                                href={`/management/unpaid-leave/${leave.id}`}
                              >
                                <HugeiconsIcon
                                  icon={ViewIcon}
                                  size={14}
                                  className="mr-2"
                                />
                                Lihat Detail Selengkapnya
                                <HugeiconsIcon
                                  icon={ArrowRight01Icon}
                                  className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1"
                                />
                              </Link>
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  )
                })
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
