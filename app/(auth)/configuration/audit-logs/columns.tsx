"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AuditLog } from "@/modules/audit/types";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Eye } from "@hugeicons/core-free-icons";

export const getColumns = (onView: (log: AuditLog) => void): ColumnDef<AuditLog>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "created_at",
    header: "Time",
    cell: ({ row }) => {
      const date = new RowDate(row.original.created_at);
      return (
        <div className="flex flex-col">
          <span className="font-medium text-sm">
            {row.original.human_time}
          </span>
          <span className="text-xs text-muted-foreground">
            {row.original.created_at}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "event",
    header: "Event",
    cell: ({ row }) => {
      const event = row.original.event;
      let variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" = "outline";

      switch (event) {
        case "created":
          variant = "success";
          break;
        case "updated":
          variant = "warning";
          break;
        case "deleted":
          variant = "destructive";
          break;
        default:
          variant = "outline";
      }

      return (
        <Badge variant={variant} className="capitalize">
          {event}
        </Badge>
      );
    },
  },
  {
    accessorKey: "log_name",
    header: "Log Name",
    cell: ({ row }) => <span className="capitalize">{row.original.log_name}</span>
  },
  {
    accessorKey: "causer.name",
    header: "Causer",
    cell: ({ row }) => row.original.causer?.name || "System",
  },
  {
    accessorKey: "subject_type",
    header: "Subject",
    cell: ({ row }) => {
      const type = row.original.subject_type.split("\\").pop();
      return (
        <div className="flex flex-col">
          <span className="font-medium">{type}</span>
          <span className="text-xs text-muted-foreground">ID: {row.original.subject_id}</span>
        </div>
      );
    }
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Button variant="ghost" size="icon" onClick={() => onView(row.original)}>
        <HugeiconsIcon icon={Eye} className="h-4 w-4" />
      </Button>
    ),
  },
];

class RowDate extends Date {
  constructor(date: string) {
    super(date);
  }
}
