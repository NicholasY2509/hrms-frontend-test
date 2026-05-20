"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { DataTable } from "@/components/data-table/data-table";
import { PageHeader } from "@/components/layout/page-header";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useDebounce } from "@/hooks/use-debounce";
import { useAnnualLeaveList } from "@/modules/employee/annual-leave/hooks/use-annual-leave";
import { columns } from "../columns";
import { FilterCard, FilterGrid } from "@/components/layout/filter-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AnnualLeaveManagementClient() {
  // Filters State
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState("15");
  const [status, setStatus] = React.useState<string>("all");

  const debouncedSearch = useDebounce(search, 500);

  // Fetch Annual Leaves with all filters
  const { items, meta, isLoading } = useAnnualLeaveList({
    search: debouncedSearch,
    page,
    per_page: Number(perPage),
    status: status === "all" ? undefined : status,
  });

  const handleResetFilters = () => {
    setSearch("");
    setStatus("all");
    setPage(1);
  };

  const hasActiveFilters = search !== "" || status !== "all";

  return (
    <div className="space-y-6 w-full min-w-0">
      <PageHeader
        title="Daftar Cuti Tahunan"
        description="Pantau dan kelola penggunaan cuti tahunan karyawan."
      />

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
              placeholder="Cari nama karyawan atau NIK..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="bg-background h-9 border-border/60 shadow-none">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="Potong">Potong</SelectItem>
              <SelectItem value="Tambah">Tambah</SelectItem>
            </SelectContent>
          </Select>
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
