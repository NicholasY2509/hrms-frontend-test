'use client';

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon, Tick01Icon, Loading03Icon } from '@hugeicons/core-free-icons';
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
import { useDebounce } from '@/hooks/use-debounce';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEmployees } from '../hooks/use-employees';
import { useEmployeeDetail } from '../hooks/use-employee-detail';

interface EmployeePickerProps {
  value: string | number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
}

export function EmployeePicker({ value, onChange, placeholder = 'Pilih karyawan...' }: EmployeePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const debouncedSearch = useDebounce(search, 500);

  const { employees: paginatedEmployees, isLoading: isLoadingList } = useEmployees({ search: debouncedSearch, per_page: 20 });
  const { employee: selectedItem, isLoading: isLoadingDetail } = useEmployeeDetail(value as number);

  const employees = React.useMemo(() => {
    if (!selectedItem) return paginatedEmployees;

    const exists = paginatedEmployees.some((e) => e.id === selectedItem.id);
    return exists ? paginatedEmployees : [selectedItem, ...paginatedEmployees];
  }, [paginatedEmployees, selectedItem]);

  const selectedEmployee = selectedItem;
  const isLoading = isLoadingList || isLoadingDetail;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-background h-7 px-2 text-xs"
          disabled={isLoadingDetail}
        >
          {isLoadingDetail ? (
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={Loading03Icon} className="h-3 w-3 animate-spin" />
              <span className="text-muted-foreground">Memuat...</span>
            </div>
          ) : selectedEmployee ? (
            <div className="flex items-center gap-2 truncate">
              <span className="truncate">{selectedEmployee.name}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <HugeiconsIcon icon={Search01Icon} className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Cari nama atau NIK..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {isLoading ? (
              <div className="p-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <HugeiconsIcon icon={Loading03Icon} className="h-4 w-4 animate-spin" />
                <span>Mencari...</span>
              </div>
            ) : (
              <>
                <CommandEmpty>Karyawan tidak ditemukan.</CommandEmpty>
                <CommandGroup>
                  {employees.map((employee) => (
                    <CommandItem
                      key={employee.id}
                      value={employee.id.toString()}
                      onSelect={() => {
                        onChange(Number(employee.id));
                        setOpen(false);
                      }}
                      className="flex items-center gap-3 py-2"
                    >
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium truncate">{employee.name}</span>
                        <span className="text-xs text-muted-foreground truncate">{employee.nik} • {employee.position?.name}</span>
                      </div>
                      <HugeiconsIcon icon={Tick01Icon}
                        className={cn(
                          'ml-auto h-4 w-4',
                          Number(value) === Number(employee.id) ? 'opacity-100' : 'opacity-0'
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
