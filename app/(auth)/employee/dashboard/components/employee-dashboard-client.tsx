"use client"

import * as React from "react"
import { useEmployeeDashboard } from "@/modules/system/hooks/use-employee-dashboard"
import { PageError } from "@/components/layout/page-error"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { parseISO } from "date-fns"

// Extracted Subcomponents from system module
import { SleekHeroBanner } from "@/modules/system/components/sleek-hero-banner"
import { TodayAttendanceCard } from "@/modules/system/components/today-attendance-card"
import { LeaveBalanceCard } from "@/modules/system/components/leave-balance-card"
import { AttendanceStatisticsChart } from "@/modules/system/components/attendance-statistics-chart"
import { QuickActionsGrid } from "@/modules/system/components/quick-actions-grid"
import { PendingRequestsWidget } from "@/modules/system/components/pending-requests-widget"
import { HolidaysCalendarWidget } from "@/modules/system/components/holidays-calendar-widget"

export function EmployeeDashboardClient() {
  const { data, isLoading, isError } = useEmployeeDashboard()

  // Get current greeting based on local time
  const getGreeting = React.useMemo(() => {
    const hours = new Date().getHours()
    if (hours >= 5 && hours < 12) return "Selamat Pagi"
    if (hours >= 12 && hours < 15) return "Selamat Siang"
    if (hours >= 15 && hours < 19) return "Selamat Sore"
    return "Selamat Malam"
  }, [])

  if (isLoading) return <DashboardSkeleton />
  if (isError || !data) return <PageError />

  const {
    employee,
    attendance,
    pending_requests,
    holidays,
    tenure,
    attendance_summary,
    attendance_rate,
  } = data

  // Format holidays to array, filter out regular Sundays ("Hari Minggu"), and sort chronologically
  const formattedHolidays = Object.entries(holidays)
    .map(([id, holiday]) => ({
      id,
      ...holiday,
      parsedDate: parseISO(holiday.date),
    }))
    .filter((holiday) => holiday.name.toLowerCase() !== "hari minggu")
    .sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime())

  return (
    <div className="flex-1 space-y-6 pb-20">
      {/* Sleek Hero Banner Area */}
      <SleekHeroBanner
        employee={employee}
        tenure={tenure}
        getGreeting={getGreeting}
      />

      {/* Quick Shortcuts */}
      <QuickActionsGrid />

      {/* Main Grid: Left Details & Today's Attendance, Right: Calendar & Requests */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Columns */}
        <div className="space-y-6 lg:col-span-2">
          {/* Top Widgets: Attendance & Leave Balance */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <TodayAttendanceCard attendance={attendance} />
            <LeaveBalanceCard employee={employee} />
          </div>

          {/* Attendance Stats Circular Gauge & Breakdown */}
          <AttendanceStatisticsChart
            attendance_rate={attendance_rate}
            attendance_summary={attendance_summary}
          />
        </div>

        {/* Right 1 Column (Requests & Holidays) */}
        <div className="space-y-6">
          <PendingRequestsWidget pending_requests={pending_requests} />
          <HolidaysCalendarWidget formattedHolidays={formattedHolidays} />
        </div>
      </div>
    </div>
  )
}

// Gorgeous Dashboard Loading Skeleton
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Skeleton Banner */}
      <div className="flex flex-col justify-between gap-6 rounded-2xl border border-border/40 bg-card p-6 md:flex-row md:items-center">
        <div className="flex items-center gap-4.5">
          <Skeleton className="size-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-6 w-56 rounded-lg" />
            <Skeleton className="h-4 w-72 rounded" />
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-5">
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-16 rounded" />
            <Skeleton className="h-5 w-24 rounded" />
          </div>
          <div className="h-8 w-px bg-border/45" />
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-16 rounded" />
            <Skeleton className="h-5 w-32 rounded" />
          </div>
        </div>
      </div>

      {/* Short cuts skeleton */}
      <div className="grid grid-cols-3 gap-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-10 rounded-xl" />
        ))}
      </div>

      {/* Main Skeleton Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column Skeleton */}
        <div className="space-y-6 lg:col-span-2">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Today's scan skeleton */}
            <Card className="space-y-4 border border-border/40 bg-card p-5">
              <div className="flex items-center justify-between">
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-28 rounded" />
                  <Skeleton className="h-3 w-36 rounded" />
                </div>
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-14 rounded-lg" />
                <Skeleton className="h-14 rounded-lg" />
              </div>
              <Skeleton className="h-5 w-full rounded" />
            </Card>

            {/* Leave balance skeleton */}
            <Card className="space-y-4 border border-border/40 bg-card p-5">
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton className="h-3 w-40 rounded" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-16 rounded-lg" />
                <Skeleton className="h-16 rounded-lg" />
              </div>
              <Skeleton className="h-8 w-full rounded" />
            </Card>
          </div>

          {/* Stats chart skeleton */}
          <Card className="space-y-4 border border-border/40 bg-card p-5">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-40 rounded" />
              <Skeleton className="h-3 w-56 rounded" />
            </div>
            <div className="flex flex-col items-center gap-6 pt-2 md:flex-row">
              <Skeleton className="size-28 shrink-0 rounded-full" />
              <div className="grid w-full flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-14 rounded-xl" />
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column Skeleton */}
        <div className="space-y-6">
          {/* Pending requests skeleton */}
          <Card className="space-y-4 border border-border/40 bg-card p-5">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-3 w-44 rounded" />
            </div>
            <div className="space-y-3.5">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          </Card>

          {/* Holidays calendar skeleton */}
          <Card className="space-y-4 border border-border/40 bg-card p-5">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-3 w-36 rounded" />
            </div>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-14 rounded-xl" />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
