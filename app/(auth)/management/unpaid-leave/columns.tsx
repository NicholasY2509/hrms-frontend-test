import { ColumnDef } from "@tanstack/react-table"
import { UnpaidLeave } from "@/modules/unpaid-leave/types"
import { Badge } from "@/components/ui/badge"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ProfileIcon,
  PencilEdit01Icon,
  Calendar01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"

export const getUnpaidLeaveColumns = (
  onView: (item: UnpaidLeave) => void
): ColumnDef<UnpaidLeave>[] => [
  {
    accessorKey: "employee.full_name",
    header: "Karyawan",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.employee.name}</span>
        <span className="text-xs text-muted-foreground">
          NIK: {row.original.employee.nik}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "type.name",
    header: "Tipe",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.type.name}</span>
    ),
  },
  {
    header: "Durasi",
    cell: ({ row }) => {
      const start = new Date(row.original.start_date)
      const end = new Date(row.original.end_date)
      return (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-sm">
            <HugeiconsIcon
              icon={Calendar01Icon}
              size={12}
              className="text-muted-foreground"
            />
            <span className="text-xs">
              {format(start, "dd MMM yyyy", { locale: localeId })}
            </span>
            {row.original.start_date !== row.original.end_date && (
              <>
                <span className="text-muted-foreground">-</span>
                <span className="text-xs">
                  {format(end, "dd MMM yyyy", { locale: localeId })}
                </span>
              </>
            )}
          </div>
          <span className="mt-0.5 text-xs text-muted-foreground">
            {row.original.total_days} Hari
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status.toLowerCase()
      let variant:
        | "default"
        | "warning"
        | "info"
        | "success"
        | "destructive"
        | "secondary" = "secondary"
      let label = row.original.status

      if (status.includes("pending")) {
        variant = "warning"
      } else if (status.includes("approved")) {
        variant = "success"
        label = "Disetujui"
      } else if (status.includes("settled")) {
        variant = "default"
        label = "Settled"
      } else if (status.includes("rejected")) {
        variant = "destructive"
        label = "Ditolak"
      }

      return (
        <Badge variant={variant} className="capitalize">
          {label}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    header: "Aksi",
    meta: {
      className: "sticky right-0 bg-card z-10 text-center",
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-primary"
          onClick={() => onView(row.original)}
        >
          <HugeiconsIcon icon={ProfileIcon} className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
]
