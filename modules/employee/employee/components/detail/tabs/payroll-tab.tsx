"use client"

import * as React from "react"
import { TaxProfileCard } from "@/modules/payroll/tax-ptkp-settings/components/tax-profile-card"
import { BaseSalaryCard } from "@/modules/payroll/employee-salaries/components/base-salary-card"
import { SalaryComponentsCard } from "@/modules/payroll/employee-salary-components/components/salary-components-card"

import { DetailTabContainer } from "./detail-tab-container"
import { Dollar01Icon } from "@hugeicons/core-free-icons"
import { Separator } from "@/components/ui/separator"

interface PayrollTabProps {
  employeeId: number
}

export function PayrollTab({ employeeId }: PayrollTabProps) {
  return (
    <DetailTabContainer title="Manajemen Payroll & Gaji" icon={Dollar01Icon}>
      <div className="space-y-12">
        <TaxProfileCard employeeId={employeeId} />
        <Separator className="opacity-50" />
        <BaseSalaryCard employeeId={employeeId} />
        <Separator className="opacity-50" />
        <SalaryComponentsCard employeeId={employeeId} />
      </div>
    </DetailTabContainer>
  )
}
