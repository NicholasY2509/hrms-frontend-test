'use client';

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tick01Icon, ArrowUpDownIcon, IdCardLanyardIcon, Loading03Icon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useEmployeeStatuses } from '../hooks/use-employees';

interface EmployeeStatusPickerProps {
  value: string | number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function EmployeeStatusPicker({
  value,
  onChange,
  placeholder = 'Pilih status...',
  disabled,
  className
}: EmployeeStatusPickerProps) {
  const [open, setOpen] = useState(false);
  const { items, isLoading } = useEmployeeStatuses();

  const selectedItem = React.useMemo(() => {
    return items.find((item: any) => item.id.toString() === value?.toString());
  }, [items, value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between bg-background font-normal h-7 px-2 text-xs", className)}
          disabled={disabled}
        >
          <div className="flex items-center gap-2 truncate">
            <HugeiconsIcon icon={IdCardLanyardIcon} size={14} className="text-muted-foreground shrink-0" />
            {selectedItem ? (
              <span className="truncate">{selectedItem.name}</span>
            ) : (
              <span className="text-muted-foreground truncate">{placeholder}</span>
            )}
          </div>
          <HugeiconsIcon icon={ArrowUpDownIcon} className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Cari status..."
          />
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
                        'ml-2 h-4 w-4',
                        !value || value === 'all' ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                  {items.map((item: any) => (
                    <CommandItem
                      key={item.id}
                      value={item.name}
                      onSelect={() => {
                        onChange(item.id);
                        setOpen(false);
                      }}
                      className="flex items-center justify-between py-2"
                    >
                      <span className="truncate">{item.name}</span>
                      <HugeiconsIcon
                        icon={Tick01Icon}
                        className={cn(
                          'ml-2 h-4 w-4',
                          Number(value) === item.id ? 'opacity-100' : 'opacity-0'
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
