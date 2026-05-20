"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Overtime } from "@/modules/overtime/types";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export const columns: ColumnDef<Overtime>[] = [
  {
    accessorKey: "date",
    header: "Tanggal",
    cell: ({ row }) => format(new Date(row.original.date), "dd MMMM yyyy", { locale: id }),
  },
  {
    accessorKey: "overtime_type.name",
    header: "Jenis",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-xs text-muted-foreground">
          {typeof row.original.overtime_type === 'string'
            ? row.original.overtime_type
            : row.original.overtime_type?.name || "-"}
        </span>
        <span className="font-semibold text-sm">
          {typeof row.original.overtime_type === 'string'
            ? (row.original.overtime_type === "UMUM" ? "Lembur Umum" : row.original.overtime_type)
            : (row.original.overtime_type?.id === null ? "Lembur Umum" : row.original.overtime_type?.name)}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "start_time",
    header: "Waktu",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="font-mono">{row.original.start_time.slice(0, 5)}</Badge>
        <span>-</span>
        <Badge variant="outline" className="font-mono">{row.original.finish_time.slice(0, 5)}</Badge>
      </div>
    ),
  },
  {
    accessorKey: "total_time",
    header: "Total",
    cell: ({ row }) => <span className="font-medium">{row.original.total_time} Jam</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status.toLowerCase();
      let variant: "default" | "secondary" | "destructive" | "outline" | "warning" | "success" = "outline";

      if (status.includes("approved")) variant = "success";
      if (status.includes("rejected")) variant = "destructive";
      if (status.includes("settled")) variant = "secondary";
      if (status.includes("pending")) variant = "warning";

      return <Badge variant={variant} className="whitespace-nowrap">{row.original.status}</Badge>;
    },
  },
];
