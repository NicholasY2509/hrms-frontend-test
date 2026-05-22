"use client"

import * as React from "react"
import { DataTable } from "@/components/data-table/data-table"
import { PageHeader } from "@/components/layout/page-header"
import { useManagementShiftExchangeList } from "@/modules/shift-exchange/hooks/use-shift-exchange"
import { getShiftExchangeColumns } from "../columns"
import { ShiftExchange } from "@/modules/shift-exchange/types"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { FilterCard, FilterGrid } from "@/components/layout/filter-card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { format, parse } from "date-fns"

export default function ShiftExchangeClient() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const getParam = (key: string, defaultValue: string = "") =>
    searchParams.get(key) || defaultValue

  // Filters State
  const [page, setPage] = React.useState(Number(getParam("page", "1")))
  const [perPage, setPerPage] = React.useState(getParam("per_page", "15"))
  const [isSettled, setIsSettled] = React.useState<string>(
    getParam("is_settled", "all")
  )

  const [startDate, setStartDate] = React.useState<Date | undefined>(() => {
    const start = searchParams.get("start_date")
    return start ? parse(start, "yyyy-MM-dd", new Date()) : undefined
  })
  const [endDate, setEndDate] = React.useState<Date | undefined>(() => {
    const end = searchParams.get("end_date")
    return end ? parse(end, "yyyy-MM-dd", new Date()) : undefined
  })

  const updateQuery = React.useCallback(
    (updates: Record<string, string | number | null | undefined>) => {
      const params = new URLSearchParams(searchParams.toString())

      Object.entries(updates).forEach(([key, value]) => {
        if (
          value === null ||
          value === undefined ||
          value === "" ||
          value === "all"
        ) {
          params.delete(key)
        } else {
          params.set(key, String(value))
        }
      })

      if (!updates.hasOwnProperty("page")) {
        params.set("page", "1")
        setPage(1)
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  const activeFilters = React.useMemo(
    () => ({
      is_settled: isSettled === "all" ? undefined : isSettled,
      start_date: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
      end_date: endDate ? format(endDate, "yyyy-MM-dd") : undefined,
    }),
    [isSettled, startDate, endDate]
  )

  const { items, meta, isLoading } = useManagementShiftExchangeList({
    ...activeFilters,
    page,
    per_page: Number(perPage),
  })

  const handleView = (item: ShiftExchange) => {
    router.push(`/management/shift-exchange/${item.id}`)
  }

  const handleResetFilters = () => {
    setPage(1)
    setIsSettled("all")
    setStartDate(undefined)
    setEndDate(undefined)
    router.replace(pathname, { scroll: false })
  }

  const columns = React.useMemo(() => getShiftExchangeColumns(handleView), [])

  const hasActiveFilters =
    isSettled !== "all" || startDate !== undefined || endDate !== undefined

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen Tukar Shift"
        description="Tinjau dan kelola permohonan tukar shift karyawan."
      />

      <FilterCard
        onReset={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
        perPage={perPage}
        onPerPageChange={(v) => {
          setPerPage(v)
          updateQuery({ per_page: v })
        }}
      >
        <FilterGrid cols={3}>
          <Select
            value={isSettled}
            onValueChange={(v) => {
              setIsSettled(v)
              updateQuery({ is_settled: v })
            }}
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

          <DatePicker
            value={startDate}
            onChange={(date) => {
              setStartDate(date)
              updateQuery({
                start_date: date ? format(date, "yyyy-MM-dd") : undefined,
              })
            }}
            placeholder="Tanggal Mulai"
          />

          <DatePicker
            value={endDate}
            onChange={(date) => {
              setEndDate(date)
              updateQuery({
                end_date: date ? format(date, "yyyy-MM-dd") : undefined,
              })
            }}
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
                onPageChange: (p) => {
                  setPage(p)
                  updateQuery({ page: p })
                },
              }
            : undefined
        }
      />
    </div>
  )
}
