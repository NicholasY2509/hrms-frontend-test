"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { PageHeader } from "@/components/layout/page-header"
import { PageError } from "@/components/layout/page-error"
import {
  useHolidayList,
  useHolidayMutation,
} from "@/modules/unpaid-leave/hooks/use-holidays"
import { Holiday } from "@/modules/unpaid-leave/types"
import { getColumns } from "./columns"
import { HolidayDialog } from "@/modules/unpaid-leave/components/holiday-dialog"
import { AutoInsertSundaysDialog } from "@/modules/unpaid-leave/components/auto-insert-sundays-dialog"
import { ConfirmModal } from "@/components/ui/confirm-modal"
import { HugeiconsIcon } from "@hugeicons/react"
import { Plus, CalendarAdd02Icon } from "@hugeicons/core-free-icons"
import { ManagementFilter } from "@/components/layout/management-filter"
import { useDebounce } from "@/hooks/use-debounce"
import { format } from "date-fns"

export function HolidayClient() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [autoInsertOpen, setAutoInsertOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null)

  // Filters State
  const [search, setSearch] = useState("")
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState("15")

  const debouncedSearch = useDebounce(search, 500)

  const { items, meta, isLoading, isError } = useHolidayList({
    search: debouncedSearch,
    start_date: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
    end_date: endDate ? format(endDate, "yyyy-MM-dd") : undefined,
    page,
    per_page: Number(perPage),
  })
  const { deleteHoliday, isDeleting } = useHolidayMutation()

  const handleAdd = () => {
    setSelectedHoliday(null)
    setDialogOpen(true)
  }

  const handleEdit = (holiday: Holiday) => {
    setSelectedHoliday(holiday)
    setDialogOpen(true)
  }

  const handleDelete = (holiday: Holiday) => {
    setSelectedHoliday(holiday)
    setConfirmOpen(true)
  }

  const onConfirmDelete = async () => {
    if (selectedHoliday) {
      await deleteHoliday(selectedHoliday.id)
    }
  }

  const handleResetFilters = () => {
    setSearch("")
    setStartDate(undefined)
    setEndDate(undefined)
    setPage(1)
  }

  const columns = getColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  })

  if (isError) return <PageError />

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row items-center justify-between">
        <PageHeader
          title="Daftar Hari Libur"
          description="Kelola daftar hari libur nasional dan kantor."
        />

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setAutoInsertOpen(true)}>
            <HugeiconsIcon icon={CalendarAdd02Icon} className="mr-2 h-4 w-4" />
            Auto Insert Hari Minggu
          </Button>

          <Button onClick={handleAdd}>
            <HugeiconsIcon icon={Plus} className="mr-2 h-4 w-4" />
            Tambah Hari Libur
          </Button>
        </div>
      </div>

      <ManagementFilter
        onReset={handleResetFilters}
        hasActiveFilters={search !== "" || !!startDate || !!endDate}
        perPage={perPage}
        onPerPageChange={setPerPage}
        search={{
          value: search,
          onChange: setSearch,
          placeholder: "Cari nama hari libur...",
        }}
        startDate={{
          value: startDate,
          onChange: setStartDate,
          placeholder: "Tanggal Mulai",
        }}
        endDate={{
          value: endDate,
          onChange: setEndDate,
          placeholder: "Tanggal Selesai",
        }}
      />

      {isLoading ? (
        <DataTableSkeleton columnCount={3} />
      ) : (
        <DataTable
          columns={columns}
          data={items}
          pagination={
            meta
              ? {
                  ...meta,
                  onPageChange: (p) => setPage(p),
                }
              : undefined
          }
        />
      )}

      <HolidayDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedHoliday={selectedHoliday}
      />

      <AutoInsertSundaysDialog
        open={autoInsertOpen}
        onOpenChange={setAutoInsertOpen}
      />

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={onConfirmDelete}
        title="Hapus Hari Libur"
        description={`Apakah Anda yakin ingin menghapus hari libur "${selectedHoliday?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
        isLoading={isDeleting}
      />
    </div>
  )
}
