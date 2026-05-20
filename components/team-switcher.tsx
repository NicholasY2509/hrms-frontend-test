"use client"

import * as React from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import { UnfoldMoreIcon, PlusSignIcon } from "@hugeicons/core-free-icons"
import { Skeleton } from "@/components/ui/skeleton"

export function TeamSwitcher({
  roles,
  onRoleChange,
  activeRoleId,
}: {
  roles: {
    name: string
    logo: React.ReactNode
    description: string
    id: string
  }[]
  onRoleChange: (roleId: string) => void
  activeRoleId: string
}) {
  const { isMobile } = useSidebar()
  const activeRole = roles.find(r => r.id === activeRoleId) || roles[0]

  if (!activeRole) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <Skeleton className="flex aspect-square size-8 rounded-lg" />
            <div className="grid flex-1 gap-1 text-left text-sm leading-tight">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-32" />
            </div>
            <HugeiconsIcon icon={UnfoldMoreIcon} strokeWidth={2} className="ml-auto text-muted-foreground/50" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-sidebar-primary-foreground">
                {activeRole.logo}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate text-[10px] text-muted-foreground/50">
                  Deltamas HRMS
                </span>
                <span className="truncate font-semibold text-primary">
                  {activeRole.name}
                </span>
              </div>
              <HugeiconsIcon icon={UnfoldMoreIcon} strokeWidth={2} className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Ganti Peran (Workspace)
            </DropdownMenuLabel>
            {roles.map((role, index) => (
              <DropdownMenuItem
                key={role.id}
                onClick={() => {
                  onRoleChange(role.id)
                }}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  {role.logo}
                </div>
                {role.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
