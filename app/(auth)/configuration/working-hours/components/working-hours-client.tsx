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
import {
  useMasterWorkingHourList,
  useCreateMasterWorkingHour,
  useUpdateMasterWorkingHour,
  useDeleteMasterWorkingHour,
} from "@/modules/attendance/working-hours/hooks/use-working-hours";
import { getColumns } from "../columns";
import { FilterCard, FilterGrid } from "@/components/layout/filter-card";
import { WorkingHourFormDialog } from "@/modules/attendance/working-hours/components/working-hour-form-dialog";
import { MasterWorkingHourModel } from "@/modules/attendance/working-hours/types";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { useDebounce } from "@/hooks/use-debounce";

export function WorkingHoursClient() {
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState("15");

  // Form states
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<MasterWorkingHourModel | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState<number | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  const { items, meta, isLoading } = useMasterWorkingHourList({
    search: debouncedSearch,
    page,
    per_page: Number(perPage),
  });

  const { createMasterWorkingHour, isLoading: isCreating } = useCreateMasterWorkingHour();
  const { updateMasterWorkingHour, isLoading: isUpdating } = useUpdateMasterWorkingHour();
  const { deleteMasterWorkingHour, isLoading: isDeleting } = useDeleteMasterWorkingHour();

  const handleResetFilters = () => {
    setSearch("");
    setPage(1);
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (item: MasterWorkingHourModel) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      await deleteMasterWorkingHour(itemToDelete);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleFormSubmit = async (data: any) => {
    if (selectedItem) {
      await updateMasterWorkingHour({ id: selectedItem.id, data });
    } else {
      await createMasterWorkingHour(data);
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
        title="Master Jam Kerja"
        description="Kelola data master jam kerja dan shift yang berlaku di perusahaan."
      >
        <Button onClick={handleAdd} className="gap-2">
          <HugeiconsIcon icon={PlusSignIcon} size={18} />
          Tambah Jam Kerja
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
              placeholder="Cari nama jam kerja..."
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

      <WorkingHourFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        data={selectedItem}
        onSubmit={handleFormSubmit}
        isLoading={isCreating || isUpdating}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Hapus Jam Kerja"
        description="Apakah Anda yakin ingin menghapus jam kerja ini? Tindakan ini tidak dapat dibatalkan."
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        variant="destructive"
      />
    </div>
  );
}
