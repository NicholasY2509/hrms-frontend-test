import { ColumnDef } from "@tanstack/react-table"
import { WarningLetterModel } from "@/modules/employee/warning-letter/types"
import { Badge } from "@/components/ui/badge"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ProfileIcon,
  Calendar01Icon,
  AttachmentIcon,
  DocumentValidationIcon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"

export const getWarningLetterColumns = (
  onView: (item: WarningLetterModel) => void
): ColumnDef<WarningLetterModel>[] => [
  {
    accessorKey: "document_no",
    header: "No. Dokumen",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <HugeiconsIcon
          icon={DocumentValidationIcon}
          size={14}
          className="text-muted-foreground"
        />
        <span className="text-sm font-medium">{row.original.document_no}</span>
      </div>
    ),
  },
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
    accessorKey: "warning_letter_type",
    header: "Tipe SP",
    cell: ({ row }) => {
      // Determine color based on SP level
      let colorClass = "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" // SP 1
      if (row.original.warning_letter_type.name.includes("2")) {
        colorClass = "bg-orange-500/10 text-orange-600 border-orange-500/20" // SP 2
      } else if (row.original.warning_letter_type.name.includes("3")) {
        colorClass = "bg-red-500/10 text-red-600 border-red-500/20" // SP 3
      }

      return (
        <Badge variant="outline" className={colorClass}>
          {row.original.warning_letter_type.name}
        </Badge>
      )
    },
  },
  {
    accessorKey: "warning_at",
    header: "Tgl SP",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <HugeiconsIcon
          icon={Calendar01Icon}
          size={14}
          className="text-muted-foreground"
        />
        <span className="text-sm">
          {row.original.warning_at
            ? format(new Date(row.original.warning_at), "dd MMM yyyy", {
                locale: localeId,
              })
            : "-"}
        </span>
      </div>
    ),
  },
  {
    id: "validity",
    header: "Masa Berlaku",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">
          {row.original.start_date
            ? format(new Date(row.original.start_date), "dd MMM yyyy", {
                locale: localeId,
              })
            : "-"}
          {" - "}
          {row.original.end_date
            ? format(new Date(row.original.end_date), "dd MMM yyyy", {
                locale: localeId,
              })
            : "-"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "attachment",
    header: "Lampiran",
    cell: ({ row }) =>
      row.original.attachment_url ? (
        <a
          href={row.original.attachment_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-primary hover:underline"
        >
          <HugeiconsIcon icon={AttachmentIcon} size={14} />
          Lihat
        </a>
      ) : (
        <span className="text-xs text-muted-foreground">-</span>
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
