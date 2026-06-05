"use client"

import * as React from "react"
import { DataTable } from "@/components/data-table/data-table"
import { useDebounce } from "@/hooks/use-debounce"
import { useAnnualLeaveSummaryList } from "@/modules/employee/annual-leave/hooks/use-annual-leave"
import { ManagementFilter } from "@/components/layout/management-filter"
import { useUrlFilters } from "@/hooks/use-url-filters"
import { ColumnDef } from "@tanstack/react-table"
import { EmployeeLeaveLedgerSheet } from "@/modules/employee/annual-leave/components/employee-leave-ledger-sheet"

export function AnnualLeaveSummaryClient() {
  const { filters, setFilter, resetFilters, hasActiveFilters } = useUrlFilters({
    page: 1,
    per_page: 15,
    search: "",
    year: new Date().getFullYear().toString(),
  })

  const [ledgerEmployeeId, setLedgerEmployeeId] = React.useState<number | null>(null)
  const [ledgerEmployeeName, setLedgerEmployeeName] = React.useState<string>("")
  const [isLedgerOpen, setIsLedgerOpen] = React.useState(false)

  const debouncedSearch = useDebounce(filters.search, 500)

  const { items, meta, isLoading } = useAnnualLeaveSummaryList({
    search: debouncedSearch,
    page: filters.page,
    per_page: Number(filters.per_page),
    year: filters.year,
  })

  const handleEmployeeClick = (id: number, name: string) => {
    setLedgerEmployeeId(id)
    setLedgerEmployeeName(name)
    setIsLedgerOpen(true)
  }

  const columns: ColumnDef<any>[] = React.useMemo(() => {
    const currentYear = Number(filters.year) || new Date().getFullYear()
    const lastYear = currentYear - 1

    return [
      {
        accessorKey: "employee",
        header: "Karyawan",
        cell: ({ row }) => (
          <div 
            className="flex flex-col gap-1 cursor-pointer group"
            onClick={() => handleEmployeeClick(row.original.id, row.original.name)}
          >
            <span className="font-medium group-hover:text-primary transition-colors">
              {row.original.name}
            </span>
            <span className="text-xs text-muted-foreground">{row.original.nik}</span>
          </div>
        ),
      },
      {
        id: "saldo_awal",
        header: "Saldo Awal Tahun",
        cell: ({ row }) => {
          const bb = row.original.balance_before
          if (!bb) return <span className="text-muted-foreground italic text-xs">Belum ada mutasi</span>
          
          return (
            <div className="flex flex-col gap-0.5 text-xs">
              <span className="text-muted-foreground">Sisa {lastYear}: <span className="font-mono text-foreground">{bb[lastYear] ?? 0}</span></span>
              <span className="text-muted-foreground">Sisa {currentYear}: <span className="font-mono text-foreground">{bb[currentYear] ?? 0}</span></span>
              <span className="font-medium mt-1 pt-1 border-t">
                Total: <span className="font-mono">{Number(bb[lastYear] ?? 0) + Number(bb[currentYear] ?? 0)}</span>
              </span>
            </div>
          )
        }
      },
      {
        id: "mutasi",
        header: "Mutasi Tahun Ini",
        cell: ({ row }) => {
          return (
            <div className="flex flex-col gap-0.5 text-xs">
              <span className="text-muted-foreground">Potong: <span className="font-mono text-destructive">{row.original.total_potong}</span></span>
              <span className="text-muted-foreground">Tambah: <span className="font-mono text-emerald-500">{row.original.total_tambah}</span></span>
            </div>
          )
        }
      },
      {
        id: "saldo_akhir",
        header: "Saldo Sekarang",
        cell: ({ row }) => {
          const ba = row.original.balance_after
          return (
            <div className="flex flex-col gap-0.5 text-xs">
              <span className="text-muted-foreground">Sisa {lastYear}: <span className="font-mono text-foreground">{ba?.annual_leave_2 ?? 0}</span></span>
              <span className="text-muted-foreground">Sisa {currentYear}: <span className="font-mono text-foreground">{ba?.annual_leave_3 ?? 0}</span></span>
              <span className="font-medium mt-1 pt-1 border-t">
                Total: <span className="font-mono">{Number(ba?.annual_leave_2 ?? 0) + Number(ba?.annual_leave_3 ?? 0)}</span>
              </span>
            </div>
          )
        }
      }
    ]
  }, [filters.year])

  return (
    <div className="space-y-4">
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
      />

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

      <EmployeeLeaveLedgerSheet
        employeeId={ledgerEmployeeId}
        employeeName={ledgerEmployeeName}
        open={isLedgerOpen}
        onOpenChange={setIsLedgerOpen}
      />
    </div>
  )
}
