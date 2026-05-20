"use client";

import { useState } from "react";
import { useAuditLogList } from "@/modules/audit/hooks/use-audit-log";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { PageHeader } from "@/components/layout/page-header";
import { PageError } from "@/components/layout/page-error";
import { getColumns } from "../columns";
import { AuditLog, AuditLogFilters } from "@/modules/audit/types";
import { AuditLogDetail } from "@/modules/audit/components/audit-log-detail";
import { FilterCard, FilterGrid } from "@/components/layout/filter-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDebounce } from "@/hooks/use-debounce";
import { format } from "date-fns";

export function AuditLogClient() {
  const [filters, setFilters] = useState<AuditLogFilters>({
    per_page: 15,
    page: 1,
  });

  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const debouncedFilters = useDebounce(filters, 500);

  const { items, meta, isLoading, isError } = useAuditLogList(debouncedFilters);

  const handleView = (log: AuditLog) => {
    setSelectedLog(log);
    setIsDetailOpen(true);
  };

  const updateFilter = (key: keyof AuditLogFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const resetFilters = () => {
    setFilters({
      per_page: 15,
      page: 1,
    });
  };

  if (isError) return <PageError />;

  const columns = getColumns(handleView);

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Activity Log"
        description="View all system activities and attribute changes across the application."
      />

      <FilterCard
        onReset={resetFilters}
        hasActiveFilters={Object.keys(filters).length > 2}
        perPage={filters.per_page?.toString()}
        onPerPageChange={(v) => updateFilter("per_page", parseInt(v))}
      >
        <FilterGrid cols={4}>
          <div className="space-y-2">
            <Label>Log Name</Label>
            <Input
              placeholder="Filter by log name..."
              value={filters.log_name || ""}
              onChange={(e) => updateFilter("log_name", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Event</Label>
            <Select
              value={filters.event || "all"}
              onValueChange={(v) => updateFilter("event", v === "all" ? undefined : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Events" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="created">Created</SelectItem>
                <SelectItem value="updated">Updated</SelectItem>
                <SelectItem value="deleted">Deleted</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Start Date</Label>
            <DatePicker
              value={filters.start_date ? new Date(filters.start_date) : undefined}
              onChange={(date) => updateFilter("start_date", date ? format(date, "yyyy-MM-dd") : undefined)}
              placeholder="Start Date"
            />
          </div>
          <div className="space-y-2">
            <Label>End Date</Label>
            <DatePicker
              value={filters.end_date ? new Date(filters.end_date) : undefined}
              onChange={(date) => updateFilter("end_date", date ? format(date, "yyyy-MM-dd") : undefined)}
              placeholder="End Date"
            />
          </div>
        </FilterGrid>
      </FilterCard>

      {isLoading ? (
        <DataTableSkeleton columnCount={6} />
      ) : (
        <DataTable
          columns={columns}
          data={items}
          pagination={
            meta
              ? {
                ...meta,
                onPageChange: (p) => updateFilter("page", p),
              }
              : undefined
          }
        />
      )}

      <AuditLogDetail
        log={selectedLog}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
}
