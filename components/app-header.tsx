"use client"

import * as React from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { DynamicBreadcrumbs } from "@/components/dynamic-breadcrumb"
import { GlobalSearch } from "@/components/global-search"
import { NotificationsMenu } from "@/components/notifications-menu"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { InformationCircleIcon } from "@hugeicons/core-free-icons"
import { HeaderUserMenu } from "@/components/header-user-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useFullscreen } from "@/hooks/use-fullscreen"
import { useHasMounted } from "@/hooks/use-has-mounted"
import { MaximizeIcon, Minimize01Icon } from "@hugeicons/core-free-icons"

export function AppHeader() {
  const { isFullscreen, toggleFullscreen } = useFullscreen()
  const hasMounted = useHasMounted()

  if (!hasMounted) {
    return (
      <header className="flex h-16 shrink-0 items-center px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 gap-3">
        <div className="flex items-center gap-2 overflow-hidden min-w-0 text-nowrap">
          <div className="h-8 w-8 animate-pulse bg-muted/20 rounded-md" />
          <Separator orientation="vertical" className="mr-2 h-4 hidden xs:block" />
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 animate-pulse bg-muted/20 rounded-full" />
          <div className="h-8 w-8 animate-pulse bg-muted/20 rounded-full" />
        </div>
      </header>
    )
  }

  return (
    <header className="flex h-16 shrink-0 items-center px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 gap-3">
      <div className="flex items-center gap-2 overflow-hidden min-w-0 text-nowrap">
        <SidebarTrigger className="-ml-1 shrink-0" />
        <Separator
          orientation="vertical"
          className="mr-2 data-vertical:h-4 data-vertical:self-auto hidden xs:block"
        />
        <div className="hidden md:block overflow-hidden">
          <DynamicBreadcrumbs />
        </div>
      </div>

      <div className="flex-1 flex items-center sm:justify-end min-w-0">
        <div className="w-full sm:w-auto">
          <GlobalSearch />
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 shrink-0">

        <div className="flex items-center gap-1 px-1 border-l border-r">
          <NotificationsMenu />


          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={toggleFullscreen}
              >
                <HugeiconsIcon
                  icon={isFullscreen ? Minimize01Icon : MaximizeIcon}
                  className="h-5 w-5"
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isFullscreen ? 'Keluar Fullscreen' : 'Layar Penuh'}</TooltipContent>
          </Tooltip>



          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <HugeiconsIcon icon={InformationCircleIcon} className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Pusat Bantuan</TooltipContent>
          </Tooltip>


          <ModeToggle />
        </div>

        <HeaderUserMenu />
      </div>
    </header>
  )
}
