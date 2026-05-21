"use client"

import * as React from "react"
import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { TeamSwitcher } from "./team-switcher"
import {
  useSidebarRoles,
  useSidebarNavigation,
} from "@/hooks/use-sidebar-navigation"
import { useHasMounted } from "@/hooks/use-has-mounted"

export function AppSidebar({
  initialRoleId = "employee",
  ...props
}: React.ComponentProps<typeof Sidebar> & { initialRoleId?: string }) {
  const hasMounted = useHasMounted()
  const pathname = usePathname()
  const { isMobile, setOpenMobile } = useSidebar()
  const { activeRoleId, filteredRoles, handleRoleChange } =
    useSidebarRoles(initialRoleId)
  const { navMainWithActive } = useSidebarNavigation(activeRoleId)

  React.useEffect(() => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }, [pathname, isMobile, setOpenMobile])

  if (!hasMounted) {
    return (
      <Sidebar variant="inset" collapsible="icon" {...props}>
        <SidebarHeader>
          <div className="h-12 w-full animate-pulse rounded-lg bg-muted/20" />
        </SidebarHeader>
        <SidebarContent className="p-2">
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-8 w-full animate-pulse rounded-md bg-muted/10"
              />
            ))}
          </div>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    )
  }

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher
          roles={filteredRoles}
          activeRoleId={activeRoleId}
          onRoleChange={handleRoleChange}
        />
      </SidebarHeader>
      <SidebarContent className="pb-10">
        {navMainWithActive.map((group: any, index: number) => (
          <React.Fragment key={group.label || index}>
            <NavMain items={group.items} label={group.label} />
            {index < navMainWithActive.length - 1 && <SidebarSeparator />}
          </React.Fragment>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
