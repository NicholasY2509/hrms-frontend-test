"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
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
import { SparklesIcon, CheckmarkBadgeIcon, CreditCardIcon, NotificationIcon, LogoutIcon } from "@hugeicons/core-free-icons"
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
            <AvatarFallback>{user.full_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <HugeiconsIcon icon={SparklesIcon} strokeWidth={2} className="mr-2 size-4" />
            Upgrade to Pro
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <HugeiconsIcon icon={CheckmarkBadgeIcon} strokeWidth={2} className="mr-2 size-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HugeiconsIcon icon={CreditCardIcon} strokeWidth={2} className="mr-2 size-4" />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HugeiconsIcon icon={NotificationIcon} strokeWidth={2} className="mr-2 size-4" />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout()} className="text-destructive cursor-pointer hover:bg-destructive/10 hover:text-destructive">
          <HugeiconsIcon icon={LogoutIcon} strokeWidth={2} className="mr-2 size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
