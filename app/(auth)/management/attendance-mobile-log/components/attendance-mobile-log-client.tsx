"use client";

import { useMobileScanList } from "@/modules/attendance/mobile-scans/hooks/use-mobile-scans";
import { DataTable } from "@/components/data-table/data-table";
import { PageHeader } from "@/components/layout/page-header";
import { PageError } from "@/components/layout/page-error";
import { columns } from "../columns";
import { useDebounce } from "@/hooks/use-debounce";
import { useState } from "react";
import { FilterCard, FilterGrid } from "@/components/layout/filter-card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";

export function AttendanceMobileLogClient() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState("15");
  const debouncedSearch = useDebounce(search, 500);

  const { items, meta, isLoading, isError } = useMobileScanList({
    search: debouncedSearch,
    page: page,
    per_page: perPage,
  });

  const handleResetFilters = () => {
    setSearch("");
    setPage(1);
  };

  const hasActiveFilters = search !== "";

  if (isError) return <PageError />;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Log Absensi Mobile"
        description="Daftar riwayat absensi yang dilakukan melalui aplikasi mobile."
      />

      <FilterCard
        perPage={perPage}
        onPerPageChange={setPerPage}
        onReset={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      >
        <FilterGrid cols={4}>
          <Field>
            <div className="relative">
              <HugeiconsIcon
                icon={Search01Icon}
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Nama atau NIK..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
          </Field>
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
