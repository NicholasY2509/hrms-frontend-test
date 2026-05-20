"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Location01Icon,
  Compass01Icon,
  RulerIcon,
  MoreHorizontalIcon,
  PencilEdit01Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";
import { AttendanceLocationModel } from "@/modules/attendance/locations/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const getColumns = (
  onEdit: (item: AttendanceLocationModel) => void,
  onDelete: (id: number) => void
): ColumnDef<AttendanceLocationModel>[] => [
  {
    accessorKey: "name",
    header: "Nama Lokasi",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-bold text-sm text-foreground uppercase tracking-tight">
          {row.original.name}
        </span>
        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
          Work Location: {row.original.work_location?.name || "-"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "coordinates",
    header: "Koordinat",
    cell: ({ row }) => (
      <div className="flex flex-col gap-0.5 text-[10px] font-mono">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <span className="w-6 font-bold">LAT:</span>
          <span>{row.original.latitude}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <span className="w-6 font-bold">LNG:</span>
          <span>{row.original.longitude}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "distance",
    header: "Radius",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <HugeiconsIcon icon={Compass01Icon} size={14} className="text-primary" />
        <span className="font-bold text-sm">{row.original.distance} M</span>
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const item = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <HugeiconsIcon icon={MoreHorizontalIcon} size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(item)}>
              <HugeiconsIcon icon={PencilEdit01Icon} size={14} className="mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => onDelete(item.id)}
            >
              <HugeiconsIcon icon={Delete02Icon} size={14} className="mr-2" />
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
