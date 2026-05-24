"use client"

import { useState } from "react"
import { useTaskList } from "@/modules/audit/hooks/use-tasks"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { PageHeader } from "@/components/layout/page-header"
import { PageError } from "@/components/layout/page-error"
import { getColumns } from "../columns"
import { TaskLog, TaskLogFilters } from "@/modules/audit/types"
import { ManagementFilter } from "@/components/layout/management-filter"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/use-debounce"
import { format } from "date-fns"
import { TaskLogDetail } from "@/modules/audit/components/task-log-detail"

export function TaskLogClient() {
  const [filters, setFilters] = useState<TaskLogFilters>({
    per_page: 15,
    page: 1,
  })

  const [selectedLog, setSelectedLog] = useState<TaskLog | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const debouncedFilters = useDebounce(filters, 500)

  const { items, meta, isLoading, isError } = useTaskList(debouncedFilters)

  const handleView = (log: TaskLog) => {
    setSelectedLog(log)
    setIsDetailOpen(true)
  }

  const updateFilter = (key: keyof TaskLogFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key === "page" ? value : 1,
    }))
  }

  const resetFilters = () => {
    setFilters({
      per_page: 15,
      page: 1,
    })
  }

  if (isError) return <PageError />

  const columns = getColumns(handleView)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Background Tasks Log"
        description="View system background tasks and scheduled job executions."
      />

      <ManagementFilter
        onReset={resetFilters}
        hasActiveFilters={Object.keys(filters).length > 2}
        perPage={filters.per_page?.toString()}
        onPerPageChange={(v) => updateFilter("per_page", parseInt(v))}
        search={{
          value: filters.search || "",
          onChange: (v) => updateFilter("search", v),
          placeholder: "Search tasks...",
        }}
        startDate={{
          value: filters.start_date ? new Date(filters.start_date) : undefined,
          onChange: (date) =>
            updateFilter(
              "start_date",
              date ? format(date, "yyyy-MM-dd") : undefined
            ),
          placeholder: "Start Date",
        }}
        endDate={{
          value: filters.end_date ? new Date(filters.end_date) : undefined,
          onChange: (date) =>
            updateFilter(
              "end_date",
              date ? format(date, "yyyy-MM-dd") : undefined
            ),
          placeholder: "End Date",
        }}
      >
        <Input
          placeholder="Filter by type..."
          value={filters.type || ""}
          onChange={(e) => updateFilter("type", e.target.value)}
        />
        <Select
          value={filters.status || "all"}
          onValueChange={(v) =>
            updateFilter("status", v === "all" ? undefined : v)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </ManagementFilter>

      {isLoading ? (
        <DataTableSkeleton columnCount={7} />
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

      <TaskLogDetail
        log={selectedLog}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  )
}
