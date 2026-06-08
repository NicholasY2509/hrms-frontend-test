"use client"

import * as React from "react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { useAnnualLeaveList } from "../hooks/use-annual-leave"
import { DataTable } from "@/components/data-table/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { AnnualLeave } from "../types"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { HugeiconsIcon } from "@hugeicons/react"
import { Loading03Icon, InformationCircleIcon } from "@hugeicons/core-free-icons"
import { AnnualLeaveSummaryCard } from "./annual-leave-summary-card"

interface EmployeeLeaveLedgerSheetProps {
  employeeId: number | null
  employeeName?: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EmployeeLeaveLedgerSheet({
  employeeId,
  employeeName,
  open,
  onOpenChange,
}: EmployeeLeaveLedgerSheetProps) {
  const { items, isLoading } = useAnnualLeaveList(
    open && employeeId ? { employee_id: employeeId, per_page: 100 } : undefined
  )

  const columns = React.useMemo<ColumnDef<AnnualLeave>[]>(() => [
    {
      accessorKey: "annual_leave_at",
      header: "Tanggal",
      cell: ({ row }) => {
        const date = row.getValue("annual_leave_at") as string
        return (
          <span className="text-sm whitespace-nowrap">
            {format(new Date(date), "dd MMM yyyy", { locale: id })}
          </span>
        )
      },
    },
    {
      accessorKey: "description",
      header: "Keterangan",
      cell: ({ row }) => (
        <div className="max-w-[200px] text-xs wrap-break-word whitespace-normal text-muted-foreground">
          {row.getValue("description")}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Tipe",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge
            variant={status === "Potong" ? "destructive" : "default"}
            className="capitalize"
          >
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "total",
      header: "Mutasi",
      cell: ({ row }) => {
        const total = row.getValue("total") as number
        const status = row.original.status
        const prefix = status === "Potong" ? "-" : "+"
        const colorClass = status === "Potong" ? "text-destructive" : "text-green-600 dark:text-green-400"
        const details = row.original.deduction_details

        return (
          <div className="flex items-center gap-2">
            <span className={`font-mono font-medium ${colorClass}`}>
              {prefix}{total}
            </span>
            {details && details.length > 0 && (
              <Popover>
                <PopoverTrigger asChild>
                  <button className="text-muted-foreground hover:text-foreground">
                    <HugeiconsIcon icon={InformationCircleIcon} className="w-4 h-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-3" align="center">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-foreground mb-1">Rincian Mutasi</p>
                    {details.map((d, i) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Cuti {d.year}</span>
                        <span className={`font-mono ${colorClass}`}>{prefix}{d.amount}</span>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        )
      },
    },
    {
      id: "balance_before",
      header: "Saldo Awal",
      cell: ({ row }) => {
        const balanceBefore = row.original.balance_before
        if (!balanceBefore) return <span className="text-muted-foreground">-</span>
        const totalBalance = Object.values(balanceBefore).reduce((a, b) => a + Number(b), 0)
        const date = new Date(row.original.annual_leave_at)
        const currentYear = date.getFullYear()

        return (
          <div className="flex items-center gap-2">
            <span className="font-mono font-medium text-muted-foreground">
              {totalBalance}
            </span>
            {Object.keys(balanceBefore).length > 0 && (
              <Popover>
                <PopoverTrigger asChild>
                  <button className="text-muted-foreground hover:text-foreground">
                    <HugeiconsIcon icon={InformationCircleIcon} className="w-4 h-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-3" align="center">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-foreground mb-1">Rincian Saldo Awal</p>
                    {Object.entries(balanceBefore).map(([key, amount]) => {
                      let displayYear = key
                      const numKey = Number(key)
                      if (!isNaN(numKey) && numKey < 100) {
                        displayYear = String(currentYear - 1 + numKey)
                      }
                      return (
                        <div key={key} className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">Sisa {displayYear}</span>
                          <span className="font-mono">{amount}</span>
                        </div>
                      )
                    })}
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        )
      },
    },
    {
      id: "balance_after",
      header: "Saldo Akhir",
      cell: ({ row }) => {
        const balanceAfter = row.original.balance_after
        if (!balanceAfter) return <span className="text-muted-foreground">-</span>
        const totalBalance = Object.values(balanceAfter).reduce((a, b) => a + Number(b), 0)
        const date = new Date(row.original.annual_leave_at)
        const currentYear = date.getFullYear()

        return (
          <div className="flex items-center gap-2">
            <span className="font-mono font-medium">
              {totalBalance}
            </span>
            {Object.keys(balanceAfter).length > 0 && (
              <Popover>
                <PopoverTrigger asChild>
                  <button className="text-muted-foreground hover:text-foreground">
                    <HugeiconsIcon icon={InformationCircleIcon} className="w-4 h-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-3" align="center">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-foreground mb-1">Rincian Saldo Akhir</p>
                    {Object.entries(balanceAfter).map(([key, amount]) => {
                      let displayYear = key
                      const numKey = Number(key)
                      if (!isNaN(numKey) && numKey < 100) {
                        displayYear = String(currentYear - 1 + numKey)
                      }
                      return (
                        <div key={key} className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">Sisa {displayYear}</span>
                          <span className="font-mono">{amount}</span>
                        </div>
                      )
                    })}
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        )
      },
    },
  ], [])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[90vw]! sm:max-w-5xl! p-0 flex flex-col">
        <SheetHeader className="p-6 pb-2">
          <SheetTitle>Mutasi Hak Cuti</SheetTitle>
          <SheetDescription>
            Riwayat mutasi cuti tahunan untuk karyawan <span className="font-semibold text-foreground">{employeeName || "-"}</span>.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto lg:overflow-hidden px-6 pb-6 pt-2 flex flex-col lg:flex-row gap-6">
          {employeeId && (
            <div className="shrink-0 lg:w-[300px] xl:w-[350px] lg:overflow-y-auto pr-1">
              <AnnualLeaveSummaryCard employeeId={employeeId} />
            </div>
          )}

          <div className="flex-1 flex flex-col min-h-[400px] lg:min-h-0 min-w-0">
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <HugeiconsIcon icon={Loading03Icon} className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="flex-1 min-h-0 overflow-y-auto px-1 pb-4">
                <DataTable
                  columns={columns}
                  data={items || []}
                // Tidak perlu pagination karena per_page 100 dan biasanya cukup untuk ledger 1 orang
                />
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
