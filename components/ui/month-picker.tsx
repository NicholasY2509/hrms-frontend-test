"use client";

import * as React from "react";
import { format, setMonth, setYear, getMonth, getYear, startOfMonth } from "date-fns";
import { id } from "date-fns/locale";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar01Icon, ChevronDown, ArrowLeftIcon, ArrowRightIcon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MonthPickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

export function MonthPicker({
  value,
  onChange,
  placeholder = "Pilih bulan",
  className,
  disabled,
}: MonthPickerProps) {
  const [viewDate, setViewDate] = React.useState(value || new Date());

  React.useEffect(() => {
    if (value) {
      setViewDate(value);
    }
  }, [value]);

  const currentYear = getYear(viewDate);
  const currentMonth = value ? getMonth(value) : -1;
  const isSelectedYear = value ? getYear(value) === currentYear : false;

  const handleYearChange = (offset: number) => {
    setViewDate(setYear(viewDate, currentYear + offset));
  };

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = startOfMonth(setMonth(setYear(new Date(), currentYear), monthIndex));
    onChange?.(newDate);
  };

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
              {value ? format(value, "MMMM yyyy", { locale: id }) : placeholder}
            </span>
          </div>
          <HugeiconsIcon
            icon={ChevronDown}
            size={16}
            className="text-muted-foreground shrink-0"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3 rounded-2xl shadow-xl border-border/60" align="start">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg"
            onClick={() => handleYearChange(-1)}
          >
            <HugeiconsIcon icon={ArrowLeftIcon} size={16} />
          </Button>
          <span className="text-sm font-semibold">{currentYear}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg"
            onClick={() => handleYearChange(1)}
          >
            <HugeiconsIcon icon={ArrowRightIcon} size={16} />
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {MONTHS.map((month, index) => {
            const isSelected = isSelectedYear && currentMonth === index;
            const isCurrentMonth = getYear(new Date()) === currentYear && getMonth(new Date()) === index;

            return (
              <Button
                key={month}
                variant="ghost"
                size="sm"
                className={cn(
                  "h-9 text-xs font-medium rounded-lg transition-colors",
                  isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                  !isSelected && isCurrentMonth && "text-primary bg-primary/10",
                  !isSelected && !isCurrentMonth && "hover:bg-accent"
                )}
                onClick={() => handleMonthSelect(index)}
              >
                {month.substring(0, 3)}
              </Button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 border-t border-border/40 mt-4 pt-3">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 py-1 font-medium hover:bg-accent/50 text-foreground/80"
            onClick={() => {
              const now = startOfMonth(new Date());
              onChange?.(now);
              setViewDate(now);
            }}
          >
            Bulan Ini
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
  );
}
