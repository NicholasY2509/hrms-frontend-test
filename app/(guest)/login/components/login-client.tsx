"use client"

import React from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/modules/auth/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  FingerPrintIcon,
  Shield01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"

export function LoginClient() {
  const { login, isLoading } = useAuth()

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm space-y-8"
      >
        <div className="space-y-6 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <HugeiconsIcon icon={FingerPrintIcon} className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Selamat Datang Kembali
            </h1>
            <p className="text-sm text-muted-foreground">
              Masuk ke akun HR Anda
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            onClick={login}
            disabled={isLoading}
            className="h-12 w-full text-base font-medium transition-all"
          >
            <span className="flex items-center justify-center gap-2">
              Masuk dengan Passport
              <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4" />
            </span>
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 border-t pt-6 text-xs text-muted-foreground">
          <HugeiconsIcon icon={Shield01Icon} className="h-3.5 w-3.5" />
          <span>Single sign-on aman</span>
        </div>

        <p className="text-center text-[10px] tracking-widest text-muted-foreground/50 uppercase">
          © 2026 Deltamas Solutions
        </p>
      </motion.div>
    </div>
  )
}
