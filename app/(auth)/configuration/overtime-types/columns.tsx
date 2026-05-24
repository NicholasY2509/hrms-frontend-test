"use client";

import { ColumnDef } from "@tanstack/react-table";
import { OvertimeType } from "@/modules/overtime/types";
import { formatCurrency } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

export const getColumns = (
  onEdit: (item: OvertimeType) => void,
  onDelete: (item: OvertimeType) => void
): ColumnDef<OvertimeType>[] => [
  {
    accessorKey: "name",
    header: "Kode/Nama",
    cell: ({ row }) => <span className="font-bold">{row.getValue("name")}</span>,
  },
  {
    accessorKey: "description",
    header: "Deskripsi",
  },
  {
    accessorKey: "price",
    header: "Tarif",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      return (
        <span className="font-medium text-primary">
          {formatCurrency(price)}
        </span>
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
