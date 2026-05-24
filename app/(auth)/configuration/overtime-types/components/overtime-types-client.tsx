"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table/data-table";
import { PageHeader } from "@/components/layout/page-header";
import { useOvertimeTypeList, useOvertimeTypeMutation } from "@/modules/overtime/hooks/use-overtime-type";
import { getColumns } from "../columns";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loading03Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { OvertimeTypeDialog } from "@/modules/overtime/components/overtime-type-dialog";
import { OvertimeType } from "@/modules/overtime/types";
import { useConfirm } from "@/hooks/use-confirm";

export function OvertimeTypesClient() {
  const { items, isLoading } = useOvertimeTypeList();
  const { deleteType } = useOvertimeTypeMutation();
  const [ConfirmDialog, confirm] = useConfirm();

  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<OvertimeType | undefined>();

  const handleAdd = () => {
    setSelectedItem(undefined);
    setIsOpen(true);
  };

  const handleEdit = (item: OvertimeType) => {
    setSelectedItem(item);
    setIsOpen(true);
  };

  const handleDelete = async (item: OvertimeType) => {
    const ok = await confirm({
      title: "Hapus Tipe Lembur",
      message: `Apakah Anda yakin ingin menghapus tipe lembur "${item.name}"? Tindakan ini tidak dapat dibatalkan.`,
      variant: "destructive",
    });

    if (ok) {
      await deleteType(item.id);
    }
  };

  const columns = React.useMemo(
    () => getColumns(handleEdit, handleDelete),
    []
  );

  return (
    <div className="space-y-6 w-full min-w-0 overflow-hidden">
      <PageHeader
        title="Tipe Lembur"
        description="Kelola kategori dan tarif lembur karyawan berdasarkan ketentuan perusahaan."
      >
        <Button onClick={handleAdd} className="gap-2">
          <HugeiconsIcon icon={PlusSignIcon} size={18} />
          Tambah Tipe
        </Button>
      </PageHeader>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 bg-card/50 rounded-xl border border-dashed">
          <HugeiconsIcon
            icon={Loading03Icon}
            className="h-8 w-8 animate-spin text-primary"
          />
          <p className="text-sm text-muted-foreground font-medium">
            Memuat data tipe lembur...
          </p>
        </div>
      ) : (
        <DataTable columns={columns} data={items} />
      )}

      <ConfirmDialog />

      <OvertimeTypeDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        selectedItem={selectedItem}
      />
    </div>
  );
}
