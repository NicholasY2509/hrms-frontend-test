"use client"

import * as React from "react"
import Link from "next/link"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"

export function NavMain({
  items,
  label,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
    isActive?: boolean
    badge?: string | number
    items?: {
      title: string
      url: string
      isActive?: boolean
    }[]
  }[]
  label?: string
}) {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <SidebarGroup>
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) => {
          const hasChildren = item.items && item.items.length > 0

          const menuItem = (
            <SidebarMenuItem>
              {hasChildren ? (
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title} isActive={item.isActive}>
                    <div className="relative">
                      {item.icon}
                      {isCollapsed && item.badge && (
                        <div className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500 border border-sidebar shadow-sm" />
                      )}
                    </div>
                    <span>{item.title}</span>
                    {item.badge && (
                      <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">
                        {item.badge}
                      </span>
                    )}
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      strokeWidth={2}
                      className={item.badge ? "ml-1 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" : "ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"}
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              ) : (
                <SidebarMenuButton asChild tooltip={item.title} isActive={item.isActive}>
                  <Link href={item.url}>
                    <div className="relative">
                      {item.icon}
                      {isCollapsed && item.badge && (
                        <div className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500 border border-sidebar shadow-sm" />
                      )}
                    </div>
                    <span className="">{item.title}</span>
                    {item.badge && (
                      <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              )}
              {hasChildren && (
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild isActive={subItem.isActive}>
                          <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              )}
            </SidebarMenuItem>
          )

          if (!hasChildren) {
            return <React.Fragment key={item.title}>{menuItem}</React.Fragment>
          }

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              {menuItem}
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
