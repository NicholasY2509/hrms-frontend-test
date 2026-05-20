"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Camera01Icon, Delete02Icon, UserIcon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AvatarPickerProps {
  value?: File | null
  onChange?: (file: File | null) => void
  className?: string
}

export function AvatarPicker({ value, onChange, className }: AvatarPickerProps) {
  const [preview, setPreview] = React.useState<string | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value)
      setPreview(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setPreview(null)
    }
  }, [value])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    onChange?.(file)
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange?.(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className={cn("relative group w-fit", className)}>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <div 
        onClick={() => inputRef.current?.click()}
        className="relative cursor-pointer"
      >
        <Avatar className="w-32 h-32 border-4 border-background shadow-xl group-hover:ring-2 ring-primary transition-all">
          <AvatarImage src={preview || undefined} className="object-cover" />
          <AvatarFallback className="bg-muted">
            <HugeiconsIcon icon={UserIcon} size={48} className="text-muted-foreground" />
          </AvatarFallback>
        </Avatar>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-full">
          <div className="bg-background/90 p-2 rounded-full text-foreground shadow-sm">
            <HugeiconsIcon icon={Camera01Icon} size={20} />
          </div>
        </div>
      </div>

      {value && (
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute -top-1 -right-1 w-8 h-8 rounded-full shadow-lg border-2 border-background"
          onClick={handleRemove}
        >
          <HugeiconsIcon icon={Delete02Icon} size={14} />
        </Button>
      )}
    </div>
  )
}
