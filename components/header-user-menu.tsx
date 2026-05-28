"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/modules/auth/hooks/auth-context"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  SparklesIcon,
  CheckmarkBadgeIcon,
  CreditCardIcon,
  NotificationIcon,
  LogoutIcon,
} from "@hugeicons/core-free-icons"
import { Button } from "./ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export function HeaderUserMenu() {
  const { user, logout } = useAuth()

  if (!user) return <Skeleton className="h-9 w-9 rounded-full" />

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.avatar} alt={user.full_name} />
            <AvatarFallback>
              {user.full_name?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem
          onClick={() => logout()}
          className="cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <HugeiconsIcon
            icon={LogoutIcon}
            strokeWidth={2}
            className="mr-2 size-4"
          />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
