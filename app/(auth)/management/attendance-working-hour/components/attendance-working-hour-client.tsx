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
import { FilterCard, FilterGrid } from "@/components/layout/filter-card";
import { EmployeePicker } from "@/modules/employee/employee/components/employee-picker";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ImportWorkingHourDialog } from "@/modules/attendance/working-hours/components/import-working-hour-dialog";
import { AttendanceWorkingHourEditDialog } from "@/modules/attendance/working-hours/components/attendance-working-hour-edit-dialog";
import { WorkingHourModel } from "@/modules/attendance/working-hours/types";
import { useActivityStore } from "@/hooks/use-activity-store";
import { DatePicker } from "@/components/ui/date-picker";

export function AttendanceWorkingHourClient() {
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState("15");
  const [employeeId, setEmployeeId] = React.useState<number | null>(null);
  const [startDate, setStartDate] = React.useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = React.useState<Date | undefined>(undefined);
  const [isImportOpen, setIsImportOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<WorkingHourModel | null>(null);
  const [activeTaskId, setActiveTaskId] = React.useState<string | number | null>(null);

  const activities = useActivityStore((state) => state.activities);

  const debouncedSearch = useDebounce(search, 500);

  const { items, meta, isLoading, mutate } = useWorkingHourList({
    search: debouncedSearch,
    page,
    per_page: Number(perPage),
    employee_id: employeeId || undefined,
    start_date: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
    end_date: endDate ? format(endDate, "yyyy-MM-dd") : undefined,
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

  const handleResetFilters = () => {
    setSearch("");
    setEmployeeId(null);
    setStartDate(undefined);
    setEndDate(undefined);
    setPage(1);
  };

  const hasActiveFilters =
    search !== "" ||
    employeeId !== null ||
    startDate !== undefined ||
    endDate !== undefined;

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
              placeholder="Cari karyawan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>

          <EmployeePicker
            value={employeeId}
            onChange={(val) => setEmployeeId(val)}
            placeholder="Filter Karyawan"
          />

          <DatePicker
            value={startDate}
            onChange={setStartDate}
            placeholder="Tanggal Mulai"
          />

          <DatePicker
            value={endDate}
            onChange={setEndDate}
            placeholder="Tanggal Selesai"
          />
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
