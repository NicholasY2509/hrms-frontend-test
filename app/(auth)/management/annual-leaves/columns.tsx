"use client"

import { ColumnDef } from "@tanstack/react-table"
import { AnnualLeave } from "@/modules/employee/annual-leave/types"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"

import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { ProfileIcon } from "@hugeicons/core-free-icons"

export const getColumns = (
  onEmployeeClick: (
    employee: AnnualLeave["employee"] & {
      annual_leave_2?: number
      annual_leave_3?: number
    }
  ) => void,
  onDetailClick: (row: AnnualLeave) => void
): ColumnDef<AnnualLeave>[] => [
    {
      accessorKey: "employee.name",
      header: "Karyawan",
      cell: ({ row }) => {
        const { employee } = row.original
        return (
          <div className="flex flex-col items-start gap-0.5">
            <Button
              variant="link"
              className="p-0 hover:cursor-pointer"
              onClick={() => onEmployeeClick(employee as any)}
            >
              {employee.name}
            </Button>
            <span className="text-xs text-muted-foreground">{employee.nik}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "annual_leave_at",
      header: "Tanggal",
      cell: ({ row }) => {
        const date = row.getValue("annual_leave_at") as string
        return (
          <span className="text-sm">
            {format(new Date(date), "dd MMMM yyyy", { locale: id })}
          </span>
        )
      },
    },
    {
      accessorKey: "total",
      header: "Total Hari",
      cell: ({ row }) => {
        const total = row.getValue("total") as number
        return (
          <Badge variant="secondary" className="font-mono">
            {total} Hari
          </Badge>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
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
      accessorKey: "description",
      header: "Keterangan",
      cell: ({ row }) => (
        <div className="max-w-[300px] text-xs wrap-break-word whitespace-normal text-muted-foreground">
          {row.getValue("description")}
        </div>
      ),
    },
    {
      id: "detail",
      header: "Aksi",
      cell: ({ row }) => {
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDetailClick(row.original)}
          >
            <HugeiconsIcon icon={ProfileIcon} className="w-4 h-4 mr-2" /> Detail
          </Button>
        )
      },
    },
  ]
