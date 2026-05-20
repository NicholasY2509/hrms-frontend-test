import { ColumnDef } from "@tanstack/react-table"
import { Team } from "@/modules/organization/teams/types"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HugeiconsIcon } from "@hugeicons/react"
import { PencilEdit01Icon, Delete02Icon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"

export const getTeamColumns = (
  onEdit: (team: Team) => void,
  onDelete: (team: Team) => void
): ColumnDef<Team>[] => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <span className="text-muted-foreground">#{row.original.id}</span>
    ),
  },
  {
    accessorKey: "name",
    header: "Nama Tim",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "head",
    header: "Kepala Tim",
    cell: ({ row }) => {
      const head = row.original.head
      if (!head)
        return (
          <span className="text-sm text-muted-foreground italic">
            Tidak ada kepala yang ditugaskan
          </span>
        )

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={head.photo_url ?? undefined} alt={head.name} />
            <AvatarFallback>
              {head.name?.substring(0, 2).toUpperCase() || "??"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm leading-none font-medium">
              {head.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {head.position.name}
            </span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "employees_count",
    header: "Karyawan",
    cell: ({ row }) => (
      <Badge variant="secondary" className="font-mono">
        {row.original.employees_count}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-primary"
          onClick={() => onEdit(row.original)}
        >
          <HugeiconsIcon icon={PencilEdit01Icon} className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={() => onDelete(row.original)}
        >
          <HugeiconsIcon icon={Delete02Icon} className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
]
