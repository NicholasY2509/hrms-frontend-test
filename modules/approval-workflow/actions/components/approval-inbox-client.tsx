"use client"

import * as React from "react"
import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/layout/page-header"

import {
  useApprovals,
  useApproveRequest,
  useRejectRequest,
  ApprovalCategory,
} from "@/modules/approval-workflow/actions/hooks/use-approvals"
import { ApprovalRequest } from "@/modules/approval-workflow/actions/types"
import { ApprovalActionModal } from "@/modules/approval-workflow/actions/components/approval-action-modal"

import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { ApprovalInboxFilters } from "./approval-inbox-filters"
import { ApprovalCard } from "./approval-card"
import { ApprovalCardSkeleton } from "./approval-card-skeleton"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"

export function ApprovalInboxClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const activeTab = (searchParams.get("tab") as ApprovalCategory) || "pending"

  const [page, setPage] = useState(1)

  const setActiveTab = (tab: ApprovalCategory) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", tab)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    setPage(1)
  }

  const [search, setSearch] = useState("")
  const [type, setType] = useState<string>("all")

  // Modal state
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)
  const [modalType, setModalType] = useState<"approve" | "reject" | null>(null)

  const { approvals, isLoading, summary_counts, mutate, meta } = useApprovals(
    activeTab,
    {
      page,
      type: type === "all" ? undefined : type,
      search: search || undefined,
    }
  )
  const { approve, isLoading: isApproving } = useApproveRequest()
  const { reject, isLoading: isRejecting } = useRejectRequest()
  const isActioning = isApproving || isRejecting

  const handleAction = async (notes: string, attachment?: File) => {
    if (!selectedTaskId || !modalType) return

    try {
      if (modalType === "approve") {
        await approve({ id: selectedTaskId, notes, attachment })
      } else {
        await reject({ id: selectedTaskId, notes })
      }
      setSelectedTaskId(null)
      setModalType(null)
      mutate()
    } catch (error) {}
  }

  const handleOpenApprove = (id: number) => {
    setSelectedTaskId(id)
    setModalType("approve")
  }

  const handleOpenReject = (id: number) => {
    setSelectedTaskId(id)
    setModalType("reject")
  }

  return (
    <div className="w-full space-y-6 pb-10">
      <PageHeader
        title="Manajemen Persetujuan"
        description="Pantau dan proses semua pengajuan persetujuan yang melibatkan Anda."
      />

      <ApprovalInboxFilters
        search={search}
        setSearch={(val) => {
          setSearch(val)
          setPage(1)
        }}
        type={type}
        setType={(val) => {
          setType(val)
          setPage(1)
        }}
      />

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as ApprovalCategory)}
        className="w-full space-y-4"
      >
        <TabsList className="w-full gap-6">
          {[
            { id: "pending", label: "Inbox", count: summary_counts?.pending },
            {
              id: "upcoming",
              label: "Mendatang",
              count: summary_counts?.upcoming,
            },
            {
              id: "ongoing",
              label: "Berjalan",
              count: summary_counts?.ongoing,
            },
          ].map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="relative px-0 py-3 text-xs transition-all data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="ml-2 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold data-[state=active]:bg-white">
                  {tab.count}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="pt-2 outline-none space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <ApprovalCardSkeleton key={i} />
              ))}
            </div>
          ) : approvals.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-muted/20 bg-muted/5 py-24">
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                className="mb-3 h-10 w-10 text-muted-foreground/20"
              />
              <h3 className="text-sm font-medium text-muted-foreground">
                Tidak ada data untuk kategori ini.
              </h3>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {approvals.map((task: ApprovalRequest) => (
                  <ApprovalCard
                    key={task.id}
                    task={task}
                    activeTab={activeTab}
                    isActioning={isActioning}
                    onApprove={handleOpenApprove}
                    onReject={handleOpenReject}
                  />
                ))}
              </div>
              <DataTablePagination meta={meta} onPageChange={setPage} />
            </div>
          )}
        </div>
      </Tabs>

      <ApprovalActionModal
        isOpen={!!modalType}
        onClose={() => {
          setModalType(null)
          setSelectedTaskId(null)
        }}
        onConfirm={handleAction}
        type={modalType || "approve"}
        isLoading={isActioning}
      />
    </div>
  )
}
