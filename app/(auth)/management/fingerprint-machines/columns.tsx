"use client";

import { ColumnDef } from "@tanstack/react-table";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AirplayLineIcon,
  WifiIcon,
  LocationIcon,
  ActivityIcon,
  WifiDisconnected01Icon,
  WifiConnected01FreeIcons,
} from "@hugeicons/core-free-icons";
import { ZktecoMachineModel } from "@/modules/attendance/zkteco/types";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<ZktecoMachineModel>[] = [
  {
    accessorKey: "name",
    header: "Nama Mesin",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <HugeiconsIcon icon={AirplayLineIcon} size={18} />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-sm text-foreground truncate uppercase tracking-tight">
            {row.original.name}
          </span>
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
            SN: {row.original.serial_number}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "ip_address",
    header: "Network Detail",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={WifiIcon} size={14} className="text-muted-foreground" />
          <span className="font-mono text-xs font-bold text-foreground">
            {row.original.ip_address}
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground font-medium uppercase">
          Ports: {row.original.soap_port} (SOAP) / {row.original.udp_port} (UDP)
        </span>
      </div>
    ),
  },
  {
    accessorKey: "work_location",
    header: "Lokasi Kerja",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <HugeiconsIcon icon={LocationIcon} size={14} className="text-muted-foreground" />
        <span className="text-xs font-medium uppercase truncate max-w-[150px]">
          {row.original.work_location?.name || "-"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "online",
    header: "Status",
    cell: ({ row }) => {
      const isOnline = row.original.online;
      return (
        <Badge
          variant={isOnline ? "success" : "destructive"}
          className="gap-1.5 px-2 py-0.5"
        >
          <HugeiconsIcon
            icon={isOnline ? WifiConnected01FreeIcons : WifiDisconnected01Icon}
            size={12}
            className="shrink-0"
          />
          {isOnline ? "ONLINE" : "OFFLINE"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "updated_at",
    header: "Last Sync",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <HugeiconsIcon icon={ActivityIcon} size={14} className="text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">
          {new Date(row.original.updated_at).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>
    ),
  },
];
