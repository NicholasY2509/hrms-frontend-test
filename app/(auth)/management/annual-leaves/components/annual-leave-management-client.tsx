"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon } from "@hugeicons/core-free-icons"
import { DataTable } from "@/components/data-table/data-table"
import { PageHeader } from "@/components/layout/page-header"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { useDebounce } from "@/hooks/use-debounce"
import { useAnnualLeaveList } from "@/modules/employee/annual-leave/hooks/use-annual-leave"
import { getColumns } from "../columns"
import { FilterCard, FilterGrid } from "@/components/layout/filter-card"
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
  // Filters State
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState("15")
  const [status, setStatus] = React.useState<string>("all")

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

  const debouncedSearch = useDebounce(search, 500)

  // Fetch Annual Leaves with all filters
  const { items, meta, isLoading } = useAnnualLeaveList({
    search: debouncedSearch,
    page,
    per_page: Number(perPage),
    status: status === "all" ? undefined : status,
  })

  const handleResetFilters = () => {
    setSearch("")
    setStatus("all")
    setPage(1)
  }

  const hasActiveFilters = search !== "" || status !== "all"

  return (
    <div className="w-full min-w-0 space-y-6">
      <PageHeader
        title="Daftar Cuti Tahunan"
        description="Pantau dan kelola penggunaan cuti tahunan karyawan."
      />

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
              placeholder="Cari nama karyawan atau NIK..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-9 border-border/60 bg-background shadow-none">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="Potong">Potong</SelectItem>
              <SelectItem value="Tambah">Tambah</SelectItem>
            </SelectContent>
          </Select>
        </FilterGrid>
      </FilterCard>

      <DataTable
        columns={tableColumns}
        data={items}
        isLoading={isLoading}
        pagination={
          meta
            ? {
                ...meta,
                onPageChange: (p) => setPage(p),
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
