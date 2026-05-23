"use client"

import { ColumnDef } from "@tanstack/react-table"
import { PositionHierarchyMatrix } from "@/modules/organization/position-hierarchy-matrix/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HugeiconsIcon } from "@hugeicons/react"
import { Edit, Trash2 } from "@hugeicons/core-free-icons"

interface ColumnsProps {
  onEdit: (matrix: PositionHierarchyMatrix) => void
  onDelete: (matrix: PositionHierarchyMatrix) => void
}

export const getColumns = ({
  onEdit,
  onDelete,
}: ColumnsProps): ColumnDef<PositionHierarchyMatrix>[] => [
  {
    accessorKey: "location.name",
    header: "Location",
    cell: ({ row }) => {
      const locationName = row.original.location?.name
      return locationName ? (
        <span>{locationName}</span>
      ) : (
        <Badge variant="outline" className="font-normal text-muted-foreground">
          All Locations
        </Badge>
      )
    },
  },
  {
    accessorKey: "department.name",
    header: "Department",
    cell: ({ row }) => row.original.department?.name || "-",
  },
  {
    accessorKey: "position.name",
    header: "Position",
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.position?.name || "-"}</Badge>
    ),
  },
  {
    accessorKey: "supervisor_position.name",
    header: "Supervisor Position",
    cell: ({ row }) => {
      const supervisorPosition = row.original.supervisor_position
      const employees = supervisorPosition?.employees || []
      return (
        <div className="flex max-w-[300px] flex-col items-start gap-1">
          <Badge>{supervisorPosition?.name || "-"}</Badge>
          {employees.length > 0 ? (
            <span className="block w-full truncate text-xs text-muted-foreground">
              {employees.map((e) => e.name).join(", ")}
            </span>
          ) : (
            <span className="text-xs text-destructive/70 italic">Vacant</span>
          )}
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const matrix = row.original
      return (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(matrix)}>
            <HugeiconsIcon icon={Edit} className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive"
            onClick={() => onDelete(matrix)}
          >
            <HugeiconsIcon icon={Trash2} className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
]
