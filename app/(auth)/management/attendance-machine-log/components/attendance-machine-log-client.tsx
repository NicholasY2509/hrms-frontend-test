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
import { useDebounce } from "@/hooks/use-debounce"
import {
  useZktecoAttendances,
  useZktecoMachines,
} from "@/modules/attendance/zkteco/hooks/use-zkteco"
import { columns } from "../columns"
import { FilterCard, FilterGrid } from "@/components/layout/filter-card"
import { Button } from "@/components/ui/button"
import { ZktecoAttendanceSyncDialog } from "@/modules/attendance/zkteco/components/zkteco-attendance-sync-dialog"

export function AttendanceMachineLogClient() {
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState("15")
  const [isSyncDialogOpen, setIsSyncDialogOpen] = React.useState(false)

  const [startDate, setStartDate] = React.useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = React.useState<Date | undefined>(undefined)
  const [machineId, setMachineId] = React.useState<string>("")

  const debouncedSearch = useDebounce(search, 500)

  const { items, meta, isLoading } = useZktecoAttendances({
    search: debouncedSearch,
    start_date: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
    end_date: endDate ? format(endDate, "yyyy-MM-dd") : undefined,
    zkteco_machine_id:
      machineId === "all" || !machineId ? undefined : Number(machineId),
    page,
    per_page: Number(perPage),
  })

  const { machines, isLoadingMachines } = useZktecoMachines()

  const handleResetFilters = () => {
    setSearch("")
    setStartDate(undefined)
    setEndDate(undefined)
    setMachineId("")
    setPage(1)
  }

  const handleSync = () => {
    setIsSyncDialogOpen(true)
  }

  const hasActiveFilters =
    search !== "" ||
    !!startDate ||
    !!endDate ||
    (machineId !== "" && machineId !== "all")

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

      <FilterCard
        onReset={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
        perPage={perPage}
        onPerPageChange={setPerPage}
      >
        <FilterGrid cols={4}>
          <InputGroup>
            <InputGroupAddon>
              <HugeiconsIcon
                icon={Search01Icon}
                className="text-muted-foreground"
                size={14}
              />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Cari UID atau nama..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>

          <Select
            value={machineId || "all"}
            onValueChange={(v) => setMachineId(v === "all" ? "" : v)}
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
        pagination={
          meta
            ? {
                ...meta,
                onPageChange: (p) => setPage(p),
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
