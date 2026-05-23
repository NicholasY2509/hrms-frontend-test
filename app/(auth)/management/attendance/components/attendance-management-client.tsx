"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Search01Icon,
  Download01Icon,
  Database02Icon,
} from "@hugeicons/core-free-icons"
import { DataTable } from "@/components/data-table/data-table"
import { PageHeader } from "@/components/layout/page-header"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { useDebounce } from "@/hooks/use-debounce"
import { useAttendanceList } from "@/modules/attendance/attendances/hooks/use-attendance"
import { getAttendanceColumns } from "../columns"
import { AttendanceModel } from "@/modules/attendance/attendances/types"
import { AttendanceStatusPicker } from "@/modules/attendance/shared/components/attendance-status-picker"
import { EmployeePicker } from "@/modules/employee/employee/components/employee-picker"
import { DatePicker } from "@/components/ui/date-picker"
import { format } from "date-fns"
import { FilterCard, FilterGrid } from "@/components/layout/filter-card"
import { ExportAttendanceDialog } from "@/modules/attendance/attendances/components/export-attendance-dialog"
import { Button } from "@/components/ui/button"
import { CalculateAttendanceDialog } from "@/modules/attendance/attendances/components/calculate-attendance-dialog"
import { AttendanceDetailDialog } from "@/modules/attendance/attendances/components/attendance-detail-dialog"
import { DepartmentPicker } from "@/modules/organization/department/components/department-picker"

import { BatchUpdateAttendanceStatusDialog } from "@/modules/attendance/attendances/components/batch-update-attendance-status-dialog"
import { TaskEdit01Icon } from "@hugeicons/core-free-icons"
import { RowSelectionState } from "@tanstack/react-table"

export function AttendanceManagementClient() {
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState("15")
  const [statusId, setStatusId] = React.useState<number | null>(null)
  const [employeeId, setEmployeeId] = React.useState<number | null>(null)
  const [departmentId, setDepartmentId] = React.useState<number | null>(null)
  const [startDate, setStartDate] = React.useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = React.useState<Date | undefined>(undefined)
  const [isExportDialogOpen, setIsExportDialogOpen] = React.useState(false)
  const [isCalculateDialogOpen, setIsCalculateDialogOpen] =
    React.useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = React.useState(false)
  const [isBatchUpdateDialogOpen, setIsBatchUpdateDialogOpen] =
    React.useState(false)
  const [selectedAttendance, setSelectedAttendance] =
    React.useState<AttendanceModel | null>(null)
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})

  const debouncedSearch = useDebounce(search, 500)

  const { items, meta, isLoading } = useAttendanceList({
    search: debouncedSearch,
    page,
    per_page: Number(perPage),
    attendance_status_id: statusId || undefined,
    employee_id: employeeId || undefined,
    department_id: departmentId || undefined,
    start_date: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
    end_date: endDate ? format(endDate, "yyyy-MM-dd") : undefined,
  })

  const handleResetFilters = () => {
    setSearch("")
    setStatusId(null)
    setEmployeeId(null)
    setDepartmentId(null)
    setStartDate(undefined)
    setEndDate(undefined)
    setPage(1)
  }

  const hasActiveFilters =
    search !== "" ||
    statusId !== null ||
    employeeId !== null ||
    departmentId !== null ||
    startDate !== undefined ||
    endDate !== undefined

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
        <div className="flex items-center gap-3">
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
        </div>
      </PageHeader>

      <FilterCard
        onReset={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
        perPage={perPage}
        onPerPageChange={setPerPage}
      >
        <FilterGrid cols={4}>
          <InputGroup className="">
            <InputGroupAddon>
              <HugeiconsIcon
                icon={Search01Icon}
                className="text-muted-foreground"
                size={14}
              />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Cari karyawan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>

          <EmployeePicker
            value={employeeId}
            onChange={(val) => setEmployeeId(val)}
            placeholder="Filter Karyawan"
          />

          <DepartmentPicker
            value={departmentId}
            onChange={(val) => setDepartmentId(val)}
            placeholder="Filter Departemen"
          />

          <AttendanceStatusPicker
            value={statusId}
            onChange={(val) => setStatusId(val)}
            placeholder="Filter Status"
          />

          <DatePicker
            value={startDate}
            onChange={setStartDate}
            placeholder="Tanggal Mulai"
          />

          <DatePicker
            value={endDate}
            onChange={setEndDate}
            placeholder="Tanggal Selesai"
          />
        </FilterGrid>
      </FilterCard>

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
                onPageChange: (p) => setPage(p),
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
    </div>
  )
}
