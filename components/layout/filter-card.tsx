"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { FilterIcon, Cancel01Icon } from "@hugeicons/core-free-icons"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface FilterCardProps {
  title?: string
  onReset?: () => void
  hasActiveFilters?: boolean
  children: React.ReactNode
  className?: string
  perPage?: string
  onPerPageChange?: (value: string) => void
}

export function FilterCard({
  title = "Filter & Pencarian",
  onReset,
  hasActiveFilters,
  children,
  className,
  perPage,
  onPerPageChange
}: FilterCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardContent className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
            <div className="p-1.5 rounded-md bg-primary/10 text-primary flex items-center justify-center">
              <HugeiconsIcon icon={FilterIcon} size={16} />
            </div>
            <span>{title}</span>
          </div>

          <div className="flex items-center gap-3">
            {perPage && onPerPageChange && (
              <FilterPerPage value={perPage} onValueChange={onPerPageChange} />
            )}

            {perPage && hasActiveFilters && onReset && (
              <div className="w-px h-4 bg-border/60 mx-1" />
            )}

            {hasActiveFilters && onReset && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="h-8 text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all rounded-full px-3"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={14} className="mr-1.5" />
                Reset Filter
              </Button>
            )}
          </div>
        </div>
        {children}
      </CardContent>
    </Card>
  )
}

interface FilterGridProps {
  children: React.ReactNode
  className?: string
  cols?: 1 | 2 | 3 | 4 | 5 | 6
}

export function FilterGrid({ children, className, cols = 4 }: FilterGridProps) {
  const colClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5",
    6: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6",
  }

  return (
    <div className={cn("grid gap-3 items-end", colClasses[cols], className)}>
      {children}
    </div>
  )
}

interface FilterPerPageProps {
  value: string
  onValueChange: (value: string) => void
  label?: string
  className?: string
}

export function FilterPerPage({
  value,
  onValueChange,
  label = "Tampilkan:",
  className
}: FilterPerPageProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
        {label}
      </span>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-[72px] bg-background h-9 px-2 text-xs shadow-none border-border/60 focus:ring-1 focus:ring-primary/20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="15">15</SelectItem>
          <SelectItem value="30">30</SelectItem>
          <SelectItem value="50">50</SelectItem>
          <SelectItem value="100">100</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
