import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const FieldGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("grid gap-6", className)}
    {...props}
  />
))
FieldGroup.displayName = "FieldGroup"

const Field = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("grid gap-2", className)}
    {...props}
  />
))
Field.displayName = "Field"

interface FieldLabelProps extends React.ComponentPropsWithoutRef<typeof Label> {
  required?: boolean
}

const FieldLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  FieldLabelProps
>(({ className, required, children, ...props }, ref) => (
  <Label
    ref={ref}
    className={cn(className)}
    {...props}
  >
    {children}
    {required && <span className="text-destructive ml-1">*</span>}
  </Label>
))
FieldLabel.displayName = "FieldLabel"

interface FieldErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  errors?: (any | undefined)[]
}

const FieldError = React.forwardRef<
  HTMLParagraphElement,
  FieldErrorProps
>(({ className, errors, ...props }, ref) => {
  const error = errors?.find((e) => !!e)
  
  if (!error) return null

  const message = typeof error === "string" ? error : error.message

  return (
    <p
      ref={ref}
      className={cn("text-xs font-medium text-destructive", className)}
      {...props}
    >
      {message}
    </p>
  )
})
FieldError.displayName = "FieldError"

export { FieldGroup, Field, FieldLabel, FieldError }
