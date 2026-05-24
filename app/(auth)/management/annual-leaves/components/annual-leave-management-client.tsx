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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function AnnualLeaveManagementClient() {
  const { filters, setFilter, resetFilters, hasActiveFilters } = useUrlFilters({
    page: 1,
    per_page: 15,
    search: "",
    status: "all",
    start_date: undefined as string | undefined,
    end_date: undefined as string | undefined,
  })

  const [selectedEmployee, setSelectedEmployee] = React.useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  const handleEmployeeClick = React.useCallback((employee: any) => {
    setSelectedEmployee(employee)
    setIsDialogOpen(true)
  }, [])

  const tableColumns = React.useMemo(
    () => getColumns(handleEmployeeClick),
    [handleEmployeeClick]
  )

  const debouncedSearch = useDebounce(filters.search, 500)

  // Fetch Annual Leaves with all filters
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sisa Cuti - {selectedEmployee?.name}</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border bg-muted/20 p-4">
                  <div className="text-sm font-medium text-muted-foreground">
                    Cuti Tahun Lalu
                  </div>
                  <div className="mt-1.5 text-3xl font-semibold text-foreground">
                    {selectedEmployee.annual_leave_2 ?? 0}
                  </div>
                </div>
                <div className="rounded-xl border bg-muted/20 p-4">
                  <div className="text-sm font-medium text-muted-foreground">
                    Cuti Tahun Ini
                  </div>
                  <div className="mt-1.5 text-3xl font-semibold text-foreground">
                    {selectedEmployee.annual_leave_3 ?? 0}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
