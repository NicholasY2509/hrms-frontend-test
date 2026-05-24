"use client";

import { ColumnDef } from "@tanstack/react-table";
import { TaskLog } from "@/modules/audit/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Eye } from "@hugeicons/core-free-icons";

export const getColumns = (onView: (log: TaskLog) => void): ColumnDef<TaskLog>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "created_at",
    header: "Time",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="font-medium text-sm">
            {new Date(row.original.created_at).toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground">
            {row.original.created_at}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <span className="capitalize">{row.original.type.replace(/_/g, " ")}</span>
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      let variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" = "outline";

      switch (status) {
        case "completed":
          variant = "success";
          break;
        case "processing":
          variant = "warning";
          break;
        case "failed":
          variant = "destructive";
          break;
        case "pending":
          variant = "secondary";
          break;
        default:
          variant = "outline";
      }

      return (
        <Badge variant={variant} className="capitalize">
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => (
      <span className="max-w-[200px] truncate block" title={row.original.message}>
        {row.original.message}
      </span>
    ),
  },
  {
    accessorKey: "user.name",
    header: "User",
    cell: ({ row }) => row.original.user?.name || "System",
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
