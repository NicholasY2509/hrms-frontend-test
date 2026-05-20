"use client";

import * as React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/data-table/data-table";
import { useReportList } from "@/modules/system/hooks/use-report";
import { columns } from "../columns";
import { FilterCard, FilterGrid } from "@/components/layout/filter-card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { useDebounce } from "@/hooks/use-debounce";

export function ReportsClient() {
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState("15");

  const debouncedSearch = useDebounce(search, 500);

  const { items, meta, isLoading } = useReportList({
    search: debouncedSearch,
    page,
    per_page: Number(perPage),
  });

  const handleResetFilters = () => {
    setSearch("");
    setPage(1);
  };

  const hasActiveFilters = search !== "";

  return (
    <div className="space-y-6 w-full min-w-0">
      <PageHeader
        title="Riwayat Laporan & Export"
        description="Daftar semua permintaan export data dan status pemrosesan dokumen."
      >
      </PageHeader>

      <FilterCard
        onReset={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
        perPage={perPage}
        onPerPageChange={setPerPage}
      >
        <FilterGrid cols={3}>
          <InputGroup className="lg:col-span-1">
            <InputGroupAddon>
              <HugeiconsIcon
                icon={Search01Icon}
                className="text-muted-foreground"
                size={14}
              />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Cari nama laporan..."
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
    </div>
  );
}
