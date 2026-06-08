"use client"

import * as React from "react"
import { Suspense } from "react"
import dynamic from "next/dynamic"
import { HugeiconsIcon } from "@hugeicons/react"
import { UserIcon } from "@hugeicons/core-free-icons"
import { DataTable } from "@/components/data-table/data-table"
import { PageHeader } from "@/components/layout/page-header"
import { useDebounce } from "@/hooks/use-debounce"
import { useManagementEmployees, useManagementEmployeeSummary } from "@/modules/employee/employee/hooks/use-employees"
import { getEmployeeColumns } from "../columns"
import { Employee } from "@/modules/employee/employee/types"
import { useRouter } from "next/navigation"
import { ManagementFilter } from "@/components/layout/management-filter"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useUrlFilters } from "@/hooks/use-url-filters"

import { Button } from "@/components/ui/button"

const ExportEmployeeDialog = dynamic(
  () => import("@/modules/employee/employee/components/export-employee-dialog").then((mod) => mod.ExportEmployeeDialog),
  { ssr: false }
)
import {
  EmployeeSummaryCards,
  EmployeeSummaryCardsSkeleton,
} from "./employee-summary-cards"

export function EmployeeManagementClient() {
  const router = useRouter()

  const { filters, setFilter, resetFilters, hasActiveFilters } = useUrlFilters({
    page: 1,
    per_page: 15,
    search: "",
    department_id: null as number | null,
    team_id: null as number | null,
    location_id: null as number | null,
    position_id: null as number | null,
    work_status_id: "all",
    employee_status_id: "all",
    supervisor_employee_id: null as number | null,
  })

  const debouncedSearch = useDebounce(filters.search, 500)

  const activeFilters = React.useMemo(
    () => ({
      search: debouncedSearch,
      department_id: filters.department_id
        ? Number(filters.department_id)
        : undefined,
      team_id: filters.team_id ? Number(filters.team_id) : undefined,
      work_location_id: filters.location_id
        ? Number(filters.location_id)
        : undefined,
      work_position_id: filters.position_id
        ? Number(filters.position_id)
        : undefined,
      work_employee_status_id:
        filters.work_status_id === "all" ? undefined : filters.work_status_id,
      employee_status_id:
        filters.employee_status_id === "all"
          ? undefined
          : filters.employee_status_id,
      supervisor_employee_id: filters.supervisor_employee_id
        ? Number(filters.supervisor_employee_id)
        : undefined,
    }),
    [debouncedSearch, filters]
  )

  const { employees, meta, isLoading } = useManagementEmployees({
    ...activeFilters,
    page: filters.page,
    per_page: Number(filters.per_page),
  })

  const { summary, isLoading: isSummaryLoading } = useManagementEmployeeSummary()

  const handleView = (item: Employee) => {
    router.push(`/management/employees/${item.id}`)
  }

  const columns = React.useMemo(() => getEmployeeColumns(handleView), [])

  return (
    <div className="w-full min-w-0 space-y-6">
      <PageHeader
        title="Data Karyawan"
        description="Kelola dan pantau data profil seluruh karyawan."
      >
        <div className="flex items-center gap-2">
          <ExportEmployeeDialog currentFilters={activeFilters} />
          <Button onClick={() => router.push("/management/employees/create")}>
            <HugeiconsIcon icon={UserIcon} className="mr-2 h-4 w-4" />
            Tambah Karyawan
          </Button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {isSummaryLoading ? (
          <EmployeeSummaryCardsSkeleton />
        ) : (
          <EmployeeSummaryCards summary={summary} />
        )}
      </div>

      <ManagementFilter
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
        perPage={String(filters.per_page)}
        onPerPageChange={(v) => setFilter("per_page", v)}
        search={{
          value: filters.search,
          onChange: (v) => setFilter("search", v),
          placeholder: "Cari nama atau NIK...",
        }}
        department={{
          value: filters.department_id ? Number(filters.department_id) : null,
          onChange: (v) => setFilter("department_id", v),
          placeholder: "Semua Departemen",
        }}
        supervisor={{
          value: filters.supervisor_employee_id
            ? Number(filters.supervisor_employee_id)
            : null,
          onChange: (v) => setFilter("supervisor_employee_id", v),
          placeholder: "Semua Supervisor",
        }}
        workPosition={{
          value: filters.position_id ? Number(filters.position_id) : null,
          onChange: (v) => setFilter("position_id", v),
          placeholder: "Semua Jabatan",
        }}
        workLocation={{
          value: filters.location_id ? Number(filters.location_id) : null,
          onChange: (v) => setFilter("location_id", v),
          placeholder: "Semua Lokasi",
        }}
        team={{
          value: filters.team_id ? Number(filters.team_id) : null,
          onChange: (v) => setFilter("team_id", v),
          placeholder: "Semua Tim",
        }}
      >
        <Select
          value={String(filters.work_status_id)}
          onValueChange={(v) => setFilter("work_status_id", v)}
        >
          <SelectTrigger className="h-7 bg-background text-xs">
            <SelectValue placeholder="Semua Status Karyawan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status Karyawan</SelectItem>
            <SelectItem value="1">Aktif</SelectItem>
            <SelectItem value="3">Tidak Aktif</SelectItem>
            <SelectItem value="2">Resign</SelectItem>
          </SelectContent>
        </Select>
      </ManagementFilter>

      <DataTable
        columns={columns}
        data={employees}
        isLoading={isLoading}
        pagination={
          meta
            ? {
              ...meta,
              onPageChange: (p) => setFilter("page", p),
            }
            : undefined
        }
      />
    </div>
  )
}
