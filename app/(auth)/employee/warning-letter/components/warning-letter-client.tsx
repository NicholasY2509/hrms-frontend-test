"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { PageHeader } from "@/components/layout/page-header";
import { useWarningLetterEmployeeList } from "@/modules/employee/warning-letter/hooks/use-warning-letter";
import { useDebounce } from "@/hooks/use-debounce";
import { WarningLetterModel } from "@/modules/employee/warning-letter/types";
import { WarningLetterCard } from "@/modules/employee/warning-letter/components/employee-warning-letter-card";
import { DetailSheet } from "@/modules/employee/warning-letter/components/employee-warning-letter-detail-sheet";

export function WarningLetterClient() {
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [selectedWarning, setSelectedWarning] = React.useState<WarningLetterModel | null>(null);
  const debouncedSearch = useDebounce(search, 500);

  const { items, meta, isLoading } = useWarningLetterEmployeeList({
    search: debouncedSearch,
    page,
  });

  const handleViewDetail = (warning: WarningLetterModel) => {
    setSelectedWarning(warning);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Surat Peringatan Saya"
        description="Daftar surat peringatan resmi yang diterbitkan untuk Anda"
      />

      <div className="flex items-center gap-4">
        <InputGroup className="flex-1 max-w-sm bg-background">
          <InputGroupAddon>
            <HugeiconsIcon icon={Search01Icon} className="text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Cari surat peringatan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
      </div>

      {isLoading ? (
        <DataTableSkeleton columnCount={5} rowCount={3} />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.length > 0 ? (
              items.map((warning) => (
                <WarningLetterCard
                  key={warning.id}
                  warning={warning}
                  onClick={handleViewDetail}
                />
              ))
            ) : (
              <div className="col-span-full h-32 flex items-center justify-center text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
                Tidak ada data surat peringatan.
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
        id={selectedWarning?.id ?? null}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedWarning(null);
        }}
      />
    </div>
  );
}
