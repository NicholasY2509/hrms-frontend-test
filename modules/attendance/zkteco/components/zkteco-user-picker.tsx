"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Search01Icon,
  Tick01Icon,
  Loading03Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"
import { useZktecoUsers } from "../hooks/use-zkteco"

interface ZktecoUserPickerProps {
  value: string | number | null
  onChange: (value: string | number | null) => void
  machineId?: number
  placeholder?: string
}

export function ZktecoUserPicker({
  value,
  onChange,
  machineId,
  placeholder = "Pilih user mesin...",
}: ZktecoUserPickerProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const debouncedSearch = useDebounce(search, 500)

  const { items: users, isLoading } = useZktecoUsers({
    search: debouncedSearch,
    zkteco_machine_id: machineId,
    per_page: 20,
  })

  const selectedUser = React.useMemo(() => {
    return users.find((u) => String(u.uid) === String(value))
  }, [users, value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-7 w-full justify-between bg-background px-2 text-xs"
          disabled={isLoading && !selectedUser && !value}
        >
          {isLoading && !selectedUser && !value ? (
            <div className="flex items-center gap-2">
              <HugeiconsIcon
                icon={Loading03Icon}
                className="h-3 w-3 animate-spin"
              />
              <span className="text-muted-foreground">Memuat...</span>
            </div>
          ) : selectedUser ? (
            <div className="flex items-center gap-2 truncate">
              <span className="truncate">
                {selectedUser.name || `UID: ${selectedUser.uid}`}
              </span>
            </div>
          ) : value ? (
            <div className="flex items-center gap-2 truncate">
              <span className="truncate">UID: {value}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <HugeiconsIcon
            icon={Search01Icon}
            className="ml-2 h-4 w-4 shrink-0 opacity-50"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) p-0"
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Cari nama atau UID..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 p-4 text-sm text-muted-foreground">
                <HugeiconsIcon
                  icon={Loading03Icon}
                  className="h-4 w-4 animate-spin"
                />
                <span>Mencari...</span>
              </div>
            ) : (
              <>
                <CommandEmpty>User tidak ditemukan.</CommandEmpty>
                <CommandGroup>
                  {users.map((user) => (
                    <CommandItem
                      key={`${user.zkteco_machine_id}-${user.uid}`}
                      value={String(user.uid)}
                      onSelect={() => {
                        onChange(user.uid)
                        setOpen(false)
                      }}
                      className="flex items-center gap-3 py-2"
                    >
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate font-medium">
                          {user.name || `UID: ${user.uid}`}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          UID: {user.uid}{" "}
                          {user.machine?.name ? `• ${user.machine.name}` : ""}
                        </span>
                      </div>
                      <HugeiconsIcon
                        icon={Tick01Icon}
                        className={cn(
                          "ml-auto h-4 w-4",
                          String(value) === String(user.uid)
                            ? "opacity-100"
                            : "opacity-0"
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
  )
}
