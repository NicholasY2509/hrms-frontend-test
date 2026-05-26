import { ColumnDef } from "@tanstack/react-table"
import { CareerModel } from "@/modules/employee/career/types"
import { Badge } from "@/components/ui/badge"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ProfileIcon,
  UserIcon,
  Briefcase01Icon,
  Building01Icon,
  Calendar01Icon,
  ArrowRight01Icon,
  Note01Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"

export const getCareerColumns = (
  onView: (item: CareerModel) => void
): ColumnDef<CareerModel>[] => [
  {
    accessorKey: "employee",
    header: "Karyawan",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm leading-none font-semibold">
          {row.original.employee.name}
        </span>
        <span className="mt-1 text-xs text-muted-foreground">
          NIK: {row.original.employee.nik}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "career_type",
    header: "Tipe Karir",
    cell: ({ row }) => {
      const status = row.original.career_type.name.toLowerCase()
      let variant:
        | "default"
        | "warning"
        | "info"
        | "success"
        | "destructive"
        | "secondary" = "secondary"
      let label = row.original.career_type.name

      switch (status) {
        case "promosi":
          variant = "default"
          label = "Promosi"
          break
        case "mutasi":
          variant = "warning"
          label = "Mutasi"
          break
        case "demosi":
          variant = "destructive"
          label = "Demosi"
          break
      }

      return (
        <Badge variant={variant} className="capitalize">
          {label}
        </Badge>
      )
    },
  },
  {
    id: "change",
    header: "Perubahan",
    cell: ({ row }) => (
      <div className="flex items-center gap-3 py-1">
        <div className="flex min-w-[120px] flex-col gap-1">
          <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
            Sebelum
          </span>
          <div className="flex items-center gap-1.5">
            <HugeiconsIcon
              icon={Briefcase01Icon}
              size={12}
              className="text-muted-foreground"
            />
            <span className="max-w-[150px] truncate text-xs font-medium">
              {row.original.before_work_position?.name || "-"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <HugeiconsIcon
              icon={Building01Icon}
              size={12}
              className="text-muted-foreground"
            />
            <span className="max-w-[150px] truncate text-xs text-muted-foreground">
              {row.original.before_department?.name || "-"}
            </span>
          </div>
        </div>

        <HugeiconsIcon
          icon={ArrowRight01Icon}
          size={14}
          className="shrink-0 text-muted-foreground/50"
        />

        <div className="flex min-w-[120px] flex-col gap-1">
          <span className="text-[10px] font-bold tracking-wider text-primary uppercase">
            Sesudah
          </span>
          <div className="flex items-center gap-1.5">
            <HugeiconsIcon
              icon={Briefcase01Icon}
              size={12}
              className="text-primary"
            />
            <span className="max-w-[150px] truncate text-xs font-semibold">
              {row.original.after_work_position?.name || "-"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <HugeiconsIcon
              icon={Building01Icon}
              size={12}
              className="text-primary/70"
            />
            <span className="max-w-[150px] truncate text-xs text-muted-foreground">
              {row.original.after_department?.name || "-"}
            </span>
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "career_at",
    header: "Tgl Karir",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <HugeiconsIcon
          icon={Calendar01Icon}
          size={14}
          className="text-muted-foreground"
        />
        <span className="text-sm">
          {row.original.career_at
            ? format(new Date(row.original.career_at), "dd MMM yyyy", {
                locale: localeId,
              })
            : "-"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status?.toLowerCase()
      if (status?.includes("approved") || status?.includes("disetujui"))
        return <Badge variant="success">{row.original.status}</Badge>
      if (status?.includes("rejected") || status?.includes("ditolak"))
        return <Badge variant="destructive">{row.original.status}</Badge>
      if (status?.includes("pending") || status?.includes("menunggu"))
        return (
          <Badge variant="warning" className="whitespace-nowrap">
            {row.original.status}
          </Badge>
        )
      if (status?.includes("settled") || status?.includes("selesai"))
        return <Badge variant="default">{row.original.status}</Badge>
      return <Badge variant="secondary">{row.original.status}</Badge>
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
          className="h-8 w-8 text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary"
          onClick={() => onView(row.original)}
        >
          <HugeiconsIcon icon={ProfileIcon} className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
]
