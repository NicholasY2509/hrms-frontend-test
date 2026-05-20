"use client";

import { ColumnDef } from "@tanstack/react-table";
import { UnpaidLeave } from "@/modules/unpaid-leave/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ProfileIcon } from "@hugeicons/core-free-icons";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export const getColumns = (
  onView: (leave: UnpaidLeave) => void
): ColumnDef<UnpaidLeave>[] => [
    {
      accessorKey: "type.name",
      header: "Tipe Izin",
      cell: ({ row }) => row.original.type?.name || "-",
    },
    {
      header: "Tanggal",
      cell: ({ row }) => {
        const leave = row.original;
        return (
          <span className="whitespace-nowrap">
            {format(new Date(leave.start_date), "dd MMM yyyy", { locale: id })} -{" "}
            {format(new Date(leave.end_date), "dd MMM yyyy", { locale: id })}
          </span>
        );
      },
    },
    {
      accessorKey: "total_days",
      header: "Durasi",
      cell: ({ row }) => `${row.original.total_days} Hari`,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status.toLowerCase();
        let className = "capitalize ";

        if (status.includes("approved") || status.includes("settled")) {
          className += "bg-success/10 text-success border-success/20";
        } else if (status.includes("pending")) {
          className += "bg-warning/10 text-warning border-warning/20";
        } else if (status.includes("rejected")) {
          className += "bg-destructive/10 text-destructive border-destructive/20";
        } else {
          className += "bg-muted text-muted-foreground border-muted-foreground/20";
        }

        return (
          <Badge variant="outline" className={className}>
            {row.original.status}
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
          className="h-8 w-8 text-muted-foreground hover:text-primary"
          onClick={() => onView(row.original)}
        >
          <HugeiconsIcon icon={ProfileIcon} className="h-4 w-4" />
        </Button>
      ),
    },
  ];
