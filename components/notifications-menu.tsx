"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Notification01Icon,
} from "@hugeicons/core-free-icons"
import { useNotifications, useUnreadNotificationCount, useMarkAllNotificationsAsRead, useMarkNotificationAsRead } from "@/modules/system/hooks/use-notification"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { getNotificationIcon, getNotificationTitle } from "@/modules/system/lib/notification-utils"

export function NotificationsMenu() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(false)
  const { items, isLoading } = useNotifications({ per_page: 20 })
  const { unreadCount } = useUnreadNotificationCount()
  const { markAllAsRead } = useMarkAllNotificationsAsRead()
  const { markAsRead } = useMarkNotificationAsRead()

  const handleNotificationClick = async (id: string, actionUrl?: string) => {
    setOpen(false)
    await markAsRead(id)
    if (actionUrl) {
      router.push(actionUrl)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 relative group">
          <HugeiconsIcon
            icon={Notification01Icon}
            className="h-5 w-5 transition-colors group-hover:text-primary"
          />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 h-2 w-2 bg-rose-500 rounded-full border-2 border-background" />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        side={isMobile ? "top" : "right"}
        backdrop="blur"
        className={cn(
          "flex flex-col p-0 gap-0 transition-all duration-300",
          isMobile
            ? "h-screen w-screen border-none"
            : "h-[calc(100vh-4rem)]! w-[400px]! top-8! right-8! bottom-8! rounded-[1rem] border shadow-2xl overflow-hidden"
        )}
      >
        <SheetHeader className="p-6 pb-4 flex flex-row items-center justify-between space-y-0">
          <SheetTitle className="text-xl font-bold">Notifikasi</SheetTitle>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs font-normal text-muted-foreground hover:text-primary h-auto p-0"
              onClick={() => markAllAsRead()}
            >
              Tandai sudah dibaca
            </Button>
          )}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-2">
          {isLoading ? (
            <div className="p-4 space-y-4">
              <Skeleton className="h-20 w-full rounded-2xl" />
              <Skeleton className="h-20 w-full rounded-2xl" />
              <Skeleton className="h-20 w-full rounded-2xl" />
              <Skeleton className="h-20 w-full rounded-2xl" />
            </div>
          ) : items.length > 0 ? (
            <div className="grid gap-1">
              {items.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  icon={<HugeiconsIcon icon={getNotificationIcon(notification.type, notification.data.icon)} className="h-5 w-5" />}
                  title={getNotificationTitle(notification.type, notification.data.title)}
                  description={notification.data.message}
                  time={notification.created_at_human}
                  isUnread={!notification.read_at}
                  onClick={() => handleNotificationClick(notification.id, notification.data.action_url)}
                />
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-3 opacity-50">
              <HugeiconsIcon icon={Notification01Icon} className="h-12 w-12 text-muted-foreground" />
              <p className="text-sm font-medium">Tidak ada notifikasi saat ini</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t mt-auto bg-background/80 backdrop-blur-md sticky bottom-0">
          <SheetClose asChild>
            <Button
              className="w-full rounded-xl h-11 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
              variant="outline"
              onClick={() => router.push("/notifications")}
            >
              Lihat Semua Notifikasi
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function NotificationItem({
  icon,
  title,
  description,
  time,
  isUnread = false,
  onClick,
}: {
  icon: React.ReactNode
  title: string
  description: string
  time: string
  isUnread?: boolean
  onClick: () => void
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-4 p-4 rounded-2xl cursor-pointer transition-colors hover:bg-muted/50 relative group",
        isUnread && "bg-blue-50/50 dark:bg-blue-900/10"
      )}
      onClick={onClick}
    >
      <div className="mt-1 p-2.5 bg-background border rounded-xl shrink-0 shadow-sm transition-colors group-hover:border-primary/30">
        <div className="transition-colors group-hover:text-primary">
          {icon}
        </div>
      </div>
      <div className="flex-1 space-y-1 min-w-0">
        <div className="flex justify-between items-center gap-2">
          <p className={cn("text-sm truncate", isUnread ? "font-bold" : "font-medium")}>{title}</p>
          {isUnread && <span className="h-2 w-2 bg-primary rounded-full shrink-0 animate-pulse" />}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{description}</p>
        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{time}</p>
      </div>
    </div>
  )
}
