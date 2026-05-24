"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";
import { DataTable } from "@/components/data-table/data-table";
import { PageHeader } from "@/components/layout/page-header";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import {
  useAttendanceLocationList,
  useCreateAttendanceLocation,
  useUpdateAttendanceLocation,
  useDeleteAttendanceLocation,
} from "@/modules/attendance/locations/hooks/use-locations";
import { getColumns } from "../columns";
import { FilterCard, FilterGrid } from "@/components/layout/filter-card";
import { AttendanceLocationFormDialog } from "@/modules/attendance/locations/components/attendance-location-form-dialog";
import { AttendanceLocationModel } from "@/modules/attendance/locations/types";
import { ConfirmModal } from "@/components/ui/confirm-modal";

export function AttendanceLocationsClient() {
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState("15");

  // Form states
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<AttendanceLocationModel | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState<number | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  const { items, meta, isLoading } = useAttendanceLocationList({
    search: debouncedSearch,
    page,
    per_page: Number(perPage),
  });

  const { createAttendanceLocation, isLoading: isCreating } = useCreateAttendanceLocation();
  const { updateAttendanceLocation, isLoading: isUpdating } = useUpdateAttendanceLocation();
  const { deleteAttendanceLocation, isLoading: isDeleting } = useDeleteAttendanceLocation();

  const handleResetFilters = () => {
    setSearch("");
    setPage(1);
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (item: AttendanceLocationModel) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      await deleteAttendanceLocation(itemToDelete);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleFormSubmit = async (data: any) => {
    if (selectedItem) {
      await updateAttendanceLocation({ id: selectedItem.id, data });
    } else {
      await createAttendanceLocation(data);
    }
  };

  const columns = React.useMemo(
    () => getColumns(handleEdit, handleDeleteClick),
    []
  );

  const hasActiveFilters = search !== "";

  return (
    <div className="space-y-6 w-full min-w-0">
      <PageHeader
        title="Lokasi Absensi"
        description="Kelola titik koordinat dan radius absensi untuk pembatasan lokasi presensi mobile."
      >
        <Button onClick={handleAdd} className="gap-2">
          <HugeiconsIcon icon={PlusSignIcon} size={18} />
          Tambah Lokasi
        </Button>
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
              placeholder="Cari nama lokasi..."
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

      <AttendanceLocationFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        data={selectedItem}
        onSubmit={handleFormSubmit}
        isLoading={isCreating || isUpdating}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Hapus Lokasi Absensi"
        description="Apakah Anda yakin ingin menghapus lokasi absensi ini? Karyawan yang terikat dengan lokasi ini mungkin tidak dapat melakukan absensi."
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        variant="destructive"
      />
    </div>
  );
}
