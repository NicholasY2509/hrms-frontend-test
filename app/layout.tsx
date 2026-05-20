import { Metadata } from "next"
import { Geist, Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/modules/auth/hooks/auth-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/providers/query-provider";
import NextTopLoader from 'nextjs-toploader';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";


const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

import { NotificationProvider } from "@/components/providers/notification-provider";

export const metadata: Metadata = {
  title: {
    template: "%s | HRMS Deltamas",
    default: "HRMS Deltamas",
  },
  description: "Human Resource Management System for Deltamas",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
      <body>
        <AuthProvider>
          <QueryProvider>
            <TooltipProvider>
              <NextTopLoader color="#023e8a" />
              <ThemeProvider>
                <NotificationProvider>
                  {children}
                  <Toaster position="top-right" richColors />
                </NotificationProvider>
              </ThemeProvider>
            </TooltipProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
