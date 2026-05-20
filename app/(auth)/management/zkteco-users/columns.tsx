"use client";

import { ColumnDef } from "@tanstack/react-table";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserCircleIcon,
  FingerAccessIcon,
  MachineRobotIcon,
  Tick01Icon,
  CircleIcon,
  Calendar01Icon,
} from "@hugeicons/core-free-icons";
import { ZktecoUserModel } from "@/modules/attendance/zkteco/types";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<ZktecoUserModel>[] = [
  {
    accessorKey: "uid",
    header: "UID (Machine ID)",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <HugeiconsIcon icon={FingerAccessIcon} size={18} />
        </div>
        <span className="font-mono font-bold text-sm text-foreground">
          {row.original.uid}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Machine Alias",
    cell: ({ row }) => (
      <span className="text-xs font-medium text-muted-foreground uppercase italic">
        {row.original.name || "(Tidak ada nama)"}
      </span>
    ),
  },
  {
    accessorKey: "machine",
    header: "Unit Mesin",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-foreground font-bold">
        <HugeiconsIcon icon={MachineRobotIcon} size={14} className="text-muted-foreground" />
        <span className="text-xs uppercase">
          {row.original.machine?.name || "Machine " + row.original.zkteco_machine_id}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "attendance_user",
    header: "Terhubung Dengan",
    cell: ({ row }) => {
      const user = row.original.attendance_user;
      return (
        <div className="flex flex-col min-w-0">
          <span className={`text-sm font-bold uppercase truncate ${user ? "text-primary" : "text-muted-foreground/50"}`}>
            {user?.employee_name || "Belum Terhubung"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "is_mapped",
    header: "Status Hubungan",
    cell: ({ row }) => {
      const isMapped = row.original.is_mapped;
      return (
        <Badge
          variant={isMapped ? "success" : "secondary"}
          className="gap-1.5 px-2 py-0.5 tracking-widest text-[10px]"
        >
          <HugeiconsIcon
            icon={isMapped ? Tick01Icon : CircleIcon}
            size={12}
            className="shrink-0"
          />
          {isMapped ? "MAPPED" : "UNMAPPED"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Terdeteksi Sejak",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-muted-foreground">
        <HugeiconsIcon icon={Calendar01Icon} size={14} />
        <span className="text-xs font-medium">
          {new Date(row.original.created_at).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })}
        </span>
      </div>
    ),
  },
];
