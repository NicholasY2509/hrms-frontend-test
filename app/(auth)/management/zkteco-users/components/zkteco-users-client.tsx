"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ReloadIcon, Search01Icon } from "@hugeicons/core-free-icons"
import { DataTable } from "@/components/data-table/data-table"
import { PageHeader } from "@/components/layout/page-header"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { useDebounce } from "@/hooks/use-debounce"
import { useZktecoUsers } from "@/modules/attendance/zkteco/hooks/use-zkteco"
import { columns } from "../columns"
import { FilterCard, FilterGrid } from "@/components/layout/filter-card"
import { Button } from "@/components/ui/button"
import { ZktecoSyncDialog } from "@/modules/attendance/zkteco/components/zkteco-sync-dialog"

export function ZktecoUsersClient() {
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState("15")
  const [isSyncDialogOpen, setIsSyncDialogOpen] = React.useState(false)

  const debouncedSearch = useDebounce(search, 500)

  const { items, meta, isLoading } = useZktecoUsers({
    search: debouncedSearch,
    page,
    per_page: Number(perPage),
  })

  const handleResetFilters = () => {
    setSearch("")
    setPage(1)
  }

  const handleSync = () => {
    setIsSyncDialogOpen(true)
  }

  const hasActiveFilters = search !== ""

  return (
    <div className="w-full min-w-0 space-y-6">
      <div className="flex flex-row items-center justify-between">
        <PageHeader
          title="User di Mesin Fingerprint"
          description="Daftar user yang tersimpan di dalam memori mesin fingerprint biometrik."
        />

        <Button onClick={handleSync} className="gap-2">
          <HugeiconsIcon icon={ReloadIcon} size={18} />
          Tarik Data User
        </Button>
      </div>

      <FilterCard
        onReset={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
        perPage={perPage}
        onPerPageChange={setPerPage}
      >
        <FilterGrid cols={4}>
          <InputGroup>
            <InputGroupAddon>
              <HugeiconsIcon
                icon={Search01Icon}
                className="text-muted-foreground"
                size={14}
              />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Cari UID atau nama..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </FilterGrid>
      </FilterCard>

      <DataTable
        columns={columns}
        data={items}
        isLoading={isLoading}
        pagination={
          meta
            ? {
                ...meta,
                onPageChange: (p) => setPage(p),
              }
            : undefined
        }
      />

      <ZktecoSyncDialog
        open={isSyncDialogOpen}
        onOpenChange={setIsSyncDialogOpen}
      />
    </div>
  )
}
