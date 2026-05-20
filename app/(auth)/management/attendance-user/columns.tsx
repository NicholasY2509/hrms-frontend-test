"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MoreHorizontalIcon,
  PencilEdit01Icon,
  Delete02Icon,
  MachineRobotIcon,
  BiometricAccessIcon,
  FingerAccessIcon,
  ComputerIcon,
} from "@hugeicons/core-free-icons";
import { AttendanceUserModel } from "@/modules/attendance/users/types";
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
  onEdit: (item: AttendanceUserModel) => void,
  onDelete: (id: number) => void
): ColumnDef<AttendanceUserModel>[] => [
    {
      accessorKey: "employee",
      header: "Karyawan",
      cell: ({ row }) => {
        const emp = row.original.employee;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border border-border">
              <AvatarImage src={emp.photo_url} alt={emp.name} />
              <AvatarFallback className="text-[10px]">
                {emp.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="text-sm text-foreground truncate uppercase tracking-tight">
                {emp.name}
              </span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                NIK: {emp.nik}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "uid",
      header: "UID / ID Mesin",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={FingerAccessIcon} size={14} className="text-primary" />
          <span className="font-mono text-sm">{row.original.uid}</span>
        </div>
      ),
    },
    {
      accessorKey: "zkteco_machine_id",
      header: "Mesin Absensi",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={ComputerIcon} size={14} className="text-muted-foreground" />
          <span className="text-xs font-medium">{row.original.zkteco_machine?.name ?? '-'}</span>
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
