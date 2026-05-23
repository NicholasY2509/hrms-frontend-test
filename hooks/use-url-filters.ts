import React, { useMemo, useState, useEffect, useCallback, useRef } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

export function useUrlFilters<T extends Record<string, any>>(
  defaultFilters: T
) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [optimisticParams, setOptimisticParams] =
    useState<URLSearchParams | null>(null)

  const currentParamsRef = useRef<URLSearchParams>(
    new URLSearchParams(searchParams.toString())
  )

  useEffect(() => {
    currentParamsRef.current = new URLSearchParams(searchParams.toString())
    setOptimisticParams(null)
  }, [searchParams])

  const activeParams = optimisticParams || searchParams

  const filters = useMemo(() => {
    const currentFilters: Partial<T> = {}

    for (const key in defaultFilters) {
      const defaultValue = defaultFilters[key]
      const paramValue = activeParams.get(key)

      if (paramValue !== null) {
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
  }, [activeParams, defaultFilters])

  const setFilter = useCallback(
    (key: keyof T, value: any) => {
      const params = new URLSearchParams(currentParamsRef.current.toString())

      if (value === null || value === undefined || value === "") {
        params.delete(key as string)
      } else {
        params.set(key as string, String(value))
      }

      if (key !== "page" && params.has("page")) {
        params.set("page", "1")
      }

      currentParamsRef.current = params
      setOptimisticParams(params)

      const newUrl = `${pathname}?${params.toString()}`
      // Instantly update the URL bar
      window.history.replaceState(null, "", newUrl)
      // Trigger Next.js background fetch
      router.replace(newUrl, { scroll: false })
    },
    [pathname, router]
  )

  const setFilters = useCallback(
    (updates: Partial<T>) => {
      const params = new URLSearchParams(currentParamsRef.current.toString())

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

      currentParamsRef.current = params
      setOptimisticParams(params)

      const newUrl = `${pathname}?${params.toString()}`
      window.history.replaceState(null, "", newUrl)
      router.replace(newUrl, { scroll: false })
    },
    [pathname, router]
  )

  const resetFilters = useCallback(() => {
    const params = new URLSearchParams(currentParamsRef.current.toString())
    for (const key in defaultFilters) {
      params.delete(key)
    }

    currentParamsRef.current = params
    setOptimisticParams(params)

    const newUrl = `${pathname}?${params.toString()}`
    window.history.replaceState(null, "", newUrl)
    router.replace(newUrl, { scroll: false })
  }, [pathname, router, defaultFilters])

  const hasActiveFilters = useMemo(() => {
    for (const key in defaultFilters) {
      if (key === "page" || key === "per_page") continue

      const paramValue = activeParams.get(key)
      if (paramValue !== null && paramValue !== String(defaultFilters[key])) {
        return true
      }
    }
    return false
  }, [activeParams, defaultFilters])

  return { filters, setFilter, setFilters, resetFilters, hasActiveFilters }
}
