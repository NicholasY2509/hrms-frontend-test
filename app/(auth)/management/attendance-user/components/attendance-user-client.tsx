"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Search01Icon,
  PlusSignIcon,
  ReloadIcon,
} from "@hugeicons/core-free-icons"
import { DataTable } from "@/components/data-table/data-table"
import { PageHeader } from "@/components/layout/page-header"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Button } from "@/components/ui/button"
import { useDebounce } from "@/hooks/use-debounce"
import {
  useAttendanceUserList,
  useCreateAttendanceUser,
  useUpdateAttendanceUser,
  useDeleteAttendanceUser,
} from "@/modules/attendance/users/hooks/use-attendance-users"
import { getColumns } from "../columns"
import { FilterCard, FilterGrid } from "@/components/layout/filter-card"
import { AttendanceUserFormDialog } from "@/modules/attendance/users/components/attendance-user-form-dialog"
import { ZktecoSyncDialog } from "@/modules/attendance/zkteco/components/zkteco-sync-dialog"
import { AttendanceUserModel } from "@/modules/attendance/users/types"
import { ConfirmModal } from "@/components/ui/confirm-modal"

export function AttendanceUserClient() {
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState("15")

  // Form states
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [selectedItem, setSelectedItem] =
    React.useState<AttendanceUserModel | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
  const [itemToDelete, setItemToDelete] = React.useState<number | null>(null)

  const debouncedSearch = useDebounce(search, 500)

  const { items, meta, isLoading } = useAttendanceUserList({
    search: debouncedSearch,
    page,
    per_page: Number(perPage),
  })

  const { createAttendanceUser, isLoading: isCreating } =
    useCreateAttendanceUser()
  const { updateAttendanceUser, isLoading: isUpdating } =
    useUpdateAttendanceUser()
  const { deleteAttendanceUser, isLoading: isDeleting } =
    useDeleteAttendanceUser()

  const handleResetFilters = () => {
    setSearch("")
    setPage(1)
  }

  const handleAdd = () => {
    setSelectedItem(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (item: AttendanceUserModel) => {
    setSelectedItem(item)
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (id: number) => {
    setItemToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      await deleteAttendanceUser(itemToDelete)
      setIsDeleteModalOpen(false)
      setItemToDelete(null)
    }
  }

  const handleFormSubmit = async (data: any) => {
    if (selectedItem) {
      await updateAttendanceUser({ id: selectedItem.id, data })
    } else {
      await createAttendanceUser(data)
    }
  }

  const columns = React.useMemo(
    () => getColumns(handleEdit, handleDeleteClick),
    []
  )

  const hasActiveFilters = search !== ""

  return (
    <div className="w-full min-w-0 space-y-6">
      <PageHeader
        title="Pemetaan User Absensi"
        description="Kelola sinkronisasi ID karyawan dengan ID user di mesin absensi fingerprint."
      >
        <div className="flex flex-row items-center gap-2">
          <Button onClick={handleAdd} className="gap-2">
            <HugeiconsIcon icon={PlusSignIcon} size={18} />
            Tambah Pemetaan
          </Button>
        </div>
      </PageHeader>

      <FilterCard
        onReset={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
        perPage={perPage}
        onPerPageChange={setPerPage}
      >
        <FilterGrid cols={4}>
          <InputGroup className="">
            <InputGroupAddon>
              <HugeiconsIcon
                icon={Search01Icon}
                className="text-muted-foreground"
                size={14}
              />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Cari nama atau NIK..."
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

      <AttendanceUserFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        data={selectedItem}
        onSubmit={handleFormSubmit}
        isLoading={isCreating || isUpdating}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Hapus Pemetaan User"
        description="Apakah Anda yakin ingin menghapus pemetaan user ini? Hal ini dapat menyebabkan data absensi dari mesin tidak teridentifikasi."
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        variant="destructive"
      />
    </div>
  )
}
