"use client"

import * as React from "react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
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

export interface DatePickerProps {
    value?: Date
    onChange?: (date: Date | undefined) => void
    placeholder?: string
    className?: string
    disabled?: boolean
}

export function DatePicker({
    value,
    onChange,
    placeholder = "Pilih tanggal",
    className,
    disabled
}: DatePickerProps) {
    const [month, setMonth] = React.useState<Date | undefined>(value || new Date())

    // Sinkronkan bulan tampilan saat value berubah dari luar
    React.useEffect(() => {
        if (value) setMonth(value)
    }, [value])

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
                            {value
                                ? format(value, "dd MMMM yyyy", { locale: id })
                                : placeholder}
                        </span>
                    </div>

                    <HugeiconsIcon
                        icon={ChevronDown}
                        size={16}
                        className="text-muted-foreground shrink-0"
                    />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                align="start"
                className="
                    w-auto
                    min-w-[280px]
                    rounded-2xl
                    border-border/60
                    p-3
                    shadow-xl
                "
            >
                <Calendar
                    mode="single"
                    selected={value}
                    onSelect={onChange}
                    disabled={disabled}
                    month={month}
                    onMonthChange={setMonth}
                    initialFocus
                />
                <div className="flex items-center gap-2 border-t border-border/40 pt-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 py-1 font-medium hover:bg-accent/50 text-foreground/80"
                        onClick={() => {
                            const today = new Date()
                            today.setHours(0, 0, 0, 0)
                            onChange?.(today)
                            setMonth(today)
                        }}
                    >
                        Hari ini
                    </Button>

                    <div className="w-px h-4 bg-border/60" />

                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 py-1 font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
                        onClick={() => onChange?.(undefined)}
                    >
                        Bersihkan
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}
