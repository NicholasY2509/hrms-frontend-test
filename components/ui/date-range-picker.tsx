"use client"

import * as React from "react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { DateRange } from "react-day-picker"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { HugeiconsIcon } from "@hugeicons/react"
import { Calendar01Icon, ChevronDown } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

export interface DateRangePickerProps {
    value?: DateRange
    onChange?: (range: DateRange | undefined) => void
    placeholder?: string
    className?: string
    disabled?: boolean
    numberOfMonths?: number
}

export function DateRangePicker({
    value,
    onChange,
    placeholder = "Pilih rentang tanggal",
    className,
    disabled,
    numberOfMonths = 2
}: DateRangePickerProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                        "w-full justify-between text-left font-normal px-3",
                        !value && "text-muted-foreground",
                        className
                    )}
                >
                    <div className="flex items-center gap-2 truncate">
                        <HugeiconsIcon icon={Calendar01Icon} size={16} className="shrink-0" />
                        <span className="truncate">
                            {value?.from ? (
                                value.to ? (
                                    <>
                                        {format(value.from, "dd MMM yyyy", { locale: id })} -{" "}
                                        {format(value.to, "dd MMM yyyy", { locale: id })}
                                    </>
                                ) : (
                                    format(value.from, "dd MMM yyyy", { locale: id })
                                )
                            ) : (
                                placeholder
                            )}
                        </span>
                    </div>
                    <HugeiconsIcon icon={ChevronDown} size={16} className="text-muted-foreground shrink-0" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={value?.from}
                    selected={value}
                    onSelect={onChange}
                    numberOfMonths={numberOfMonths}
                    disabled={disabled}
                />
            </PopoverContent>
        </Popover>
    )
}
