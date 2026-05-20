"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Holiday } from "@/modules/unpaid-leave/types";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import { MoreHorizontal, PencilEdit01Icon, Trash } from "@hugeicons/core-free-icons";

interface ColumnProps {
  onEdit: (holiday: Holiday) => void;
  onDelete: (holiday: Holiday) => void;
}

export const getColumns = ({ onEdit, onDelete }: ColumnProps): ColumnDef<Holiday>[] => [
  {
    accessorKey: "date",
    header: "Tanggal",
    cell: ({ row }) => {
      const date = row.getValue("date") as string;
      return format(new Date(date), "dd MMMM yyyy", { locale: id });
    },
  },
  {
    accessorKey: "name",
    header: "Nama Hari Libur",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const holiday = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <HugeiconsIcon icon={MoreHorizontal} className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(holiday)}>
              <HugeiconsIcon icon={PencilEdit01Icon} className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => onDelete(holiday)}
            >
              <HugeiconsIcon icon={Trash} className="mr-2 h-4 w-4" />
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
