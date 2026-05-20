"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { PageHeader } from "@/components/layout/page-header";
import { useUnpaidLeaveList } from "@/modules/unpaid-leave/hooks/use-unpaid-leave";
import { useDebounce } from "@/hooks/use-debounce";
import { getColumns } from "../columns";
import Link from "next/link";
import { DetailSheet } from "@/modules/unpaid-leave/components/employee-unpaid-leave-detail-sheet";
import { UnpaidLeaveCard } from "@/modules/unpaid-leave/components/employee-unpaid-leave-card";
import { UnpaidLeave } from "@/modules/unpaid-leave/types";

export function UnpaidLeaveClient() {
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [selectedLeave, setSelectedLeave] = React.useState<UnpaidLeave | null>(null);
  const debouncedSearch = useDebounce(search, 500);

  const { items, meta, isLoading, mutate } = useUnpaidLeaveList({
    search: debouncedSearch,
    page,
  });

  const handleViewDetail = (leave: UnpaidLeave) => {
    setSelectedLeave(leave);
    setIsDetailOpen(true);
  };


  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengajuan Cuti"
        description="Daftar pengajuan cuti anda"
      >
        <Button className="gap-2" asChild>
          <Link href="/employee/unpaid-leave/create">
            <HugeiconsIcon icon={Add01Icon} className="h-4 w-4" /> Tambah Pengajuan
          </Link>
        </Button>
      </PageHeader>

      <div className="flex items-center gap-4">
        <InputGroup className="flex-1 max-w-sm bg-background">
          <InputGroupAddon>
            <HugeiconsIcon icon={Search01Icon} className="text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Cari pengajuan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
      </div>

      {isLoading ? (
        <DataTableSkeleton columnCount={6} rowCount={5} />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.length > 0 ? (
              items.map((leave) => (
                <UnpaidLeaveCard
                  key={leave.id}
                  leave={leave}
                  onClick={handleViewDetail}
                />
              ))
            ) : (
              <div className="col-span-full h-32 flex items-center justify-center text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
                Tidak ada data pengajuan.
              </div>
            )}
          </div>
          {meta && (
            <div className="mt-2">
              <DataTablePagination
                meta={meta}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          )}
        </div>
      )}


      <DetailSheet
        id={selectedLeave?.id ?? null}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedLeave(null);
        }}
      />
    </div>
  );
}
