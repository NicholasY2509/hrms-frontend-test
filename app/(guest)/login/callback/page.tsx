"use client"

import { useEffect, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/modules/auth/hooks/use-auth"
import { authService } from "@/modules/auth/services/auth-service"
import { HugeiconsIcon } from "@hugeicons/react"
import { Loading03Icon } from "@hugeicons/core-free-icons"
import axios from "axios"

function CallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setAuthData } = useAuth()
  const exchangeStarted = useRef(false)

  useEffect(() => {
    const params: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      params[key] = value
    })
    console.log("[Auth Callback] URL Parameters:", params)

    const code = searchParams.get("code")

    if (code && !exchangeStarted.current) {
      exchangeStarted.current = true
      handleCallback(code)
    } else if (!code && !searchParams.get("error")) {
      router.push("/login")
    }
  }, [searchParams, router])

  const handleCallback = async (code: string) => {
    try {
      console.log("[Auth Callback] Starting token exchange with code:", code)

      // 1. Exchange code for token
      const tokenData = await authService.exchangeCodeForToken(code)
      console.log("[Auth Callback] Token Response:", tokenData)

      // 2. Get user profile
      console.log("[Auth Callback] Fetching user profile...")
      const userData = await authService.getUserProfile(tokenData.access_token)
      console.log("[Auth Callback] User Profile Response:", userData)

      // 3. Save to context and cookies
      setAuthData(tokenData, userData)

      console.log(
        "[Auth Callback] Authentication successful, redirecting to dashboard..."
      )
      router.push("/employee/dashboard")
    } catch (error) {
      console.error("[Auth Callback] Authentication failed:", error)
      // Log more error details if available
      if (axios.isAxiosError(error)) {
        console.error("[Auth Callback] API Error Data:", error.response?.data)
      }
      router.push("/login?error=auth_failed")
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <HugeiconsIcon
        icon={Loading03Icon}
        className="mb-4 h-12 w-12 animate-spin text-primary"
      />
      <h1 className="text-xl font-medium">Mengautentikasi...</h1>
      <p className="mt-2 text-muted-foreground">
        Mohon tunggu selagi kami menyelesaikan proses masuk Anda.
      </p>
    </div>
  )
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center">
          <HugeiconsIcon
            icon={Loading03Icon}
            className="mb-4 h-12 w-12 animate-spin text-primary"
          />
          <h1 className="text-xl font-medium">Mengautentikasi...</h1>
          <p className="mt-2 text-muted-foreground">
            Mohon tunggu selagi kami menyelesaikan proses masuk Anda.
          </p>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  )
}
