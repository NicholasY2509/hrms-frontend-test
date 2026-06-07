"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { UserGroup02Icon, DoorIcon, UserIcon } from "@hugeicons/core-free-icons"
import { EmployeeSummary } from "@/modules/employee/employee/types"

export function EmployeeSummaryCards({ summary }: { summary: EmployeeSummary[] }) {

  return (
    <>
      {summary.map((item) => {
        let icon = UserIcon
        let colorClass = "text-muted-foreground"
        let bgClass = "bg-muted/10"

        if (item.name.toLowerCase().includes("active")) {
          icon = UserGroup02Icon
          colorClass = "text-white"
          bgClass = "bg-primary"
        } else if (item.name.toLowerCase().includes("resign")) {
          icon = DoorIcon
          colorClass = "text-primary"
          bgClass = "bg-primary/10"
        } else if (item.name.toLowerCase().includes("nonaktif")) {
          icon = UserIcon
          colorClass = "text-rose-600"
          bgClass = "bg-rose-500/10"
        }

        return (
          <div
            key={item.id}
            className="flex items-center gap-5 rounded-lg border bg-card p-5 transition-all hover:shadow-md"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${bgClass} ${colorClass}`}
            >
              <HugeiconsIcon icon={icon} size={24} />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-muted-foreground">
                {item.name}
              </p>
              <p className="text-3xl font-bold tracking-tight">
                {item.count.toLocaleString()}
              </p>
            </div>
          </div>
        )
      })}
    </>
  )
}

export function EmployeeSummaryCardsSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex animate-pulse items-center gap-5 rounded-2xl border bg-card p-5"
        >
          <div className="h-12 w-12 rounded-xl bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-20 rounded bg-muted" />
            <div className="h-8 w-12 rounded bg-muted" />
          </div>
        </div>
      ))}
    </>
  )
}
