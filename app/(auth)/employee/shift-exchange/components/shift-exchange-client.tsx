"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import { useShiftExchangeList } from "@/modules/shift-exchange/hooks/use-shift-exchange"
import { HugeiconsIcon } from "@hugeicons/react"
import { Plus } from "@hugeicons/core-free-icons"
import { PageHeader } from "@/components/layout/page-header"
import Link from "next/link"
import { ShiftExchangeCard } from "@/modules/shift-exchange/components/employee-shift-exchange-card"
import { ShiftExchangeDetailSheet } from "@/modules/shift-exchange/components/employee-shift-exchange-detail-sheet"
import { ShiftExchange } from "@/modules/shift-exchange/types"

export default function ShiftExchangeClient() {
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(12)
  const [startDate, setStartDate] = React.useState<string | null>(null)
  const [endDate, setEndDate] = React.useState<string | null>(null)
  const [isSettled, setIsSettled] = React.useState<boolean | null>(null)

  const [selectedId, setSelectedId] = React.useState<number | null>(null)

  const { items, meta, isLoading, mutate } = useShiftExchangeList({
    page,
    per_page: perPage,
    start_date: startDate,
    end_date: endDate,
    is_settled: isSettled,
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Tukar Shift"
          description="Kelola dan ajukan penukaran shift Anda di sini."
        />
        <Link href="/employee/shift-exchange/create">
          <Button className="gap-2">
            <HugeiconsIcon icon={Plus} className="h-4 w-4" />
            Ajukan Tukar Shift
          </Button>
        </Link>
      </div>

      {/* Filter Placeholder */}
      <div className="flex items-center gap-4 rounded-xl border border-dashed bg-muted/20 p-4 text-sm text-muted-foreground">
        <p>Filter placeholders: Date Range, Status (Settled/Unsettled)</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed bg-muted/10 text-muted-foreground">
              Tidak ada data penukaran shift.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <ShiftExchangeCard
                  key={item.id}
                  shiftExchange={item}
                  onClick={(ex) => setSelectedId(ex.id)}
                />
              ))}
            </div>
          )}

          {meta && items.length > 0 && (
            <div className="mt-2">
              <DataTablePagination
                meta={meta}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          )}
        </div>
      )}

      <ShiftExchangeDetailSheet
        id={selectedId ?? 0}
        isOpen={!!selectedId}
        onClose={() => setSelectedId(null)}
      />
    </div>
  )
}
