"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table/data-table";
import { PageHeader } from "@/components/layout/page-header";
import { useUnpaidLeaveTypeList, useUnpaidLeaveTypeMutation } from "@/modules/unpaid-leave/hooks/use-unpaid-leave-type";
import { getColumns } from "../columns";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { UnpaidLeaveTypeDialog } from "@/modules/unpaid-leave/components/unpaid-leave-type-dialog";
import { UnpaidLeaveType } from "@/modules/unpaid-leave/types";
import { useConfirm } from "@/hooks/use-confirm";

export function UnpaidLeaveTypesClient() {
  const { items, isLoading } = useUnpaidLeaveTypeList();
  const { deleteType } = useUnpaidLeaveTypeMutation();
  const [ConfirmDialog, confirm] = useConfirm();

  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<UnpaidLeaveType | undefined>();

  const handleAdd = () => {
    setSelectedItem(undefined);
    setIsOpen(true);
  };

  const handleEdit = (item: UnpaidLeaveType) => {
    setSelectedItem(item);
    setIsOpen(true);
  };

  const handleDelete = async (item: UnpaidLeaveType) => {
    const ok = await confirm({
      title: "Hapus Tipe Izin",
      message: `Apakah Anda yakin ingin menghapus tipe izin "${item.name}"? Tindakan ini tidak dapat dibatalkan.`,
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
        title="Tipe Izin/Cuti"
        description="Kelola daftar tipe izin atau cuti yang berlaku di perusahaan."
      >
        <Button onClick={handleAdd} className="gap-2">
          <HugeiconsIcon icon={PlusSignIcon} size={18} />
          Tambah Tipe
        </Button>
      </PageHeader>

      <DataTable columns={columns} data={items} isLoading={isLoading} />

      <ConfirmDialog />

      <UnpaidLeaveTypeDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        selectedItem={selectedItem}
      />
    </div>
  );
}
