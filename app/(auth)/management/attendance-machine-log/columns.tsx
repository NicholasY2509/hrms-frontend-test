"use client"

import { ColumnDef } from "@tanstack/react-table"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Calendar01Icon,
  Clock01Icon,
  MachineRobotIcon,
  UserCircleIcon,
  Tick01Icon,
  CircleIcon,
} from "@hugeicons/core-free-icons"
import { ZktecoAttendanceModel } from "@/modules/attendance/zkteco/types"
import { format } from "date-fns"
import { id } from "date-fns/locale"

export const columns: ColumnDef<ZktecoAttendanceModel>[] = [
  {
    accessorKey: "attendance_user",
    header: "User / Karyawan",
    cell: ({ row }) => {
      const user = row.original.attendance_user
      return (
        <div className="flex items-center gap-3">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-secondary/20 text-[10px] font-bold text-muted-foreground">
            {row.original.uid}
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-bold tracking-tight text-foreground uppercase">
              {user?.employee_name || "UID: " + row.original.uid}
            </span>
            <span className="text-[10px] font-medium tracking-tighter text-muted-foreground uppercase">
              {user ? `EMP ID: ${user.employee_id}` : "USER TIDAK TERPETAKAN"}
            </span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "attendance_at",
    header: "Waktu Absen",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={Calendar01Icon}
            size={14}
            className="text-muted-foreground"
          />
          <span className="text-xs font-bold text-foreground uppercase">
            {format(new Date(row.original.attendance_at), "EEEE, dd MMM yyyy", {
              locale: id,
            })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={Clock01Icon}
            size={14}
            className="text-muted-foreground"
          />
          <span className="font-mono text-xs font-bold text-primary">
            {row.original.timestamp}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "machine",
    header: "Sumber Mesin",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <HugeiconsIcon
          icon={MachineRobotIcon}
          size={14}
          className="text-muted-foreground"
        />
        <span className="max-w-[150px] truncate text-xs font-medium uppercase">
          {row.original.zkteco_machine?.name ||
            "ID: " + row.original.zkteco_machine_id}
        </span>
      </div>
    ),
  },
  {
    id: "mapping_status",
    header: "Status Pemetaan",
    cell: ({ row }) => {
      const isMapped = !!row.original.attendance_user
      return (
        <div
          className={`flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase ${isMapped ? "text-success" : "text-destructive"}`}
        >
          <HugeiconsIcon icon={isMapped ? Tick01Icon : CircleIcon} size={12} />
          {isMapped ? "TERPETAKAN" : "BELUM TERPETAKAN"}
        </div>
      )
    },
  },
]
