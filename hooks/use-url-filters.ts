import React, { useMemo } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

export function useUrlFilters<T extends Record<string, any>>(
  defaultFilters: T
) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Read current filters from URL, falling back to defaults
  const filters = useMemo(() => {
    const currentFilters: Partial<T> = {}

    for (const key in defaultFilters) {
      const defaultValue = defaultFilters[key]
      const paramValue = searchParams.get(key)

      if (paramValue !== null) {
        // Basic type inference based on the default value
        if (typeof defaultValue === "number") {
          currentFilters[key] = Number(paramValue) as any
        } else if (typeof defaultValue === "boolean") {
          currentFilters[key] = (paramValue === "true") as any
        } else {
          currentFilters[key] = paramValue as any
        }
      } else {
        currentFilters[key] = defaultValue
      }
    }

    return currentFilters as T
  }, [searchParams, defaultFilters])

  const currentParamsRef = React.useRef<URLSearchParams>(
    new URLSearchParams(searchParams.toString())
  )

  // Keep ref in sync with actual URL when it changes
  React.useEffect(() => {
    currentParamsRef.current = new URLSearchParams(searchParams.toString())
  }, [searchParams])

  const setFilter = React.useCallback(
    (key: keyof T, value: any) => {
      const params = currentParamsRef.current

      if (value === null || value === undefined || value === "") {
        params.delete(key as string)
      } else {
        params.set(key as string, String(value))
      }

      // Always reset page to 1 if a filter other than page changes
      if (key !== "page" && params.has("page")) {
        params.set("page", "1")
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [pathname, router]
  )

  const setFilters = React.useCallback(
    (updates: Partial<T>) => {
      const params = currentParamsRef.current

      let isPageUpdated = false

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          params.delete(key)
        } else {
          params.set(key, String(value))
        }
        if (key === "page") {
          isPageUpdated = true
        }
      })

      if (!isPageUpdated && params.has("page")) {
        params.set("page", "1")
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [pathname, router]
  )

  const resetFilters = React.useCallback(() => {
    const params = currentParamsRef.current
    for (const key in defaultFilters) {
      params.delete(key)
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [pathname, router, defaultFilters])

  const hasActiveFilters = useMemo(() => {
    for (const key in defaultFilters) {
      // Ignore pagination parameters when checking for active filters
      if (key === "page" || key === "per_page") continue

      const paramValue = searchParams.get(key)
      if (paramValue !== null && paramValue !== String(defaultFilters[key])) {
        return true
      }
    }
    return false
  }, [searchParams, defaultFilters])

  return { filters, setFilter, setFilters, resetFilters, hasActiveFilters }
}
