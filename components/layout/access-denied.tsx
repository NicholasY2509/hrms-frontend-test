'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowLeft01Icon,
  Home01Icon,
  ShieldBanIcon,
  Login01Icon,
} from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AccessDeniedProps {
  status: 401 | 403;
  title?: string;
  description?: string;
  className?: string;
}

export function AccessDenied({
  status,
  title,
  description,
  className,
}: AccessDeniedProps) {
  const isForbidden = status === 403;

  const defaultTitle = isForbidden ? 'Akses Ditolak' : 'Sesi Berakhir';
  const defaultDescription = isForbidden
    ? 'Maaf, Anda tidak memiliki izin untuk mengakses halaman ini. Silakan hubungi administrator jika Anda merasa ini adalah kesalahan.'
    : 'Sesi Anda telah berakhir atau Anda tidak terautentikasi. Silakan login kembali untuk melanjutkan.';

  const icon = isForbidden ? ShieldBanIcon : Login01Icon;
  const colorClass = isForbidden ? 'text-destructive' : 'text-primary';
  const bgClass = isForbidden ? 'bg-destructive/10' : 'bg-primary/10';
  const borderClass = isForbidden ? 'border-destructive/20' : 'border-primary/20';
  const glowClass = isForbidden ? 'bg-destructive/20' : 'bg-primary/20';
  const pillClass = isForbidden ? 'bg-destructive/5 text-destructive border-destructive/20' : 'bg-primary/5 text-primary border-primary/20';

  return (
    <div
      className={cn(
        'relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-4 text-center',
        className
      )}
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 -z-10 h-full w-full opacity-30">
        <div className={cn("absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full blur-[120px]", glowClass)} />
        <div className={cn("absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full blur-[120px]", glowClass)} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
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
            ease: 'easeInOut',
          }}
          className="relative flex items-center justify-center"
        >
          {/* Animated Glow */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className={cn("absolute h-48 w-48 rounded-full blur-2xl", glowClass)}
          />

          <div className={cn("relative flex h-48 w-48 items-center justify-center rounded-[2.5rem] border shadow-2xl backdrop-blur-md transition-all duration-500", bgClass, borderClass)}>
            <HugeiconsIcon
              icon={icon}
              size={96}
              className={colorClass}
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
        <div className={cn("mb-4 inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium", pillClass)}>
          {isForbidden ? 'Restriction' : 'Authentication'} Error {status}
        </div>
        <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl">
          {title || defaultTitle}
        </h1>
        <p className="mx-auto mb-10 max-w-lg text-xl leading-relaxed text-muted-foreground/80">
          {description || defaultDescription}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="z-10 flex flex-wrap items-center justify-center gap-4"
      >
        <Button
          variant="outline"
          size="lg"
          className="h-14 px-8 text-base font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer border-primary/20 hover:bg-primary/5"
          asChild
        >
          <Link href="/">
            <div className="flex items-center gap-3">
              <HugeiconsIcon icon={Home01Icon} strokeWidth={2} />
              Beranda
            </div>
          </Link>
        </Button>
        <Button
          size="lg"
          className={cn(
            "h-14 px-8 text-base font-semibold shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer",
            isForbidden ? "shadow-destructive/20 bg-destructive hover:bg-destructive/90" : "shadow-primary/20"
          )}
          onClick={() => window.history.back()}
        >
          <div className="flex items-center gap-3">
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2.5} />
            Kembali
          </div>
        </Button>
      </motion.div>

      {/* Security Indicator */}
      <div className="mt-16 flex flex-col items-center gap-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/50">
          {isForbidden ? 'Security Protocol Active' : 'Session Validation Required'}
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
              className={cn("h-2.5 w-2.5 rounded-full", isForbidden ? "bg-destructive/60" : "bg-primary/60")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
