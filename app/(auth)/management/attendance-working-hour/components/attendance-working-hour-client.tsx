"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  Upload01Icon,
} from "@hugeicons/core-free-icons";
import { DataTable } from "@/components/data-table/data-table";
import { PageHeader } from "@/components/layout/page-header";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useDebounce } from "@/hooks/use-debounce";
import { useWorkingHourList } from "@/modules/attendance/working-hours/hooks/use-working-hours";
import { getColumns } from "../columns";
import { ManagementFilter } from "@/components/layout/management-filter";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ImportWorkingHourDialog } from "@/modules/attendance/working-hours/components/import-working-hour-dialog";
import { AttendanceWorkingHourEditDialog } from "@/modules/attendance/working-hours/components/attendance-working-hour-edit-dialog";
import { WorkingHourModel } from "@/modules/attendance/working-hours/types";
import { useActivityStore } from "@/hooks/use-activity-store";
import { DatePicker } from "@/components/ui/date-picker";
import { useUrlFilters } from "@/hooks/use-url-filters";

export function AttendanceWorkingHourClient() {
  const { filters, setFilter, resetFilters, hasActiveFilters } = useUrlFilters({
    page: 1,
    per_page: 15,
    search: "",
    employee_id: null as number | null,
    start_date: undefined as string | undefined,
    end_date: undefined as string | undefined,
  });

  const [isImportOpen, setIsImportOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<WorkingHourModel | null>(null);
  const [activeTaskId, setActiveTaskId] = React.useState<string | number | null>(null);

  const activities = useActivityStore((state) => state.activities);

  const debouncedSearch = useDebounce(filters.search, 500);

  const { items, meta, isLoading, mutate } = useWorkingHourList({
    search: debouncedSearch,
    page: filters.page,
    per_page: Number(filters.per_page),
    employee_id: filters.employee_id ? Number(filters.employee_id) : undefined,
    start_date: filters.start_date,
    end_date: filters.end_date,
  });

  const handleEdit = (item: WorkingHourModel) => {
    setSelectedItem(item);
    setIsEditOpen(true);
  };

  const columns = React.useMemo(() => getColumns(handleEdit), []);

  // Watch for task completion to refetch data
  React.useEffect(() => {
    if (activeTaskId && activities[activeTaskId]?.status === "completed") {
      mutate();
      setActiveTaskId(null);
    }
  }, [activeTaskId, activities, mutate]);

  return (
    <div className="space-y-6 w-full min-w-0">
      <PageHeader
        title="Jadwal Kerja Karyawan"
        description="Kelola dan pantau jadwal kerja serta shift harian karyawan."
      >
        <Button
          className="flex flex-row items-center gap-2"
          onClick={() => setIsImportOpen(true)}
        >
          <HugeiconsIcon icon={Upload01Icon} />
          Import Jam Kerja Pegawai
        </Button>
      </PageHeader>

      <ImportWorkingHourDialog
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
        onImportStarted={setActiveTaskId}
      />

      <AttendanceWorkingHourEditDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        data={selectedItem}
        onSuccess={mutate}
      />

      <ManagementFilter
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
        perPage={String(filters.per_page)}
        onPerPageChange={(v) => setFilter('per_page', v)}
        search={{ value: filters.search, onChange: (v) => setFilter('search', v), placeholder: "Cari karyawan..." }}
        employee={{ value: filters.employee_id ? Number(filters.employee_id) : null, onChange: (v) => setFilter('employee_id', v), placeholder: "Filter Karyawan" }}
        startDate={{ value: filters.start_date ? new Date(filters.start_date) : undefined, onChange: (d) => setFilter('start_date', d ? format(d, 'yyyy-MM-dd') : undefined), placeholder: "Tanggal Mulai" }}
        endDate={{ value: filters.end_date ? new Date(filters.end_date) : undefined, onChange: (d) => setFilter('end_date', d ? format(d, 'yyyy-MM-dd') : undefined), placeholder: "Tanggal Selesai" }}
      />

      <DataTable
        columns={columns}
        data={items}
        isLoading={isLoading}
        pagination={
          meta
            ? {
              ...meta,
              onPageChange: (p) => setFilter('page', p),
            }
            : undefined
        }
      />
    </div>
  );
}
