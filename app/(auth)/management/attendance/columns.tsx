"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ProfileIcon,
  UserIcon,
  Calendar01Icon,
  Clock01Icon,
  ClockArrowUpFreeIcons,
  ClockArrowDown,
} from "@hugeicons/core-free-icons"
import { AttendanceModel } from "@/modules/attendance/attendances/types"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Checkbox } from "@/components/ui/checkbox"

export const getAttendanceColumns = (
  onView: (item: AttendanceModel) => void
): ColumnDef<AttendanceModel>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "employee.name",
    header: "Karyawan",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
          <HugeiconsIcon icon={UserIcon} size={16} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {row.original.employee.name}
          </span>
          <span className="text-xs text-muted-foreground">
            NIK: {row.original.employee.nik}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "attendance_at",
    header: "Tanggal",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-sm">
        <HugeiconsIcon
          icon={Calendar01Icon}
          size={14}
          className="text-muted-foreground"
        />
        {format(new Date(row.original.attendance_at), "dd MMM yyyy", {
          locale: id,
        })}
      </div>
    ),
  },
  {
    accessorKey: "working_hour.name",
    header: "Shift",
    cell: ({ row }) => (
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-medium">
          {row.original.working_hour.name}
        </span>
        <span className="text-[10px] text-muted-foreground">
          {row.original.working_hour.clock_in} -{" "}
          {row.original.working_hour.clock_out}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "check_in",
    header: "Check In",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-sm font-medium">
        <HugeiconsIcon
          icon={ClockArrowUpFreeIcons}
          size={14}
          className="text-emerald-500"
        />
        {row.original.check_in || "-"}
      </div>
    ),
  },
  {
    accessorKey: "check_out",
    header: "Check Out",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-sm font-medium">
        <HugeiconsIcon
          icon={ClockArrowDown}
          size={14}
          className="text-rose-500"
        />
        {row.original.check_out || "-"}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status.toLowerCase()
      if (status === "hadir") return <Badge variant="success">Hadir</Badge>
      if (status === "absen") return <Badge variant="destructive">Absen</Badge>
      if (status === "terlambat")
        return <Badge variant="warning">Terlambat</Badge>
      if (status === "off") return <Badge variant="secondary">OFF</Badge>
      if (status === "cuti") return <Badge variant="info">Cuti</Badge>
      if (status === "izin") return <Badge variant="outline">Izin</Badge>
      return <Badge variant="secondary">{row.original.status}</Badge>
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onView(row.original)}
        className="h-8 w-8 transition-colors hover:bg-primary/10 hover:text-primary"
      >
        <HugeiconsIcon icon={ProfileIcon} size={18} />
      </Button>
    ),
  },
]
