"use client"

import * as React from "react"
import { format } from "date-fns"
import { DataTable } from "@/components/data-table/data-table"
import { PageHeader } from "@/components/layout/page-header"
import { useDebounce } from "@/hooks/use-debounce"
import { useAnnualLeaveList } from "@/modules/employee/annual-leave/hooks/use-annual-leave"
import { getColumns } from "../columns"
import { ManagementFilter } from "@/components/layout/management-filter"
import { useUrlFilters } from "@/hooks/use-url-filters"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AnnualLeaveDetailDialog } from "./annual-leave-detail-dialog"
import { AnnualLeave } from "@/modules/employee/annual-leave/types"

export function AnnualLeaveManagementClient() {
  const { filters, setFilter, resetFilters, hasActiveFilters } = useUrlFilters({
    page: 1,
    per_page: 15,
    search: "",
    status: "all",
    start_date: undefined as string | undefined,
    end_date: undefined as string | undefined,
  })

  const [selectedLog, setSelectedLog] = React.useState<AnnualLeave | null>(null)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  const handleEmployeeClick = React.useCallback((employee: any) => {
    // We keep this function if needed, but the user requested not to show the old dialog here
    // So it does nothing or redirects to employee profile if desired. 
    // For now, let's just make it a no-op as the dialog is removed.
  }, [])

  const handleDetailClick = React.useCallback((row: AnnualLeave) => {
    setSelectedLog(row)
    setIsDialogOpen(true)
  }, [])

  const tableColumns = React.useMemo(
    () => getColumns(handleEmployeeClick, handleDetailClick),
    [handleEmployeeClick, handleDetailClick]
  )

  const debouncedSearch = useDebounce(filters.search, 500)

  const { items, meta, isLoading } = useAnnualLeaveList({
    search: debouncedSearch,
    page: filters.page,
    per_page: Number(filters.per_page),
    status: filters.status === "all" ? undefined : filters.status,
    start_date: filters.start_date,
    end_date: filters.end_date,
  })

  return (
    <div className="w-full min-w-0 space-y-6">
      <PageHeader
        title="Daftar Cuti Tahunan"
        description="Pantau dan kelola penggunaan cuti tahunan karyawan."
      />

      <ManagementFilter
        setPage={(p) => setFilter("page", p)}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
        perPage={String(filters.per_page)}
        onPerPageChange={(v) => setFilter("per_page", v)}
        search={{
          value: filters.search,
          onChange: (v) => setFilter("search", v),
          placeholder: "Cari nama karyawan atau NIK...",
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
        <Select
          value={filters.status}
          onValueChange={(v) => {
            setFilter("status", v)
            setFilter("page", 1)
          }}
        >
          <SelectTrigger className="h-9 border-border/60 bg-background shadow-none">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="Potong">Potong</SelectItem>
            <SelectItem value="Tambah">Tambah</SelectItem>
          </SelectContent>
        </Select>
      </ManagementFilter>

      <DataTable
        columns={tableColumns}
        data={items}
        isLoading={isLoading}
        pagination={
          meta
            ? {
              ...meta,
              onPageChange: (p) => setFilter("page", p),
            }
            : undefined
        }
      />

      <AnnualLeaveDetailDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        data={selectedLog}
      />
    </div>
  )
}
