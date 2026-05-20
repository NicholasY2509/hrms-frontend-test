"use client";

import { ColumnDef } from "@tanstack/react-table";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar01Icon,
  Clock01Icon,
  LocationIcon,
  SmartPhone01Icon,
  Image01Icon,
  UserCircleIcon,
  PinLocationIcon,
} from "@hugeicons/core-free-icons";
import { MobileScanModel } from "@/modules/attendance/mobile-scans/types";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImagePreview } from "@/components/ui/image-preview";
import { Skeleton } from "@/components/ui/skeleton";

export const columns: ColumnDef<MobileScanModel>[] = [
  {
    accessorKey: "employee_id",
    header: "Karyawan",
    cell: ({ row }) => {
      const employee = row.original.employee;
      return (
        <div className="flex items-center gap-3">
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-sm text-foreground truncate uppercase tracking-tight">
              {employee?.name || "Employee ID: " + row.original.employee_id}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
              {employee?.nik || "NIK TIDAK TERSEDIA"}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "scan_type",
    header: "Tipe",
    cell: ({ row }) => {
      const type = row.original.scan_type;
      return (
        <Badge variant={type === "in" ? "success" : "warning"} className="uppercase text-[10px] font-bold">
          {type === "in" ? "Masuk" : "Pulang"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "scan_time",
    header: "Waktu Absen",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={Calendar01Icon} size={14} className="text-muted-foreground" />
          <span className="text-xs font-bold text-foreground uppercase">
            {format(new Date(row.original.created_at), "EEEE, dd MMM yyyy", { locale: id })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={Clock01Icon} size={14} className="text-muted-foreground" />
          <span className="text-xs font-mono font-bold text-primary">
            {row.original.scan_time}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "location",
    header: "Lokasi",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={LocationIcon} size={14} className="text-muted-foreground" />
          <span className="text-xs font-medium uppercase truncate max-w-[150px]">
            {row.original.location?.name || "Lokasi tidak diketahui"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={PinLocationIcon} size={14} className="text-muted-foreground" />
          <span className="text-[10px] font-mono text-muted-foreground">
            {row.original.latitude}, {row.original.longitude}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "photo",
    header: "Foto",
    cell: ({ row }) => {
      const src = row.original.photo;
      return (
        <ImagePreview src={src}>
          <Avatar className="size-10 hover:opacity-80 transition-opacity cursor-pointer">
            <AvatarImage src={src || ""} className="object-cover" />
            <AvatarFallback className="rounded-lg bg-transparent border-none">
              <Skeleton className="size-full rounded-lg" />
            </AvatarFallback>
          </Avatar>
        </ImagePreview>
      );
    },
  },
  {
    accessorKey: "device_id",
    header: "Perangkat",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <HugeiconsIcon icon={SmartPhone01Icon} size={14} className="text-muted-foreground" />
        <span className="text-[10px] font-mono text-muted-foreground truncate max-w-[100px]">
          {row.original.device_id || "N/A"}
        </span>
      </div>
    ),
  },
];
