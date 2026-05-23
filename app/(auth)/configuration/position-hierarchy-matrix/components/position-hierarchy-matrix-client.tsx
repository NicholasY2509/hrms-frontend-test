"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { DataTable } from "@/components/data-table/data-table"
import { useUrlFilters } from "@/hooks/use-url-filters"
import { useDebounce } from "@/hooks/use-debounce"
import { Button } from "@/components/ui/button"
import { ManagementFilter } from "@/components/layout/management-filter"
import { usePositionHierarchyMatrices } from "@/modules/organization/position-hierarchy-matrix/hooks/use-position-hierarchy-matrix"
import { getColumns } from "./columns"
import { PositionHierarchyMatrix } from "@/modules/organization/position-hierarchy-matrix/types"
import { HugeiconsIcon } from "@hugeicons/react"
import { Plus } from "@hugeicons/core-free-icons"
import { PositionHierarchyMatrixDialog } from "./position-hierarchy-matrix-dialog"
import { DeleteMatrixDialog } from "./delete-matrix-dialog"

export function PositionHierarchyMatrixClient() {
  const { filters, setFilter, resetFilters, hasActiveFilters } = useUrlFilters({
    page: 1,
    per_page: 15,
    search: "",
  })

  const [localSearch, setLocalSearch] = useState(filters.search as string)
  const debouncedLocalSearch = useDebounce(localSearch, 500)

  // Sync debounced local search with URL filter
  useEffect(() => {
    if (debouncedLocalSearch !== filters.search) {
      setFilter("search", debouncedLocalSearch)
    }
  }, [debouncedLocalSearch, setFilter, filters.search])

  // If URL changes externally (e.g. reset), update local state
  useEffect(() => {
    if (filters.search !== debouncedLocalSearch) {
      setLocalSearch(filters.search as string)
    }
  }, [filters.search])

  const { items, meta, isLoading } = usePositionHierarchyMatrices({
    page: filters.page,
    per_page: filters.per_page,
    search: filters.search as string,
  })

  const [dialogState, setDialogState] = useState<{
    isOpen: boolean
    mode: "create" | "edit"
    matrix: PositionHierarchyMatrix | null
  }>({ isOpen: false, mode: "create", matrix: null })

  const [deleteDialogState, setDeleteDialogState] = useState<{
    isOpen: boolean
    matrix: PositionHierarchyMatrix | null
  }>({ isOpen: false, matrix: null })

  const columns = getColumns({
    onEdit: (matrix) => setDialogState({ isOpen: true, mode: "edit", matrix }),
    onDelete: (matrix) => setDeleteDialogState({ isOpen: true, matrix }),
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row items-center justify-between">
        <PageHeader
          title="Position Hierarchy Matrix"
          description="Manage reporting lines and supervisor assignments based on location and department."
        />

        <Button
          onClick={() =>
            setDialogState({ isOpen: true, mode: "create", matrix: null })
          }
          className="gap-2"
        >
          <HugeiconsIcon icon={Plus} size={18} />
          Add Mapping
        </Button>
      </div>

      <ManagementFilter
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
        perPage={String(filters.per_page)}
        onPerPageChange={(v) => setFilter("per_page", v)}
        search={{
          value: localSearch,
          onChange: setLocalSearch,
          placeholder: "Search mappings...",
        }}
      />

      <DataTable
        columns={columns}
        data={items}
        isLoading={isLoading}
        pagination={
          meta
            ? {
                ...meta,
                onPageChange: (p) => setFilter("page", p),
              }
            : undefined
        }
      />

      <PositionHierarchyMatrixDialog
        isOpen={dialogState.isOpen}
        onClose={() =>
          setDialogState({ isOpen: false, mode: "create", matrix: null })
        }
        mode={dialogState.mode}
        initialData={dialogState.matrix}
      />

      <DeleteMatrixDialog
        isOpen={deleteDialogState.isOpen}
        onClose={() => setDeleteDialogState({ isOpen: false, matrix: null })}
        matrix={deleteDialogState.matrix}
      />
    </div>
  )
}
