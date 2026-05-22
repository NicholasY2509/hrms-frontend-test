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
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { FilterCard, FilterGrid } from "@/components/layout/filter-card"
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
import { format, parse } from "date-fns"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function UnpaidLeaveManagementClient() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const getParam = (key: string, defaultValue: string = "") =>
    searchParams.get(key) || defaultValue

  // Filters State
  const [search, setSearch] = React.useState(getParam("search"))
  const [page, setPage] = React.useState(Number(getParam("page", "1")))
  const [perPage, setPerPage] = React.useState(getParam("per_page", "15"))
  const [typeId, setTypeId] = React.useState<number | null>(
    searchParams.get("unpaid_leave_type_id")
      ? Number(searchParams.get("unpaid_leave_type_id"))
      : null
  )
  const [departmentId, setDepartmentId] = React.useState<number | null>(
    searchParams.get("department_id")
      ? Number(searchParams.get("department_id"))
      : null
  )
  const [status, setStatus] = React.useState<string>(getParam("status", "all"))
  const [settleStatus, setSettleStatus] = React.useState<string>(
    getParam("settle_status", "all")
  )

  // Date Range State
  const [startDate, setStartDate] = React.useState<Date | undefined>(() => {
    const start = searchParams.get("start_date")
    return start ? parse(start, "yyyy-MM-dd", new Date()) : undefined
  })
  const [endDate, setEndDate] = React.useState<Date | undefined>(() => {
    const end = searchParams.get("end_date")
    return end ? parse(end, "yyyy-MM-dd", new Date()) : undefined
  })

  const debouncedSearch = useDebounce(search, 500)

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

  // Update URL when debounced search changes
  React.useEffect(() => {
    if (debouncedSearch !== getParam("search")) {
      updateQuery({ search: debouncedSearch })
    }
  }, [debouncedSearch, updateQuery])

  const activeFilters = React.useMemo(
    () => ({
      search: debouncedSearch,
      unpaid_leave_type_id: typeId || undefined,
      department_id: departmentId || undefined,
      status: status === "all" ? undefined : status,
      settle_status: settleStatus === "all" ? undefined : settleStatus,
      start_date: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
      end_date: endDate ? format(endDate, "yyyy-MM-dd") : undefined,
    }),
    [
      debouncedSearch,
      typeId,
      departmentId,
      status,
      settleStatus,
      startDate,
      endDate,
    ]
  )

  const { items, meta, isLoading } = useUnpaidLeaveManagementList({
    ...activeFilters,
    page,
    per_page: Number(perPage),
  })

  const handleView = (item: UnpaidLeave) => {
    router.push(`/management/unpaid-leave/${item.id}`)
  }

  const handleResetFilters = () => {
    setSearch("")
    setPage(1)
    setTypeId(null)
    setDepartmentId(null)
    setStatus("all")
    setSettleStatus("all")
    setStartDate(undefined)
    setEndDate(undefined)
    router.replace(pathname, { scroll: false })
  }

  const columns = React.useMemo(() => getUnpaidLeaveColumns(handleView), [])

  const hasActiveFilters =
    search !== "" ||
    typeId !== null ||
    departmentId !== null ||
    status !== "all" ||
    settleStatus !== "all" ||
    startDate !== undefined ||
    endDate !== undefined

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

      <FilterCard
        onReset={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
        perPage={perPage}
        onPerPageChange={(v) => {
          setPerPage(v)
          updateQuery({ per_page: v })
        }}
      >
        <FilterGrid cols={4}>
          <InputGroup className="bg-background">
            <InputGroupAddon>
              <HugeiconsIcon
                icon={Search01Icon}
                className="text-muted-foreground"
                size={14}
              />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Cari nama karyawan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>

          <UnpaidLeaveTypePicker
            value={typeId}
            onChange={(v) => {
              setTypeId(v)
              updateQuery({ unpaid_leave_type_id: v })
            }}
            placeholder="Semua Tipe Izin"
          />

          <DepartmentPicker
            value={departmentId}
            onChange={(v) => {
              setDepartmentId(v)
              updateQuery({ department_id: v })
            }}
            placeholder="Semua Departemen"
          />

          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v)
              updateQuery({ status: v })
            }}
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
            value={settleStatus}
            onValueChange={(v) => {
              setSettleStatus(v)
              updateQuery({ settle_status: v })
            }}
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
