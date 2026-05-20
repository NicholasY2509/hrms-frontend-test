import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "text-primary border-primary/20 before:bg-primary before:size-1.5 before:rounded-full before:shrink-0 dark:bg-primary/20 dark:text-primary-foreground/90 dark:border-primary/30",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        success:
          "bg-emerald-50/10 text-emerald-700 border-emerald-200 before:bg-emerald-500 before:size-1.5 before:rounded-full before:shrink-0 dark:bg-primary/5 dark:text-primary-foreground/60 dark:border-emerald-500/30",
        warning:
          "bg-amber-50/10 text-amber-700 border-amber-200 before:bg-amber-500 before:animate-pulse before:size-1.5 before:rounded-full before:shrink-0 dark:bg-primary/5 dark:text-primary-foreground/60 dark:border-amber-500/30",
        info:
          "bg-sky-50/10 text-sky-700 border-sky-200 before:bg-sky-500 before:size-1.5 before:rounded-full before:shrink-0 dark:bg-primary/5 dark:text-primary-foreground/60 dark:border-sky-500/30",
        destructive:
          "bg-rose-50/10 text-rose-700 border-rose-200 before:bg-rose-500 before:size-1.5 before:rounded-full before:shrink-0 dark:bg-primary/5 dark:text-primary-foreground/60 dark:border-rose-500/30",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-5 px-2 py-0.5 text-xs",
        sm: "h-4 px-1.5 py-0.5 text-[10px]",
        lg: "h-6 px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      data-size={size}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
