"use client";

import { ColumnDef } from "@tanstack/react-table";
import { UnpaidLeaveType } from "@/modules/unpaid-leave/types";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { Check, X, PencilEdit01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

export const getColumns = (
  onEdit: (item: UnpaidLeaveType) => void,
  onDelete: (item: UnpaidLeaveType) => void
): ColumnDef<UnpaidLeaveType>[] => [
  {
    accessorKey: "name",
    header: "Nama",
    cell: ({ row }) => {
      const type = row.original;
      return (
        <div className="flex items-center gap-2">
          <span className="font-medium">{type.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "limit",
    header: "Batas (Hari)",
    cell: ({ row }) => row.getValue("limit") ?? "-",
  },
  {
    accessorKey: "is_annual_leave_deduction",
    header: "Potong Cuti Tahunan",
    cell: ({ row }) => {
      const isDeduction = row.getValue("is_annual_leave_deduction") as boolean;
      return isDeduction ? (
        <Badge variant="destructive" className="gap-1">
          <HugeiconsIcon icon={Check} size={14} /> Ya
        </Badge>
      ) : (
        <Badge variant="secondary" className="gap-1 text-muted-foreground">
          <HugeiconsIcon icon={X} size={14} /> Tidak
        </Badge>
      );
    },
  },
  {
    id: "preview",
    header: "Preview Label",
    cell: ({ row }) => {
      const type = row.original;
      return (
        <Badge
          style={{
            backgroundColor: type.background_color,
            color: type.text_color,
            borderColor: type.border_color,
            borderWidth: "1px",
            borderStyle: "solid",
          }}
        >
          {type.name}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
          onClick={() => onEdit(row.original)}
        >
          <HugeiconsIcon icon={PencilEdit01Icon} size={14} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
          onClick={() => onDelete(row.original)}
        >
          <HugeiconsIcon icon={Delete02Icon} size={14} />
        </Button>
      </div>
    ),
  },
];
