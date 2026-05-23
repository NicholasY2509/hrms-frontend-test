"use client"

import * as React from "react"
import { DataTable } from "@/components/data-table/data-table"
import { PageHeader } from "@/components/layout/page-header"
import { useManagementShiftExchangeList } from "@/modules/shift-exchange/hooks/use-shift-exchange"
import { getShiftExchangeColumns } from "../columns"
import { ShiftExchange } from "@/modules/shift-exchange/types"
import { useRouter } from "next/navigation"
import { ManagementFilter } from "@/components/layout/management-filter"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { format } from "date-fns"
import { useUrlFilters } from "@/hooks/use-url-filters"

export default function ShiftExchangeClient() {
  const router = useRouter()
  const { filters, setFilter, resetFilters, hasActiveFilters } = useUrlFilters({
    page: 1,
    per_page: 15,
    is_settled: "all",
    start_date: undefined as string | undefined,
    end_date: undefined as string | undefined,
  })

  const activeFilters = React.useMemo(
    () => ({
      is_settled: filters.is_settled === "all" ? undefined : filters.is_settled,
      start_date: filters.start_date,
      end_date: filters.end_date,
    }),
    [filters]
  )

  const { items, meta, isLoading } = useManagementShiftExchangeList({
    ...activeFilters,
    page: filters.page,
    per_page: Number(filters.per_page),
  })

  const handleView = (item: ShiftExchange) => {
    router.push(`/management/shift-exchange/${item.id}`)
  }

  const columns = React.useMemo(() => getShiftExchangeColumns(handleView), [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen Tukar Shift"
        description="Tinjau dan kelola permohonan tukar shift karyawan."
      />

      <ManagementFilter
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
        perPage={String(filters.per_page)}
        onPerPageChange={(v) => setFilter("per_page", v)}
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
          value={String(filters.is_settled)}
          onValueChange={(v) => setFilter("is_settled", v)}
        >
          <SelectTrigger className="h-9 bg-background">
            <SelectValue placeholder="Semua Status Settle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status Settle</SelectItem>
            <SelectItem value="1">Settled</SelectItem>
            <SelectItem value="0">Unsettled</SelectItem>
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
