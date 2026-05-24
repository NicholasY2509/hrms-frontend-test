"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Clock01Icon,
  Calendar01Icon,
} from "@hugeicons/core-free-icons";
import { MasterWorkingHourModel } from "@/modules/attendance/working-hours/types";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontalIcon,
  PencilEdit01Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";

export const getColumns = (
  onEdit: (item: MasterWorkingHourModel) => void,
  onDelete: (id: number) => void
): ColumnDef<MasterWorkingHourModel>[] => [
    {
      accessorKey: "name",
      header: "Nama Jam Kerja",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className=" text-sm text-foreground uppercase tracking-tight">
            {row.original.name}
          </span>
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
            ID: {row.original.id}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "clock_in",
      header: "Jam Masuk",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={Clock01Icon} size={14} className="text-success" />
          <span className="font-mono  text-sm">{row.original.clock_in}</span>
        </div>
      ),
    },
    {
      accessorKey: "clock_out",
      header: "Jam Pulang",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={Clock01Icon} size={14} className="text-destructive" />
          <span className="font-mono  text-sm">{row.original.clock_out}</span>
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Dibuat Pada",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <HugeiconsIcon icon={Calendar01Icon} size={12} />
          <span>{format(new Date(row.original.created_at), "dd MMM yyyy", { locale: id })}</span>
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const isOff = row.original.name.toLowerCase() === "off";
        return (
          <Badge variant={isOff ? "destructive" : "success"} className="text-[10px] py-0 px-2 h-4 uppercase ">
            {isOff ? "OFF" : "ACTIVE"}
          </Badge>
        );
      },
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
