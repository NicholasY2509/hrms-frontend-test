'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { FingerPrintIcon, Shield01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';

export function LoginClient() {
    const { login, isLoading } = useAuth();

    return (
        <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-sm space-y-8"
            >
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
                        <HugeiconsIcon icon={FingerPrintIcon} className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-semibold tracking-tight">Selamat Datang Kembali</h1>
                        <p className="text-sm text-muted-foreground">Masuk ke akun HR Anda</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <Button
                        onClick={login}
                        disabled={isLoading}
                        className="w-full h-12 text-base font-medium transition-all"
                    >
                        <span className="flex items-center justify-center gap-2">
                            Masuk dengan Passport
                            <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
                        </span>
                    </Button>
                </div>

                <div className="pt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground border-t">
                    <HugeiconsIcon icon={Shield01Icon} className="w-3.5 h-3.5" />
                    <span>Single sign-on aman</span>
                </div>

                <p className="text-center text-[10px] uppercase tracking-widest text-muted-foreground/50">
                    © 2026 Deltamas Solutions
                </p>
            </motion.div>
        </div>
    );
}
