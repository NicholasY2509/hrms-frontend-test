"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AnnualLeave } from "@/modules/employee/annual-leave/types";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<AnnualLeave>[] = [
  {
    accessorKey: "employee.name",
    header: "Karyawan",
    cell: ({ row }) => {
      const { employee } = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{employee.name}</span>
          <span className="text-xs text-muted-foreground">{employee.nik}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "annual_leave_at",
    header: "Tanggal",
    cell: ({ row }) => {
      const date = row.getValue("annual_leave_at") as string;
      return (
        <span className="text-sm">
          {format(new Date(date), "dd MMMM yyyy", { locale: id })}
        </span>
      );
    },
  },
  {
    accessorKey: "total",
    header: "Total Hari",
    cell: ({ row }) => {
      const total = row.getValue("total") as number;
      return (
        <Badge variant="secondary" className="font-mono">
          {total} Hari
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={status === "Potong" ? "destructive" : "default"}
          className="capitalize"
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Keterangan",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground line-clamp-1 max-w-[300px]">
        {row.getValue("description")}
      </span>
    ),
  },
  {
    id: "deduction",
    header: "Detail Potongan",
    cell: ({ row }) => {
      const details = row.original.deduction_details;
      return (
        <div className="flex flex-wrap gap-1">
          {details.map((detail, index) => (
            <Badge key={index} variant="outline" className="text-[10px] py-0">
              {detail.year}: {detail.amount}
            </Badge>
          ))}
        </div>
      );
    },
  },
];
