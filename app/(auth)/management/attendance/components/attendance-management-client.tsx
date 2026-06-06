"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Download01Icon, Database02Icon } from "@hugeicons/core-free-icons"
import { DataTable } from "@/components/data-table/data-table"
import { PageHeader } from "@/components/layout/page-header"
import { useDebounce } from "@/hooks/use-debounce"
import { useAttendanceList } from "@/modules/attendance/attendances/hooks/use-attendance"
import { getAttendanceColumns } from "../columns"
import { AttendanceModel } from "@/modules/attendance/attendances/types"
import { format } from "date-fns"
import { ManagementFilter } from "@/components/layout/management-filter"
import { useUrlFilters } from "@/hooks/use-url-filters"
import { Button } from "@/components/ui/button"
import { TeamPicker } from "@/modules/organization/teams/components/team-picker"

import {
  TaskEdit01Icon,
  ArrowDown01Icon,
  ReloadFreeIcons,
  ReloadIcon,
} from "@hugeicons/core-free-icons"
import { RowSelectionState } from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import dynamic from "next/dynamic"

const ExportAttendanceDialog = dynamic(() => import("@/modules/attendance/attendances/components/export-attendance-dialog").then(mod => mod.ExportAttendanceDialog), { ssr: false })
const CalculateAttendanceDialog = dynamic(() => import("@/modules/attendance/attendances/components/calculate-attendance-dialog").then(mod => mod.CalculateAttendanceDialog), { ssr: false })
const AttendanceDetailDialog = dynamic(() => import("@/modules/attendance/attendances/components/attendance-detail-dialog").then(mod => mod.AttendanceDetailDialog), { ssr: false })
const BatchUpdateAttendanceStatusDialog = dynamic(() => import("@/modules/attendance/attendances/components/batch-update-attendance-status-dialog").then(mod => mod.BatchUpdateAttendanceStatusDialog), { ssr: false })
const ZktecoAttendanceSyncDialog = dynamic(() => import("@/modules/attendance/zkteco/components/zkteco-attendance-sync-dialog").then(mod => mod.ZktecoAttendanceSyncDialog), { ssr: false })
const ZktecoSyncDialog = dynamic(() => import("@/modules/attendance/zkteco/components/zkteco-sync-dialog").then(mod => mod.ZktecoSyncDialog), { ssr: false })

export function AttendanceManagementClient() {
  const { filters, setFilter, setFilters, resetFilters, hasActiveFilters } =
    useUrlFilters({
      page: 1,
      per_page: 15,
      search: "",
      status_id: null as number | null,
      employee_id: null as number | null,
      supervisor_id: null as number | null,
      department_id: null as number | null,
      team_id: null as number | null,
      start_date: undefined as string | undefined,
      end_date: undefined as string | undefined,
    })

  const [isExportDialogOpen, setIsExportDialogOpen] = React.useState(false)
  const [isCalculateDialogOpen, setIsCalculateDialogOpen] =
    React.useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = React.useState(false)
  const [isBatchUpdateDialogOpen, setIsBatchUpdateDialogOpen] =
    React.useState(false)
  const [isSyncAttendanceDialogOpen, setIsSyncAttendanceDialogOpen] =
    React.useState(false)
  const [isSyncUserDialogOpen, setIsSyncUserDialogOpen] = React.useState(false)
  const [selectedAttendance, setSelectedAttendance] =
    React.useState<AttendanceModel | null>(null)
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})

  const debouncedSearch = useDebounce(filters.search, 500)

  const { items, meta, isLoading } = useAttendanceList({
    search: debouncedSearch,
    page: filters.page,
    per_page: Number(filters.per_page),
    attendance_status_id: filters.status_id
      ? Number(filters.status_id)
      : undefined,
    team_id: filters.team_id ? Number(filters.team_id) : undefined,
    employee_id: filters.employee_id ? Number(filters.employee_id) : undefined,
    supervisor_employee_id: filters.supervisor_id
      ? Number(filters.supervisor_id)
      : undefined,
    department_id: filters.department_id
      ? Number(filters.department_id)
      : undefined,
    start_date: filters.start_date,
    end_date: filters.end_date,
  })

  const handleView = (item: AttendanceModel) => {
    setSelectedAttendance(item)
    setIsDetailDialogOpen(true)
  }

  const columns = React.useMemo(() => getAttendanceColumns(handleView), [])

  const [selectedAttendanceMap, setSelectedAttendanceMap] = React.useState<
    Record<string, AttendanceModel>
  >({})

  React.useEffect(() => {
    setSelectedAttendanceMap((prev) => {
      let hasChanges = false
      const newMap = { ...prev }

      // Add currently visible selected items
      items?.forEach((item) => {
        if (rowSelection[item.id] && !newMap[item.id]) {
          newMap[item.id] = item
          hasChanges = true
        }
      })

      // Remove deselected items
      Object.keys(newMap).forEach((id) => {
        if (!rowSelection[id]) {
          delete newMap[id]
          hasChanges = true
        }
      })

      return hasChanges ? newMap : prev
    })
  }, [rowSelection, items])

  const selectedAttendances = Object.values(selectedAttendanceMap)

  return (
    <div className="w-full min-w-0 space-y-6">
      <PageHeader
        title="Manajemen Kehadiran"
        description="Pantau dan kelola data kehadiran karyawan harian."
      >
        <div className="flex items-center gap-1">
          {Object.keys(rowSelection).length > 0 && (
            <Button
              variant="secondary"
              className="gap-2"
              onClick={() => setIsBatchUpdateDialogOpen(true)}
            >
              <HugeiconsIcon icon={TaskEdit01Icon} size={16} />
              Ubah Status ({Object.keys(rowSelection).length})
            </Button>
          )}
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setIsCalculateDialogOpen(true)}
          >
            <HugeiconsIcon icon={Database02Icon} size={16} />
            Hitung Kehadiran
          </Button>
          <Button
            variant="default"
            className="gap-2"
            onClick={() => setIsExportDialogOpen(true)}
          >
            <HugeiconsIcon icon={Download01Icon} size={16} />
            Laporan Kehadiran
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" className="gap-2">
                <HugeiconsIcon icon={ReloadFreeIcons} size={16} />
                Tarik Data
                <HugeiconsIcon icon={ArrowDown01Icon} size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-auto">
              <DropdownMenuItem
                onClick={() => setIsSyncAttendanceDialogOpen(true)}
                className="w-auto cursor-pointer gap-2"
              >
                Tarik Data Absensi
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setIsSyncUserDialogOpen(true)}
                className="w-auto cursor-pointer gap-2"
              >
                Tarik Data User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </PageHeader>

      <ManagementFilter
        setPage={(p) => setFilter("page", p)}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
        perPage={String(filters.per_page)}
        onPerPageChange={(v) => setFilter("per_page", v)}
        search={{
          value: filters.search,
          onChange: (v) => setFilter("search", v),
          placeholder: "Cari karyawan...",
        }}
        employee={{
          value: filters.employee_id ? Number(filters.employee_id) : null,
          onChange: (v) => setFilter("employee_id", v),
        }}
        supervisor={{
          value: filters.supervisor_id ? Number(filters.supervisor_id) : null,
          onChange: (v) => setFilter("supervisor_id", v),
        }}
        department={{
          value: filters.department_id ? Number(filters.department_id) : null,
          onChange: (v) => setFilter("department_id", v),
        }}
        attendanceStatus={{
          value: filters.status_id ? Number(filters.status_id) : null,
          onChange: (v) => setFilter("status_id", v),
        }}
        startDate={{
          value: filters.start_date ? new Date(filters.start_date) : undefined,
          onChange: (d) =>
            setFilter("start_date", d ? format(d, "yyyy-MM-dd") : undefined),
        }}
        endDate={{
          value: filters.end_date ? new Date(filters.end_date) : undefined,
          onChange: (d) =>
            setFilter("end_date", d ? format(d, "yyyy-MM-dd") : undefined),
        }}
      >
        <TeamPicker
          value={filters.team_id ? Number(filters.team_id) : null}
          onChange={(v) => setFilter("team_id", v)}
          placeholder="Semua Tim"
        />
      </ManagementFilter>

      <DataTable
        columns={columns}
        data={items}
        isLoading={isLoading}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        pagination={
          meta
            ? {
                ...meta,
                onPageChange: (p) => setFilter("page", p),
              }
            : undefined
        }
      />
      <ExportAttendanceDialog
        open={isExportDialogOpen}
        onOpenChange={setIsExportDialogOpen}
      />
      <CalculateAttendanceDialog
        open={isCalculateDialogOpen}
        onOpenChange={setIsCalculateDialogOpen}
      />
      <AttendanceDetailDialog
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        attendance={selectedAttendance}
      />
      <BatchUpdateAttendanceStatusDialog
        open={isBatchUpdateDialogOpen}
        onOpenChange={setIsBatchUpdateDialogOpen}
        selectedAttendances={selectedAttendances}
        onSuccess={() => setRowSelection({})}
      />
      <ZktecoAttendanceSyncDialog
        open={isSyncAttendanceDialogOpen}
        onOpenChange={setIsSyncAttendanceDialogOpen}
      />
      <ZktecoSyncDialog
        open={isSyncUserDialogOpen}
        onOpenChange={setIsSyncUserDialogOpen}
      />
    </div>
  )
}
