"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  ReloadIcon,
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
import { useZktecoMachines } from "@/modules/attendance/zkteco/hooks/use-zkteco";
import { columns } from "../columns";
import { FilterCard, FilterGrid } from "@/components/layout/filter-card";

export function FingerprintMachinesClient() {
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState("15");

  const debouncedSearch = useDebounce(search, 500);

  const { items, meta, isLoading, mutate } = useZktecoMachines({
    search: debouncedSearch,
    page,
    per_page: Number(perPage),
  });

  const handleResetFilters = () => {
    setSearch("");
    setPage(1);
  };

  const handleRefresh = () => {
    mutate();
  };

  const hasActiveFilters = search !== "";

  return (
    <div className="space-y-6 w-full min-w-0">
      <PageHeader
        title="Mesin Absensi Biometrik"
        description="Monitor status konektivitas dan konfigurasi jaringan mesin fingerprint ZKTeco."
      >
        <Button variant="outline" onClick={handleRefresh} className="gap-2">
          <HugeiconsIcon icon={ReloadIcon} size={18} />
          Refresh Status
        </Button>
      </PageHeader>

      <FilterCard
        onReset={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
        perPage={perPage}
        onPerPageChange={setPerPage}
      >
        <FilterGrid cols={4}>
          <InputGroup>
            <InputGroupAddon>
              <HugeiconsIcon
                icon={Search01Icon}
                className="text-muted-foreground"
                size={14}
              />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Cari nama mesin atau SN..."
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
