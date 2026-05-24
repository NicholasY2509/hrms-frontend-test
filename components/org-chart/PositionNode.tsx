import React, { useState } from "react"
import { Handle, Position } from "@xyflow/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { BriefcaseIcon, User, UserIcon } from "@hugeicons/core-free-icons"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { usePositionEmployees } from "@/modules/organization/chart/hooks/use-chart"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function PositionNode({ id, data }: { id: string; data: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const isHead =
    data.label?.includes("HEAD") ||
    data.label?.includes("MANAGER") ||
    data.label?.includes("COORDINATOR") ||
    data.label?.includes("SUPERVISOR")

  const { employees, isLoading } = usePositionEmployees(isOpen ? id : null)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <div className="group relative w-full max-w-[280px] min-w-[250px]">
        <PopoverTrigger asChild>
          {/* Card Content */}
          <div className="relative flex cursor-pointer items-center gap-4 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur-xl transition-all duration-300 group-hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/95">
            {/* Icon Container */}
            <div
              className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl shadow-inner ${isHead ? "bg-gradient-to-br from-primary/20 to-primary/10 text-primary dark:from-primary/40 dark:to-primary/20 dark:text-primary" : "bg-gradient-to-br from-slate-100 to-slate-50 text-slate-500 dark:from-slate-800 dark:to-slate-800/50 dark:text-slate-400"}`}
            >
              {isHead ? (
                <HugeiconsIcon
                  icon={BriefcaseIcon}
                  className="h-6 w-6"
                  strokeWidth={1.5}
                />
              ) : (
                <HugeiconsIcon
                  icon={UserIcon}
                  className="h-6 w-6"
                  strokeWidth={1.5}
                />
              )}
            </div>

            {/* Text Content */}
            <div className="flex min-w-0 flex-1 flex-col pr-2 text-left">
              <span className="line-clamp-2 text-sm leading-snug font-bold tracking-wide text-slate-800 dark:text-slate-100">
                {data.label}
              </span>
              {data.alias && (
                <div className="mt-1.5 flex">
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-primary dark:border-primary/20 dark:bg-primary/20 dark:text-primary">
                    <HugeiconsIcon icon={User} className="h-3 w-3" />
                    {data.alias}
                  </span>
                </div>
              )}
            </div>

            {/* Connection Handles */}
            <Handle
              type="target"
              position={Position.Top}
              className="!h-4 !w-4 !border-[3px] !border-white !bg-primary shadow-sm transition-colors hover:!bg-primary/90 dark:!border-slate-900"
            />
            <Handle
              type="source"
              position={Position.Bottom}
              className="!h-4 !w-4 !border-[3px] !border-white !bg-primary shadow-sm transition-colors hover:!bg-primary/90 dark:!border-slate-900"
            />
          </div>
        </PopoverTrigger>

        <PopoverContent
          side="right"
          sideOffset={16}
          className="w-72 overflow-hidden rounded-xl p-0 shadow-xl"
        >
          <div className="flex flex-col border-b border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
            <span className="text-sm leading-tight font-semibold text-slate-800 dark:text-slate-100">
              {data.label}
            </span>
            <span className="mt-1 text-xs text-muted-foreground">
              {isLoading ? "Memuat..." : `${employees.length} Pegawai`}
            </span>
          </div>
          <div className="scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 max-h-[250px] overflow-y-auto p-2">
            {isLoading ? (
              <div className="flex h-20 items-center justify-center">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              </div>
            ) : employees.length === 0 ? (
              <div className="flex h-20 items-center justify-center text-sm text-muted-foreground">
                Tidak ada pegawai aktif
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {employees.map((emp: any) => (
                  <div
                    key={emp.id}
                    className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/50"
                  >
                    <Avatar className="h-8 w-8 border border-slate-200 dark:border-slate-700">
                      <AvatarImage src={emp.profile_url} />
                      <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                        {emp.first_name?.[0] || (
                          <HugeiconsIcon icon={User} className="h-3 w-3" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col overflow-hidden">
                      <span className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                        {emp.full_name}
                      </span>
                      <span className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                        {emp.nik || "Tidak ada NIK"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </PopoverContent>
      </div>
    </Popover>
  )
}
