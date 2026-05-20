"use client"

import * as React from "react"
import { useEffect } from "react"
import { useAuth } from "@/modules/auth/hooks/auth-context"
import { initEcho } from "@/lib/echo"
import Cookies from "js-cookie"
import { useQueryClient } from "@tanstack/react-query"
import { SYSTEM_ENDPOINTS } from "@/modules/system/endpoints"
import { toast } from "sonner"

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!user) return
    const token = Cookies.get("access_token")
    if (!token) return

    const echo = initEcho(token)
    if (!echo) return

    const channel = `App.Modules.User.Models.User.${user.id}`

    echo.private(channel).notification((notification: any) => {
      // Invalidate queries to refresh the list and count
      queryClient.invalidateQueries({
        queryKey: [SYSTEM_ENDPOINTS.PORTAL.EMPLOYEE.NOTIFICATIONS.LIST],
      })
      queryClient.invalidateQueries({
        queryKey: [SYSTEM_ENDPOINTS.PORTAL.EMPLOYEE.NOTIFICATIONS.UNREAD_COUNT],
      })

      // Show a toast
      toast(notification.title || "Notifikasi Baru", {
        description: notification.message,
        action: notification.action_url ? {
          label: "Lihat",
          onClick: () => window.location.href = notification.action_url
        } : undefined
      })
    })

    return () => {
      echo.leaveChannel(channel)
    }
  }, [user, queryClient])

  return <>{children}</>
}
