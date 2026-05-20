'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { HugeiconsIcon } from '@hugeicons/react'
import { CursorMagicSelection02Icon, ArrowLeft01Icon, Wrench, Wrench02Icon, Wrench01Icon } from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-4 text-center">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 -z-10 h-full w-full opacity-30">
        <div className="absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1]
        }}
        className="mb-10"
      >
        <motion.div
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative flex items-center justify-center"
        >
          {/* Animated Glow */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute h-48 w-48 rounded-full bg-primary/20 blur-2xl"
          />

          <div className="relative flex h-48 w-48 items-center justify-center rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 shadow-2xl backdrop-blur-md">
            <HugeiconsIcon
              icon={Wrench01Icon}
              size={96}
              className="text-primary"
              strokeWidth={1.5}
            />
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="z-10"
      >
        <div className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
          Fitur Dalam Pengembangan
        </div>
        <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl">
          404 Not Found
        </h1>
        <p className="mx-auto mb-10 max-w-lg text-xl leading-relaxed text-muted-foreground/80">
          Halaman yang Anda cari sedang dalam tahap pengembangan. Kami sedang bekerja keras untuk segera menyelesaikannya untuk Anda.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="z-10"
      >
        <Button size="lg" className="h-14 px-8 text-base font-semibold shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 cursor-pointer">
          <div onClick={() => window.history.back()} className="flex items-center gap-3">
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2.5} />
            Kembali
          </div>
        </Button>
      </motion.div>

      {/* Progress Indicator */}
      <div className="mt-16 flex flex-col items-center gap-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/50">
          Work in Progress
        </span>
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
              className="h-2.5 w-2.5 rounded-full bg-primary/60"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
