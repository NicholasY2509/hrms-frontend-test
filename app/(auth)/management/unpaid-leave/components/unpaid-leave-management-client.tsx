"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon, Calendar01Icon } from "@hugeicons/core-free-icons"
import { DataTable } from "@/components/data-table/data-table"
import { PageHeader } from "@/components/layout/page-header"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { useDebounce } from "@/hooks/use-debounce"
import { useUnpaidLeaveManagementList } from "@/modules/unpaid-leave/hooks/use-unpaid-leave"
import { getUnpaidLeaveColumns } from "../columns"
import { UnpaidLeave } from "@/modules/unpaid-leave/types"
import { useRouter } from "next/navigation"
import { ManagementFilter } from "@/components/layout/management-filter"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DepartmentPicker } from "@/modules/organization/department/components/department-picker"
import { UnpaidLeaveTypePicker } from "@/modules/unpaid-leave/components/unpaid-leave-type-picker"
import { DatePicker } from "@/components/ui/date-picker"
import { format } from "date-fns"
import { useUrlFilters } from "@/hooks/use-url-filters"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function UnpaidLeaveManagementClient() {
  const router = useRouter()
  const { filters, setFilter, resetFilters, hasActiveFilters } = useUrlFilters({
    page: 1,
    per_page: 15,
    search: "",
    unpaid_leave_type_id: null as number | null,
    department_id: null as number | null,
    status: "all",
    settle_status: "all",
    start_date: undefined as string | undefined,
    end_date: undefined as string | undefined,
  })

  const debouncedSearch = useDebounce(filters.search, 500)

  const activeFilters = React.useMemo(
    () => ({
      search: debouncedSearch,
      unpaid_leave_type_id: filters.unpaid_leave_type_id ? Number(filters.unpaid_leave_type_id) : undefined,
      department_id: filters.department_id ? Number(filters.department_id) : undefined,
      status: filters.status === "all" ? undefined : filters.status,
      settle_status: filters.settle_status === "all" ? undefined : filters.settle_status,
      start_date: filters.start_date,
      end_date: filters.end_date,
    }),
    [
      debouncedSearch,
      filters,
    ]
  )

  const { items, meta, isLoading } = useUnpaidLeaveManagementList({
    ...activeFilters,
    page: filters.page,
    per_page: Number(filters.per_page),
  })

  const handleView = (item: UnpaidLeave) => {
    router.push(`/management/unpaid-leave/${item.id}`)
  }

  const columns = React.useMemo(() => getUnpaidLeaveColumns(handleView), [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengajuan Izin"
        description="Tinjau dan kelola permohonan izin karyawan."
      >
        <Button asChild variant="outline">
          <Link href="/management/unpaid-leave/calendar">
            <HugeiconsIcon icon={Calendar01Icon} className="mr-2" size={16} />
            Lihat Kalender
          </Link>
        </Button>
      </PageHeader>

      <ManagementFilter
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
        perPage={String(filters.per_page)}
        onPerPageChange={(v) => setFilter("per_page", v)}
        search={{ value: filters.search, onChange: (v) => setFilter("search", v), placeholder: "Cari nama karyawan..." }}
        unpaidLeaveType={{
          value: filters.unpaid_leave_type_id ? Number(filters.unpaid_leave_type_id) : null,
          onChange: (v) => setFilter("unpaid_leave_type_id", v),
          placeholder: "Semua Tipe Izin"
        }}
        department={{
          value: filters.department_id ? Number(filters.department_id) : null,
          onChange: (v) => setFilter("department_id", v),
          placeholder: "Semua Departemen"
        }}
        startDate={{
          value: filters.start_date ? new Date(filters.start_date) : undefined,
          onChange: (date) => setFilter("start_date", date ? format(date, "yyyy-MM-dd") : undefined),
          placeholder: "Tanggal Mulai"
        }}
        endDate={{
          value: filters.end_date ? new Date(filters.end_date) : undefined,
          onChange: (date) => setFilter("end_date", date ? format(date, "yyyy-MM-dd") : undefined),
          placeholder: "Tanggal Selesai"
        }}
      >
        <Select
          value={String(filters.status)}
          onValueChange={(v) => setFilter("status", v)}
        >
          <SelectTrigger className="h-9 bg-background">
            <SelectValue placeholder="Semua Status Pengajuan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status Pengajuan</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={String(filters.settle_status)}
          onValueChange={(v) => setFilter("settle_status", v)}
        >
          <SelectTrigger className="h-9 bg-background">
            <SelectValue placeholder="Semua Status Settle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status Settle</SelectItem>
            <SelectItem value="settled">Settled</SelectItem>
            <SelectItem value="unsettled">Unsettled</SelectItem>
          </SelectContent>
        </Select>
      </ManagementFilter>

      <DataTable
        columns={columns}
        data={items}
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
