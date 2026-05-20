"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick01Icon, ArrowUpDownIcon, Clock01Icon, Loading03Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useAttendanceStatuses } from "../hooks/use-attendance-statuses";

interface AttendanceStatusPickerProps {
  value: string | number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function AttendanceStatusPicker({
  value,
  onChange,
  placeholder = "Pilih status...",
  disabled,
  className,
}: AttendanceStatusPickerProps) {
  const [open, setOpen] = useState(false);
  const { items: statuses, isLoading } = useAttendanceStatuses();

  const selectedStatus = React.useMemo(() => {
    return statuses.find((s) => s.id.toString() === value?.toString());
  }, [statuses, value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between bg-background font-normal", className)}
          disabled={disabled || isLoading}
        >
          <div className="flex items-center gap-2 truncate">
            {isLoading ? (
              <HugeiconsIcon icon={Loading03Icon} className="h-3 w-3 animate-spin" />
            ) : (
              <HugeiconsIcon icon={Clock01Icon} size={16} className="text-muted-foreground shrink-0" />
            )}
            {selectedStatus ? (
              <span className="truncate">{selectedStatus.name || "-"}</span>
            ) : (
              <span className="text-muted-foreground truncate">{placeholder}</span>
            )}
          </div>
          <HugeiconsIcon icon={ArrowUpDownIcon} className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
        <Command>
          <CommandInput placeholder="Cari status..." />
          <CommandList>
            {isLoading ? (
              <div className="p-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <HugeiconsIcon icon={Loading03Icon} className="h-4 w-4 animate-spin" />
                <span>Memuat...</span>
              </div>
            ) : (
              <>
                <CommandEmpty>Status tidak ditemukan.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    value="all"
                    onSelect={() => {
                      onChange(null);
                      setOpen(false);
                    }}
                    className="flex items-center justify-between py-2"
                  >
                    <span>Semua Status</span>
                    <HugeiconsIcon
                      icon={Tick01Icon}
                      className={cn(
                        "ml-2 h-4 w-4",
                        !value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                  {statuses.map((status) => (
                    <CommandItem
                      key={status.id}
                      value={status.name || ""}
                      onSelect={() => {
                        onChange(status.id);
                        setOpen(false);
                      }}
                      className="flex items-center justify-between py-2"
                    >
                      <span className="truncate">{status.name || "-"}</span>
                      <HugeiconsIcon
                        icon={Tick01Icon}
                        className={cn(
                          "ml-2 h-4 w-4",
                          Number(value) === status.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
