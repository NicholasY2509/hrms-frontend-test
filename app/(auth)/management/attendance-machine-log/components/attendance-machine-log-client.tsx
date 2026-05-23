"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ReloadFreeIcons, Search01Icon } from "@hugeicons/core-free-icons"
import { DataTable } from "@/components/data-table/data-table"
import { PageHeader } from "@/components/layout/page-header"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { format } from "date-fns"
import { useUrlFilters } from "@/hooks/use-url-filters"
import { useDebounce } from "@/hooks/use-debounce"
import {
  useZktecoAttendances,
  useZktecoMachines,
} from "@/modules/attendance/zkteco/hooks/use-zkteco"
import { columns } from "../columns"
import { ManagementFilter } from "@/components/layout/management-filter"
import { Button } from "@/components/ui/button"
import { ZktecoAttendanceSyncDialog } from "@/modules/attendance/zkteco/components/zkteco-attendance-sync-dialog"

export function AttendanceMachineLogClient() {
  const { filters, setFilter, resetFilters, hasActiveFilters } = useUrlFilters({
    page: 1,
    per_page: 15,
    search: "",
    machine_id: "all",
    start_date: undefined as string | undefined,
    end_date: undefined as string | undefined,
  })

  const [isSyncDialogOpen, setIsSyncDialogOpen] = React.useState(false)

  const debouncedSearch = useDebounce(filters.search, 500)

  const { items, meta, isLoading } = useZktecoAttendances({
    search: debouncedSearch,
    start_date: filters.start_date,
    end_date: filters.end_date,
    zkteco_machine_id:
      filters.machine_id === "all" || !filters.machine_id ? undefined : Number(filters.machine_id),
    page: filters.page,
    per_page: Number(filters.per_page),
  })

  const { machines, isLoadingMachines } = useZktecoMachines()

  const handleSync = () => {
    setIsSyncDialogOpen(true)
  }

  return (
    <div className="w-full min-w-0 space-y-6">
      <div className="flex flex-row items-center justify-between">
        <PageHeader
          title="Log Absensi Mesin"
          description="Data mentah transaksi absen yang ditarik langsung dari mesin fingerprint biometrik."
        />

        <Button onClick={handleSync} className="gap-2">
          <HugeiconsIcon icon={ReloadFreeIcons} size={18} />
          Tarik Data Absensi
        </Button>
      </div>

      <ManagementFilter
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
        perPage={String(filters.per_page)}
        onPerPageChange={(v) => setFilter("per_page", v)}
        search={{ value: filters.search, onChange: (v) => setFilter("search", v), placeholder: "Cari UID atau nama..." }}
        startDate={{ value: filters.start_date ? new Date(filters.start_date) : undefined, onChange: (d) => setFilter("start_date", d ? format(d, "yyyy-MM-dd") : undefined), placeholder: "Tanggal Mulai" }}
        endDate={{ value: filters.end_date ? new Date(filters.end_date) : undefined, onChange: (d) => setFilter("end_date", d ? format(d, "yyyy-MM-dd") : undefined), placeholder: "Tanggal Selesai" }}
      >
        <Select
          value={String(filters.machine_id)}
          onValueChange={(v) => setFilter("machine_id", v)}
          disabled={isLoadingMachines}
        >
          <SelectTrigger>
            <SelectValue placeholder="Semua Mesin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Mesin</SelectItem>
            {machines.map((machine: any) => (
              <SelectItem key={machine.id} value={String(machine.id)}>
                {machine.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </ManagementFilter>

      <DataTable
        columns={columns}
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

      <ZktecoAttendanceSyncDialog
        open={isSyncDialogOpen}
        onOpenChange={setIsSyncDialogOpen}
      />
    </div>
  )
}
