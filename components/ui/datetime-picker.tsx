"use client"

import * as React from "react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Calendar01Icon, ChevronDown } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Matcher } from "react-day-picker"

interface DateTimePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean | Matcher | Matcher[]
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Pilih tanggal & waktu",
  className,
  disabled,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [month, setMonth] = React.useState<Date | undefined>(
    value || new Date()
  )

  const parsedTime = React.useMemo(() => {
    if (!value) return { hour: "00", minute: "00" }
    return {
      hour: value.getHours().toString().padStart(2, "0"),
      minute: value.getMinutes().toString().padStart(2, "0"),
    }
  }, [value])

  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  )
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  )

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      onChange?.(undefined)
      return
    }
    const newDate = new Date(date)
    if (value) {
      newDate.setHours(value.getHours(), value.getMinutes(), 0, 0)
    } else {
      newDate.setHours(0, 0, 0, 0)
    }
    onChange?.(newDate)
  }

  const handleTimeChange = (type: "hour" | "minute", newValue: string) => {
    const newDate = value ? new Date(value) : new Date()
    if (type === "hour") {
      newDate.setHours(parseInt(newValue, 10))
    } else {
      newDate.setMinutes(parseInt(newValue, 10))
    }
    onChange?.(newDate)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled === true}
          className={cn(
            "w-full justify-between px-3 text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <div className="flex items-center gap-2 truncate">
            <HugeiconsIcon
              icon={Calendar01Icon}
              size={16}
              className="shrink-0"
            />
            <span className="truncate">
              {value
                ? format(value, "dd MMMM yyyy HH:mm", { locale: id })
                : placeholder}
            </span>
          </div>

          <HugeiconsIcon
            icon={ChevronDown}
            size={16}
            className="shrink-0 text-muted-foreground"
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-auto overflow-hidden rounded-2xl border-border/60 p-0 shadow-xl max-sm:[zoom:0.85]"
      >
        <div className="flex flex-row">
          <div className="p-3">
            <Calendar
              mode="single"
              selected={value}
              onSelect={handleDateSelect}
              disabled={disabled}
              month={month}
              onMonthChange={setMonth}
              initialFocus
            />
          </div>
          <div className="flex h-[280px] min-w-[140px] border-l border-border/60">
            <TimeColumn
              label="JAM"
              items={hours}
              value={parsedTime.hour}
              onChange={(v) => handleTimeChange("hour", v)}
              isOpen={open}
            />
            <TimeColumn
              label="MIN"
              items={minutes}
              value={parsedTime.minute}
              onChange={(v) => handleTimeChange("minute", v)}
              isOpen={open}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-border/40 bg-muted/10 p-3">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 py-1 font-medium text-foreground/80 hover:bg-accent/50"
            onClick={() => {
              const now = new Date()
              now.setSeconds(0, 0)
              onChange?.(now)
              setMonth(now)
            }}
          >
            Sekarang
          </Button>

          <div className="h-4 w-px bg-border/60" />

          <Button
            variant="ghost"
            size="sm"
            className="flex-1 py-1 font-medium text-muted-foreground transition-colors hover:bg-destructive/5 hover:text-destructive"
            onClick={() => onChange?.(undefined)}
          >
            Bersihkan
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

interface TimeColumnProps {
  label: string
  items: string[]
  value: string
  onChange: (value: string) => void
  isOpen: boolean
}

function TimeColumn({
  label,
  items,
  value,
  onChange,
  isOpen,
}: TimeColumnProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const itemRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map())
  const [scrollTop, setScrollTop] = React.useState(0)
  const [containerHeight, setContainerHeight] = React.useState(0)

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }

  React.useLayoutEffect(() => {
    if (scrollRef.current) {
      setContainerHeight(scrollRef.current.clientHeight)
    }
  }, [])

  React.useEffect(() => {
    if (isOpen && value) {
      const activeItem = itemRefs.current.get(value)
      if (activeItem && scrollRef.current) {
        const timer = setTimeout(() => {
          activeItem.scrollIntoView({
            behavior: "smooth",
            block: "center",
          })
          if (scrollRef.current) setScrollTop(scrollRef.current.scrollTop)
        }, 100)
        return () => clearTimeout(timer)
      }
    }
  }, [value, isOpen])

  const ITEM_HEIGHT = 44
  const bufferHeight = containerHeight
    ? (containerHeight - ITEM_HEIGHT) / 2
    : 118 // Approx 280/2 - 22

  return (
    <div className="relative flex min-w-[70px] flex-1 flex-col border-r border-border/10 last:border-r-0">
      <div className="z-20 flex h-11 shrink-0 items-center justify-center border-b border-border/20 bg-muted/5 text-[10px] font-black tracking-[0.2em] text-muted-foreground/40 uppercase">
        {label}
      </div>
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="z-0 no-scrollbar h-full flex-1 snap-y snap-mandatory overflow-y-auto select-none"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          maskImage:
            "linear-gradient(to bottom, transparent, black 40%, black 60%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 40%, black 60%, transparent)",
        }}
      >
        <div
          className="flex flex-col items-center"
          style={{ paddingTop: bufferHeight, paddingBottom: bufferHeight }}
        >
          {items.map((val, index) => {
            const itemCenter =
              index * ITEM_HEIGHT + bufferHeight + ITEM_HEIGHT / 2
            const viewportCenter = scrollTop + containerHeight / 2 - 4
            const distanceFromCenter = Math.abs(itemCenter - viewportCenter)

            const scale = Math.max(0.7, 1.4 - distanceFromCenter / 150)
            const opacity = Math.max(0.1, 1 - distanceFromCenter / 120)
            const rotateX = (itemCenter - viewportCenter) / 4

            return (
              <button
                key={val}
                ref={(el) => {
                  if (el) itemRefs.current.set(val, el)
                  else itemRefs.current.delete(val)
                }}
                type="button"
                className={cn(
                  "flex h-[44px] w-full shrink-0 snap-center items-center justify-center font-mono text-3xl transition-colors will-change-transform outline-none",
                  value === val
                    ? "z-10 font-bold text-primary"
                    : "z-0 text-foreground"
                )}
                style={{
                  transform: `perspective(600px) scale(${scale * 0.85}) rotateX(${rotateX}deg) translateZ(0)`,
                  opacity: opacity,
                  backfaceVisibility: "hidden",
                  WebkitFontSmoothing: "antialiased",
                }}
                onClick={() => onChange(val)}
              >
                {val}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
