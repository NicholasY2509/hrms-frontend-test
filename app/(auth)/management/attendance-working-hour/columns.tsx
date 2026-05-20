"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
  Calendar01Icon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";
import { WorkingHourModel } from "@/modules/attendance/working-hours/types";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { isValid } from "date-fns";

import { PencilEdit01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

const safeFormat = (dateStr: string | null | undefined, formatStr: string) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (!isValid(date)) return "-";
  return format(date, formatStr, { locale: id });
};

export const getColumns = (
  onEdit: (item: WorkingHourModel) => void
): ColumnDef<WorkingHourModel>[] => [
  {
    accessorKey: "employee.name",
    header: "Karyawan",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8 border">
          <AvatarImage src={row.original.employee?.photo_url || ""} alt={row.original.employee?.name} />
          <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
            {row.original.employee?.name?.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0">
          <span className="font-medium text-sm truncate">{row.original.employee?.name}</span>
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">
            {row.original.employee?.nik} • {row.original.employee?.position.name}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: "Tanggal",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-sm">
        <HugeiconsIcon icon={Calendar01Icon} size={14} className="text-muted-foreground shrink-0" />
        <span className="whitespace-nowrap font-medium">
          {safeFormat(row.original.date, "EEEE, dd MMM yyyy")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "working_hour.name",
    header: "Jadwal",
    cell: ({ row }) => {
      const isOff = row.original.working_hour.name.toLowerCase() === "off";
      return (
        <div className="flex flex-col gap-0.5">
          <Badge variant={isOff ? "destructive" : "outline"} className="w-fit text-[10px] py-0 px-1.5 h-4 uppercase font-bold tracking-tighter">
            {row.original.working_hour.name}
          </Badge>
          {!isOff && (
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
              <HugeiconsIcon icon={Clock01Icon} size={10} />
              {row.original.working_hour.clock_in} - {row.original.working_hour.clock_out}
            </div>
          )}
        </div>
      );
    },
  },
  {
    id: "shift_window",
    header: "Shift Window",
    cell: ({ row }) => {
      const isOff = row.original.working_hour.name.toLowerCase() === "off";
      if (isOff) return <span className="text-muted-foreground text-xs italic">-</span>;

      return (
        <div className="flex flex-col gap-0.5 text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground font-medium w-7">Start:</span>
            <span className="font-bold text-foreground">
              {safeFormat(row.original.shift_start, "HH:mm")}
            </span>
            <span className="text-[9px] text-muted-foreground italic">
              ({safeFormat(row.original.shift_start, "dd MMM")})
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground font-medium w-7">End:</span>
            <span className="font-bold text-foreground">
              {safeFormat(row.original.shift_end, "HH:mm")}
            </span>
            <span className="text-[9px] text-muted-foreground italic">
              ({safeFormat(row.original.shift_end, "dd MMM")})
            </span>
          </div>
        </div>
      )
    }
  },
  {
    accessorKey: "attendance",
    header: "Status Kehadiran",
    cell: ({ row }) => {
      const attendance = row.original.attendance;
      if (!attendance) return <Badge variant="secondary" className="text-[10px] py-0 px-1.5 h-4 opacity-50 font-bold tracking-tighter uppercase">No Data</Badge>;

      const status = attendance.status?.toLowerCase();
      let variant: any = "secondary";
      if (status === "hadir") variant = "success";
      else if (status === "absen") variant = "destructive";
      else if (status === "terlambat") variant = "warning";

      return (
        <Badge variant={variant} className="text-[10px] py-0 px-1.5 h-4 uppercase font-bold tracking-tighter">
          {attendance.status || "-"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
        onClick={() => onEdit(row.original)}
      >
        <HugeiconsIcon icon={PencilEdit01Icon} size={16} />
      </Button>
    ),
  },
];
