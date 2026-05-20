"use client"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination"
import { PaginationMeta } from "@/types"
import { ChevronLeft, ChevronRight } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

interface DataTablePaginationProps {
  meta: PaginationMeta | undefined
  onPageChange: (page: number) => void
}

export function DataTablePagination({
  meta,
  onPageChange,
}: DataTablePaginationProps) {
  if (!meta || meta.last_page <= 1) return null

  const { current_page, last_page, from, to, total } = meta

  const renderPageLinks = () => {
    const pages = []
    const range = 2
    for (let i = 1; i <= last_page; i++) {
      if (
        i === 1 ||
        i === last_page ||
        (i >= current_page - range && i <= current_page + range)
      ) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={(e) => {
                e.preventDefault()
                onPageChange(i)
              }}
              isActive={current_page === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      } else if (
        i === current_page - range - 1 ||
        i === current_page + range + 1
      ) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationEllipsis />
          </PaginationItem>
        )
      }
    }
    return pages
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-1 px-2">
      <div className="text-xs text-muted-foreground">
        Menampilkan <span className="font-medium text-foreground">{from}</span> - <span className="font-medium text-foreground">{to}</span> dari <span className="font-medium text-foreground">{total}</span> data
      </div>
      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationLink
              aria-label="Ke halaman sebelumnya"
              size="icon"
              onClick={(e) => {
                e.preventDefault()
                if (current_page > 1) onPageChange(current_page - 1)
              }}
              className={current_page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            >
              <HugeiconsIcon icon={ChevronLeft} className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>
          {renderPageLinks()}
          <PaginationItem>
            <PaginationLink
              aria-label="Ke halaman berikutnya"
              size="icon"
              onClick={(e) => {
                e.preventDefault()
                if (current_page < last_page) onPageChange(current_page + 1)
              }}
              className={current_page >= last_page ? "pointer-events-none opacity-50" : "cursor-pointer"}
            >
              <HugeiconsIcon icon={ChevronRight} className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
