"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  ChevronDown,
  InformationCircleIcon,
  UserBlock01Icon,
  UserGroupIcon,
  Certificate01Icon,
  Calendar,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { useEmployeeDetail } from "@/modules/employee/employee/hooks/use-employee-detail"
import { ProfileHeader } from "@/modules/employee/employee/components/detail/profile-header"
import { DetailTabs } from "@/modules/employee/employee/components/detail/detail-tabs"
import { EmployeeDetailSkeleton } from "@/modules/employee/employee/components/detail/employee-detail-skeleton"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { WarningLetterSheet } from "@/modules/employee/warning-letter/components/warning-letter-sheet"
import { CareerTransitionSheet } from "@/modules/employee/career/components/career-transition-sheet"
import { ConfirmModal } from "@/components/ui/confirm-modal"
import { useCreateCertificateOfEmployment } from "@/modules/employee/certificate-of-employment/hooks/use-certificate"
import { AdjustAnnualLeaveModal } from "@/modules/employee/annual-leave/components/adjust-annual-leave-modal"
import { UnpaidLeaveManagementSheet } from "@/modules/unpaid-leave/components/unpaid-leave-management-sheet"

export function EmployeeDetailClient() {
  const params = useParams()
  const router = useRouter()
  const { employee, isLoading, isError } = useEmployeeDetail(
    params.id as string
  )

  const [isWarningLetterOpen, setIsWarningLetterOpen] = React.useState(false)
  const [isCareerTransitionOpen, setIsCareerTransitionOpen] =
    React.useState(false)
  const [isCoeConfirmOpen, setIsCoeConfirmOpen] = React.useState(false)
  const [isAdjustLeaveOpen, setIsAdjustLeaveOpen] = React.useState(false)
  const [isUnpaidLeaveOpen, setIsUnpaidLeaveOpen] = React.useState(false)

  const { createCertificate, isLoading: isCreatingCoe } =
    useCreateCertificateOfEmployment({
      onSuccess: () => setIsCoeConfirmOpen(false),
    })

  if (isLoading) {
    return <EmployeeDetailSkeleton />
  }

  if (isError || !employee) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <HugeiconsIcon
          icon={InformationCircleIcon}
          className="h-12 w-12 text-muted-foreground"
        />
        <h2 className="text-xl font-semibold">Karyawan tidak ditemukan</h2>
        <Button onClick={() => router.back()} variant="outline">
          Kembali ke Daftar
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Top Bar with Back and Actions */}
      <div className="mb-2 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className=""
          onClick={() => router.back()}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="h-4 w-4" />
          Daftar Pegawai
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="">
              Actions
              <HugeiconsIcon icon={ChevronDown} className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto justify-start" align="end">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => setIsWarningLetterOpen(true)}
            >
              <HugeiconsIcon icon={UserBlock01Icon} className="" />
              Form Surat Peringatan
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => setIsCareerTransitionOpen(true)}
            >
              <HugeiconsIcon icon={UserGroupIcon} className="" />
              Form Transisi Karir
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => setIsUnpaidLeaveOpen(true)}
            >
              <HugeiconsIcon icon={UserGroupIcon} className="" />
              Buatkan Pengajuan Cuti
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => setIsCoeConfirmOpen(true)}
            >
              <HugeiconsIcon icon={Certificate01Icon} className="" />
              Surat Keterangan Kerja
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => setIsAdjustLeaveOpen(true)}
            >
              <HugeiconsIcon icon={Calendar} className="" />
              Ubah Hak Cuti
            </Button>
          </PopoverContent>
        </Popover>
      </div>

      <ProfileHeader employee={employee} />

      <div className="mt-8">
        <DetailTabs employee={employee} />
      </div>

      {employee && (
        <>
          <WarningLetterSheet
            employeeId={employee.id}
            isOpen={isWarningLetterOpen}
            onClose={() => setIsWarningLetterOpen(false)}
          />
          <CareerTransitionSheet
            employee={employee}
            isOpen={isCareerTransitionOpen}
            onClose={() => setIsCareerTransitionOpen(false)}
          />
          <AdjustAnnualLeaveModal
            employee={employee}
            isOpen={isAdjustLeaveOpen}
            onClose={() => setIsAdjustLeaveOpen(false)}
          />
          <UnpaidLeaveManagementSheet
            employeeId={employee.id}
            isOpen={isUnpaidLeaveOpen}
            onClose={() => setIsUnpaidLeaveOpen(false)}
          />
        </>
      )}

      <ConfirmModal
        isOpen={isCoeConfirmOpen}
        onClose={() => setIsCoeConfirmOpen(false)}
        onConfirm={() => {
          createCertificate(employee.id)
        }}
        title="Ajukan Surat Keterangan Kerja?"
        description={`Apakah Anda yakin ingin membuat pengajuan Surat Keterangan Kerja (CoE) untuk ${employee.name}?`}
        confirmText="Ya, Ajukan"
        variant="default"
        isLoading={isCreatingCoe}
      />
    </div>
  )
}
