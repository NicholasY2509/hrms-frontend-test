"use client"

import * as React from "react"
import { FilterCard, FilterGrid } from "@/components/layout/filter-card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon } from "@hugeicons/core-free-icons"

// Pickers
import { EmployeePicker } from "@/modules/employee/employee/components/employee-picker"
import { DepartmentPicker } from "@/modules/organization/department/components/department-picker"
import { AttendanceStatusPicker } from "@/modules/attendance/shared/components/attendance-status-picker"
import { DatePicker } from "@/components/ui/date-picker"
import { MonthPicker } from "@/components/ui/month-picker"
import { TeamPicker } from "@/modules/organization/teams/components/team-picker"
import { WorkLocationPicker } from "@/modules/organization/work-location/components/work-location-picker"
import { WorkPositionPicker } from "@/modules/organization/work-position/components/work-position-picker"
import { UnpaidLeaveTypePicker } from "@/modules/unpaid-leave/components/unpaid-leave-type-picker"

export interface ManagementFilterProps {
  // Pagination
  setPage?: (page: number) => void

  // Base FilterCard Props
  onReset: () => void
  hasActiveFilters: boolean
  perPage?: string
  onPerPageChange?: (v: string) => void

  // The fields
  search?: {
    value: string
    onChange: (v: string) => void
    placeholder?: string
  }
  employee?: {
    value: number | null
    onChange: (v: number | null) => void
    placeholder?: string
  }
  department?: {
    value: number | null
    onChange: (v: number | null) => void
    placeholder?: string
  }
  team?: {
    value: number | null
    onChange: (v: number | null) => void
    placeholder?: string
  }
  workLocation?: {
    value: number | null
    onChange: (v: number | null) => void
    placeholder?: string
  }
  workPosition?: {
    value: number | null
    onChange: (v: number | null) => void
    placeholder?: string
  }
  attendanceStatus?: {
    value: number | null
    onChange: (v: number | null) => void
    placeholder?: string
  }
  unpaidLeaveType?: {
    value: number | null
    onChange: (v: number | null) => void
    placeholder?: string
  }
  startDate?: {
    value: Date | undefined
    onChange: (v: Date | undefined) => void
    placeholder?: string
  }
  endDate?: {
    value: Date | undefined
    onChange: (v: Date | undefined) => void
    placeholder?: string
  }
  month?: {
    value: Date | undefined
    onChange: (v: Date | undefined) => void
    placeholder?: string
  }

  // Fallback for anything custom
  children?: React.ReactNode
}

export function ManagementFilter({
  setPage,
  onReset,
  hasActiveFilters,
  perPage,
  onPerPageChange,
  search,
  employee,
  department,
  team,
  workLocation,
  workPosition,
  attendanceStatus,
  unpaidLeaveType,
  startDate,
  endDate,
  month,
  children,
}: ManagementFilterProps) {
  // Local state for search to avoid typing lag with async URL updates
  const [localSearch, setLocalSearch] = React.useState(search?.value || "")

  React.useEffect(() => {
    setLocalSearch(search?.value || "")
  }, [search?.value])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setLocalSearch(val)
    if (search) {
      search.onChange(val)
      if (setPage) setPage(1)
    }
  }

  // Helper to wrap onChange with setPage(1)
  const withPageReset = <T,>(originalOnChange: (v: T) => void) => {
    return (v: T) => {
      originalOnChange(v)
      if (setPage) {
        setPage(1)
      }
    }
  }

  return (
    <FilterCard
      onReset={onReset}
      hasActiveFilters={hasActiveFilters}
      perPage={perPage}
      onPerPageChange={
        onPerPageChange ? withPageReset(onPerPageChange) : undefined
      }
    >
      <FilterGrid cols={4}>
        {search && (
          <InputGroup className="">
            <InputGroupAddon>
              <HugeiconsIcon
                icon={Search01Icon}
                className="text-muted-foreground"
                size={14}
              />
            </InputGroupAddon>
            <InputGroupInput
              placeholder={search.placeholder || "Cari..."}
              value={localSearch}
              onChange={handleSearchChange}
            />
          </InputGroup>
        )}

        {employee && (
          <EmployeePicker
            value={employee.value}
            onChange={withPageReset(employee.onChange)}
            placeholder={employee.placeholder || "Filter Karyawan"}
          />
        )}

        {department && (
          <DepartmentPicker
            value={department.value}
            onChange={withPageReset(department.onChange)}
            placeholder={department.placeholder || "Filter Departemen"}
          />
        )}

        {team && (
          <TeamPicker
            value={team.value}
            onChange={withPageReset(team.onChange)}
            placeholder={team.placeholder || "Filter Tim"}
          />
        )}

        {workLocation && (
          <WorkLocationPicker
            value={workLocation.value}
            onChange={withPageReset(workLocation.onChange)}
            placeholder={workLocation.placeholder || "Filter Lokasi Kerja"}
          />
        )}

        {workPosition && (
          <WorkPositionPicker
            value={workPosition.value}
            onChange={withPageReset(workPosition.onChange)}
            placeholder={workPosition.placeholder || "Filter Posisi"}
          />
        )}

        {unpaidLeaveType && (
          <UnpaidLeaveTypePicker
            value={unpaidLeaveType.value}
            onChange={withPageReset(unpaidLeaveType.onChange)}
            placeholder={unpaidLeaveType.placeholder || "Filter Jenis Cuti"}
          />
        )}

        {attendanceStatus && (
          <AttendanceStatusPicker
            value={attendanceStatus.value}
            onChange={withPageReset(attendanceStatus.onChange)}
            placeholder={attendanceStatus.placeholder || "Filter Status"}
          />
        )}

        {month && (
          <MonthPicker
            value={month.value}
            onChange={withPageReset(month.onChange)}
            placeholder={month.placeholder || "Filter Bulan"}
          />
        )}

        {startDate && (
          <DatePicker
            value={startDate.value}
            onChange={withPageReset(startDate.onChange)}
            placeholder={startDate.placeholder || "Tanggal Mulai"}
          />
        )}

        {endDate && (
          <DatePicker
            value={endDate.value}
            onChange={withPageReset(endDate.onChange)}
            placeholder={endDate.placeholder || "Tanggal Selesai"}
          />
        )}

        {children}
      </FilterGrid>
    </FilterCard>
  )
}
