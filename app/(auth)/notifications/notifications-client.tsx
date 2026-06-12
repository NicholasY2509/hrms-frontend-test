"use client"

import { useState } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { useNotifications, useMarkAllNotificationsAsRead, useMarkNotificationAsRead } from "@/modules/system/hooks/use-notification"
import { HugeiconsIcon } from "@hugeicons/react"
import { Notification01Icon, CheckListIcon } from "@hugeicons/core-free-icons"
import { getNotificationIcon, getNotificationTitle } from "@/modules/system/lib/notification-utils"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function NotificationsClient() {
  const router = useRouter()
  const [tab, setTab] = useState<"all" | "unread">("all")
  const { items, isLoading, refetch } = useNotifications({
    unread_only: tab === "unread",
    per_page: 50
  })
  const { markAllAsRead, isLoading: isMarkingAllLoading } = useMarkAllNotificationsAsRead()
  const { markAsRead } = useMarkNotificationAsRead()

  const handleNotificationClick = async (id: string, actionUrl?: string) => {
    await markAsRead(id)
    if (actionUrl) {
      router.push(actionUrl)
    } else {
      refetch()
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pusat Notifikasi"
        description="Pantau semua aktivitas dan pemberitahuan sistem Anda di sini."
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => markAllAsRead()}
          disabled={isMarkingAllLoading || items.every(n => n.read_at)}
        >
          <HugeiconsIcon icon={CheckListIcon} className="mr-2 h-4 w-4" />
          Tandai Semua Dibaca
        </Button>
      </PageHeader>

      <Tabs value={tab} onValueChange={(v) => setTab(v as "all" | "unread")} className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="all">Semua</TabsTrigger>
          <TabsTrigger value="unread">Belum Dibaca</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i} className="border-none shadow-none bg-muted/20">
                  <CardContent className="p-4 flex gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : items.length > 0 ? (
            <div className="space-y-3">
              {items.map((notification) => (
                <Card
                  key={notification.id}
                  className={cn(
                    "cursor-pointer transition-all hover:bg-muted/50 border-none shadow-none",
                    !notification.read_at ? "bg-primary/5 ring-1 ring-primary/10" : "bg-muted/20"
                  )}
                  onClick={() => handleNotificationClick(notification.id, notification.data.action_url)}
                >
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className={cn(
                      "p-2.5 rounded-xl shrink-0",
                      !notification.read_at ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground"
                    )}>
                      <HugeiconsIcon icon={getNotificationIcon(notification.type, notification.data.icon)} className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-2">
                          <h3 className={cn("text-sm", !notification.read_at ? "font-bold" : "font-semibold")}>
                            {getNotificationTitle(notification.type, notification.data.title)}
                          </h3>
                          {!notification.read_at && (
                            <Badge variant="default" className="h-1.5 w-1.5 p-0 rounded-full bg-primary" />
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                          {notification.created_at_human}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {notification.data.message}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="p-6 bg-muted rounded-full">
                <HugeiconsIcon icon={Notification01Icon} className="h-12 w-12 text-muted-foreground/50" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">Tidak Ada Notifikasi</h3>
                <p className="text-sm text-muted-foreground">
                  {tab === "unread" ? "Bagus! Semua notifikasi sudah Anda baca." : "Belum ada notifikasi untuk Anda saat ini."}
                </p>
              </div>
            </div>
          )}
        </div>
      </Tabs>
    </div>
  )
}
