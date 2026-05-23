"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { sidebarData } from "@/data/sidebar-data"
import { HugeiconsIcon } from "@hugeicons/react"
import { SearchIcon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { useEffect, useMemo } from "react"
import { usePermission } from "@/hooks/use-permission"

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const { hasRole, hasPermission } = usePermission()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === "KeyK" && (e.metaKey || e.ctrlKey)) {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return
        }

        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const searchItems = useMemo(() => {
    const allItems: {
      title: string
      url: string
      icon?: any
      workspaceName?: string
      group?: string
    }[] = []

    const checkAccess = (item: any) => {
      if (item.roles && !item.roles.some((r: string) => hasRole(r)))
        return false
      if (
        item.permissions &&
        !item.permissions.some((p: string) => hasPermission(p))
      )
        return false
      return true
    }

    Object.entries(sidebarData.navByRole).forEach(([role, groups]) => {
      // Check if the user has access to this workspace/role context
      const workspace = sidebarData.roles.find((r) => r.id === role)
      const hasWorkspaceAccess = workspace?.allowedRoles
        ? workspace.allowedRoles.some((r) => hasRole(r))
        : hasRole(role)

      if (!hasWorkspaceAccess) return

      groups.forEach((group: any) => {
        // Skip group if it has roles and user doesn't match
        if (group.roles && !group.roles.some((r: string) => hasRole(r))) return

        group.items.forEach((item: any) => {
          if (!checkAccess(item)) return

          if (item.url && item.url !== "#") {
            allItems.push({
              title: item.title,
              url: item.url,
              icon: item.icon,
              workspaceName: workspace?.name,
              group: group.label || "Umum",
            })
          }
          if (item.items) {
            item.items.forEach((subItem: any) => {
              if (!checkAccess(subItem)) return

              allItems.push({
                title: subItem.title,
                url: subItem.url,
                icon: item.icon,
                workspaceName: workspace?.name,
                group: `${item.title}`,
              })
            })
          }
        })
      })
    })

    // Deduplicate by URL
    return Array.from(
      new Map(allItems.map((item) => [item.url, item])).values()
    )
  }, [hasPermission, hasRole])

  const groupedItems = useMemo(() => {
    const groups: Record<string, typeof searchItems> = {}
    searchItems.forEach((item) => {
      const wName = item.workspaceName || "Lainnya"
      if (!groups[wName]) groups[wName] = []
      groups[wName].push(item)
    })
    return groups
  }, [searchItems])

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start rounded-xl bg-muted/20 px-3 text-xs font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <HugeiconsIcon icon={SearchIcon} className="mr-2 h-3.5 w-3.5" />
        <span className="hidden lg:inline-flex">Cari halaman...</span>
        <span className="inline-flex lg:hidden">Cari...</span>
        <kbd className="pointer-events-none absolute top-[0.3rem] right-[0.3rem] hidden h-6 items-center gap-1 px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        dialogContentClassName="top-[15%] translate-y-0 sm:max-w-3xl overflow-hidden rounded-2xl! p-0 shadow-2xl border-primary/10 bg-background/70 backdrop-blur-xl"
        className="**:data-[slot=input-group-addon]_[svg]:size-5 **:data-[slot=input-group-addon]_[svg]:opacity-40 **:data-[slot=command-group]_[cmdk-group-heading]]:px-3 **:data-[slot=command-group]_[cmdk-group-heading]]:py-2 **:data-[slot=command-group]_[cmdk-group-heading]]:text-[10px] **:data-[slot=command-group]_[cmdk-group-heading]]:font-bold **:data-[slot=command-group]_[cmdk-group-heading]]:text-muted-foreground/60 **:data-[slot=command-group]_[cmdk-group-heading]]:uppercase **:data-[slot=command-group]_[cmdk-group-heading]]:tracking-widest **:data-[slot=command-input]:h-full! **:data-[slot=command-input]:text-lg **:data-[slot=command-input]:font-medium **:data-[slot=command-input-wrapper]:border-b **:data-[slot=command-input-wrapper]:p-0! **:data-[slot=command-item]:rounded-xl **:data-[slot=command-item]:px-4 **:data-[slot=command-item]:py-4 **:data-[slot=command-item]:text-sm **:data-[slot=command-list]:max-h-[500px] **:data-[slot=input-group]:h-16! **:data-[slot=input-group]:border-none! **:data-[slot=input-group]:bg-transparent! **:data-[slot=input-group]:px-6 **:data-[slot=input-group]:shadow-none! **:data-[slot=input-group-addon]:order-first! **:data-[slot=input-group-addon]:mr-4 **:data-[slot=input-group-addon]:p-0!"
      >
        <CommandInput placeholder="Ketik untuk mencari halaman..." />
        <CommandList>
          <CommandEmpty>Tidak ada hasil ditemukan.</CommandEmpty>
          {Object.entries(groupedItems).map(([workspace, items]) => (
            <CommandGroup key={workspace} heading={`Portal ${workspace}`}>
              {items.map((item) => (
                <CommandItem
                  key={item.url}
                  value={`${workspace} ${item.group} ${item.title}`}
                  onSelect={() => {
                    router.push(item.url)
                    setOpen(false)
                  }}
                  className="flex w-full items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <div className="flex flex-col">
                      <span>{item.title}</span>
                      {item.group && (
                        <span className="text-[10px] text-muted-foreground">
                          {item.group}
                        </span>
                      )}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  )
}
