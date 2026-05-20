"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, Download01Icon, Database02Icon } from "@hugeicons/core-free-icons";
import { DataTable } from "@/components/data-table/data-table";
import { PageHeader } from "@/components/layout/page-header";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { useDebounce } from "@/hooks/use-debounce";
import { useAttendanceList } from "@/modules/attendance/attendances/hooks/use-attendance";
import { getAttendanceColumns } from "../columns";
import { AttendanceModel } from "@/modules/attendance/attendances/types";
import { AttendanceStatusPicker } from "@/modules/attendance/shared/components/attendance-status-picker";
import { EmployeePicker } from "@/modules/employee/employee/components/employee-picker";
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";
import { FilterCard, FilterGrid } from "@/components/layout/filter-card";
import { ExportAttendanceDialog } from "@/modules/attendance/attendances/components/export-attendance-dialog";
import { Button } from "@/components/ui/button";
import { CalculateAttendanceDialog } from "@/modules/attendance/attendances/components/calculate-attendance-dialog";
import { AttendanceDetailDialog } from "@/modules/attendance/attendances/components/attendance-detail-dialog";

export function AttendanceManagementClient() {
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState("15");
  const [statusId, setStatusId] = React.useState<number | null>(null);
  const [employeeId, setEmployeeId] = React.useState<number | null>(null);
  const [startDate, setStartDate] = React.useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = React.useState<Date | undefined>(undefined);
  const [isExportDialogOpen, setIsExportDialogOpen] = React.useState(false);
  const [isCalculateDialogOpen, setIsCalculateDialogOpen] = React.useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = React.useState(false);
  const [selectedAttendance, setSelectedAttendance] = React.useState<AttendanceModel | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  const { items, meta, isLoading } = useAttendanceList({
    search: debouncedSearch,
    page,
    per_page: Number(perPage),
    attendance_status_id: statusId || undefined,
    employee_id: employeeId || undefined,
    start_date: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
    end_date: endDate ? format(endDate, "yyyy-MM-dd") : undefined,
  });

  const handleResetFilters = () => {
    setSearch("");
    setStatusId(null);
    setEmployeeId(null);
    setStartDate(undefined);
    setEndDate(undefined);
    setPage(1);
  };

  const hasActiveFilters =
    search !== "" ||
    statusId !== null ||
    employeeId !== null ||
    startDate !== undefined ||
    endDate !== undefined;

  const handleView = (item: AttendanceModel) => {
    setSelectedAttendance(item);
    setIsDetailDialogOpen(true);
  };

  const columns = React.useMemo(() => getAttendanceColumns(handleView), []);

  return (
    <div className="space-y-6 w-full min-w-0">
      <PageHeader
        title="Manajemen Kehadiran"
        description="Pantau dan kelola data kehadiran karyawan harian."
      >
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setIsCalculateDialogOpen(true)}
          >
            <HugeiconsIcon icon={Database02Icon} size={16} />
            Hitung Kehadiran
          </Button>
          <Button
            variant="default"
            className="gap-2"
            onClick={() => setIsExportDialogOpen(true)}
          >
            <HugeiconsIcon icon={Download01Icon} size={16} />
            Laporan Kehadiran
          </Button>
        </div>
      </PageHeader>

      <FilterCard
        onReset={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
        perPage={perPage}
        onPerPageChange={setPerPage}
      >
        <FilterGrid cols={5}>
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

          <AttendanceStatusPicker
            value={statusId}
            onChange={(val) => setStatusId(val)}
            placeholder="Filter Status"
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
      <ExportAttendanceDialog
        open={isExportDialogOpen}
        onOpenChange={setIsExportDialogOpen}
      />
      <CalculateAttendanceDialog
        open={isCalculateDialogOpen}
        onOpenChange={setIsCalculateDialogOpen}
      />
      <AttendanceDetailDialog
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        attendance={selectedAttendance}
      />
    </div>
  );
}
