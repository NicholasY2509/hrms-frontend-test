"use client"

import { ShiftExchange } from "@/modules/shift-exchange/types"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { EyeIcon, ProfileIcon } from "@hugeicons/core-free-icons"
import { ColumnDef } from "@tanstack/react-table"

export const getShiftExchangeColumns = (
  onView: (item: ShiftExchange) => void
): ColumnDef<ShiftExchange>[] => [
  {
    accessorKey: "employee.name",
    header: "Nama Karyawan",
    cell: ({ row }) => {
      const employee = row.original.employee
      if (!employee) return "-"

      return (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.employee.name}</span>
          <span className="text-xs text-muted-foreground">
            NIK: {row.original.employee.nik}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "date",
    header: "Tanggal",
    cell: ({ row }) => {
      const date = row.original.date
      return date ? format(new Date(date), "dd MMM yyyy", { locale: id }) : "-"
    },
  },
  {
    accessorKey: "original_working_hour",
    header: "Jam Kerja Awal",
    cell: ({ row }) => (
      <div>
        <div className="flex flex-col">
          <span className="font-medium">
            {row.original.original_working_hour?.name}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {row.original.original_working_hour?.clock_in} -{" "}
            {row.original.original_working_hour?.clock_out}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "requested_working_hour",
    header: "Jam Kerja Pengganti",
    cell: ({ row }) => (
      <div>
        <div className="flex flex-col">
          <span className="font-medium">
            {row.original.requested_working_hour?.name}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {row.original.requested_working_hour?.clock_in} -{" "}
            {row.original.requested_working_hour?.clock_out}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "exchange_with_employee",
    header: "Ditukar Dengan",
    cell: ({ row }) => {
      const employee = row.original.exchange_with_employee
      if (!employee) return "-"

      return (
        <div className="flex flex-col">
          <span className="font-medium">{employee.name}</span>
          <span className="text-xs text-muted-foreground">{employee.nik}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status
      if (!status) return "-"

      let variant:
        | "default"
        | "secondary"
        | "destructive"
        | "success"
        | "warning" = "default"

      if (status.toLowerCase().includes("pending")) variant = "warning"
      else if (
        status.toLowerCase().includes("approved") ||
        status.toLowerCase().includes("success") ||
        status.toLowerCase() === "settled"
      )
        variant = "success"
      else if (
        status.toLowerCase().includes("reject") ||
        status.toLowerCase().includes("cancel")
      )
        variant = "destructive"

      return <Badge variant={variant}>{status}</Badge>
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => (
      <Button variant="ghost" size="icon" onClick={() => onView(row.original)}>
        <HugeiconsIcon icon={ProfileIcon} size={14} className="mr-2" />
      </Button>
    ),
  },
]
