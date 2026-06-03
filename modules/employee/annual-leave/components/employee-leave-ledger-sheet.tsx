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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { HugeiconsIcon } from "@hugeicons/react"
import { Loading03Icon } from "@hugeicons/core-free-icons"

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
  // Hanya fetch data jika sheet terbuka dan ada employeeId
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
      header: "Jumlah",
      cell: ({ row }) => {
        const total = row.getValue("total") as number
        const status = row.original.status
        const prefix = status === "Potong" ? "-" : "+"
        const colorClass = status === "Potong" ? "text-destructive" : "text-green-600 dark:text-green-400"
        const details = row.original.deduction_details

        return (
          <div className="flex flex-col gap-1 text-xs min-w-[100px]">
            {details && details.length > 0 ? (
              details.map((d, i) => (
                <div key={i} className="flex justify-between items-center gap-2">
                  <span className="text-muted-foreground">Cuti {d.year}:</span>
                  <span className={`font-mono ${colorClass}`}>{prefix}{d.amount}</span>
                </div>
              ))
            ) : null}
            <div className="flex justify-between items-center gap-2 border-t pt-1 mt-1 font-medium">
              <span>Total:</span>
              <span className={`font-mono text-sm ${colorClass}`}>{prefix}{total}</span>
            </div>
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
          <div className="flex flex-col gap-1 text-xs min-w-[100px]">
            {Object.entries(balanceBefore).map(([key, amount]) => {
              let displayYear = key
              const numKey = Number(key)
              // If key is an array index (0, 1, 2, ...) map it to actual years starting from lastYear
              if (!isNaN(numKey) && numKey < 100) {
                displayYear = String(currentYear - 1 + numKey)
              }

              return (
                <div key={key} className="flex justify-between items-center gap-2">
                  <span className="text-muted-foreground">Sisa {displayYear}:</span>
                  <span className="font-mono">{amount}</span>
                </div>
              )
            })}
            <div className="flex justify-between items-center gap-2 border-t pt-1 mt-1 font-medium">
              <span>Total:</span>
              <span className="font-mono text-sm">{totalBalance}</span>
            </div>
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
          <div className="flex flex-col gap-1 text-xs min-w-[100px]">
            {Object.entries(balanceAfter).map(([key, amount]) => {
              let displayYear = key
              const numKey = Number(key)
              // If key is an array index (0, 1, 2, ...) map it to actual years starting from lastYear
              if (!isNaN(numKey) && numKey < 100) {
                displayYear = String(currentYear - 1 + numKey)
              }

              return (
                <div key={key} className="flex justify-between items-center gap-2">
                  <span className="text-muted-foreground">Sisa {displayYear}:</span>
                  <span className="font-mono">{amount}</span>
                </div>
              )
            })}
            <div className="flex justify-between items-center gap-2 border-t pt-1 mt-1 font-bold">
              <span>Total:</span>
              <span className="font-mono text-sm">{totalBalance}</span>
            </div>
          </div>
        )
      },
    },
  ], [])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="!w-[90vw] sm:!max-w-[1200px] p-0 flex flex-col">
        <SheetHeader className="p-6 pb-2">
          <SheetTitle>Mutasi Hak Cuti</SheetTitle>
          <SheetDescription>
            Riwayat mutasi cuti tahunan untuk karyawan <span className="font-semibold text-foreground">{employeeName || "-"}</span>.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-hidden px-6 pb-6 pt-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <HugeiconsIcon icon={Loading03Icon} className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="h-full rounded-md border">
              <ScrollArea className="h-full">
                <DataTable
                  columns={columns}
                  data={items || []}
                // Tidak perlu pagination karena per_page 100 dan biasanya cukup untuk ledger 1 orang
                />
              </ScrollArea>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
