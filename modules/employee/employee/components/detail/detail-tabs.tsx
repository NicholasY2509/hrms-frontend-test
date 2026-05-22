"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Briefcase01Icon,
  UserGroupIcon,
  IdCardLanyardIcon,
  InformationCircleIcon,
  Task01Icon,
  LicenseIcon,
  DiplomaIcon,
  ContactIcon,
  Car01Icon,
  AttachmentIcon,
  UserCheck01Icon,
  Boxes,
  Shield,
  BankIcon,
  Shield01Icon,
  ArrowUp01Icon,
  FingerPrintIcon,
} from "@hugeicons/core-free-icons"
import { Card, CardTitle } from "@/components/ui/card"
import { Employee } from "../../types"
import { cn } from "@/lib/utils"
import { EducationTab } from "./tabs/education-tab"
import { FamilyTab } from "./tabs/family-tab"
import { WarningTab } from "./tabs/warning-tab"
import { ExperienceTab } from "./tabs/experience-tab"
import { LicenseTab } from "./tabs/license-tab"
import { VehicleTab } from "./tabs/vehicle-tab"
import { AttachmentTab } from "./tabs/attachment-tab"
import { InsuranceTab } from "./tabs/insurance-tab"
import { BankTab } from "./tabs/bank-tab"
import { OverviewTab } from "./tabs/overview-tab"
import { PersonalTab } from "./tabs/personal-tab"
import { EmergencyContactTab } from "./tabs/emergency-contact-tab"
import { PayrollTab } from "./tabs/payroll-tab"
import { AttendanceUserTab } from "./tabs/attendance-user-tab"

interface DetailTabsProps {
  employee: Employee
  className?: string
}

const TAB_GROUPS = [
  {
    title: "Profil Utama",
    tabs: [
      { id: "overview", label: "Overview", icon: InformationCircleIcon },
      { id: "personal", label: "Personal Data", icon: IdCardLanyardIcon },
      { id: "family", label: "Anggota Keluarga", icon: UserGroupIcon },
      { id: "emergency", label: "Kontak Darurat", icon: ContactIcon },
    ],
  },
  {
    title: "Karir & Kompetensi",
    tabs: [
      { id: "education", label: "Riwayat Pendidikan", icon: LicenseIcon },
      { id: "experience", label: "Pengalaman Kerja", icon: Briefcase01Icon },
      { id: "training", label: "Pelatihan", icon: DiplomaIcon },
      { id: "performance", label: "Performa", icon: Task01Icon },
      { id: "contract", label: "Histori Kontrak", icon: Briefcase01Icon },
    ],
  },
  {
    title: "Keuangan & Jaminan",
    tabs: [
      { id: "payroll", label: "Payroll & Pajak", icon: BankIcon },
      { id: "insurance", label: "Jaminan Sosial", icon: Shield },
      { id: "social_security", label: "Asuransi Tambahan", icon: Shield01Icon },
      { id: "bank", label: "Rekening Bank", icon: BankIcon },
    ],
  },

  {
    title: "Aset & Dokumen",
    tabs: [
      { id: "inventory", label: "Inventaris", icon: Boxes },
      { id: "license", label: "SIM", icon: IdCardLanyardIcon },
      { id: "vehicle", label: "Kendaraan Pribadi", icon: Car01Icon },
      { id: "attachment", label: "Lampiran", icon: AttachmentIcon },
    ],
  },
  {
    title: "Lainnya",
    tabs: [
      { id: "warning", label: "Surat Peringatan", icon: InformationCircleIcon },
      { id: "approvals", label: "Approval Izin", icon: UserCheck01Icon },
      { id: "attendance-user", label: "User Presensi", icon: FingerPrintIcon },
    ],
  },
]

const ALL_TABS = TAB_GROUPS.flatMap((group) => group.tabs)

function ScrollSection({
  id,
  children,
  onVisible,
  className,
}: {
  id: string
  children: React.ReactNode
  onVisible: (id: string) => void
  className?: string
}) {
  const sectionRef = React.useRef<HTMLDivElement>(null)
  const [hasBeenVisible, setHasBeenVisible] = React.useState(false)

  React.useEffect(() => {
    // Observer for Lazy Loading (Prefetch data 1000px before it enters viewport)
    const lazyObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasBeenVisible(true)
          lazyObserver.disconnect()
        }
      },
      { rootMargin: "0px 0px 1000px 0px" }
    )

    // Observer for Scroll Spy (Accuracy for sidebar active state)
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onVisible(id)
          }
        })
      },
      {
        threshold: [0, 0.1, 0.2, 0.5],
        rootMargin: "-20% 0px -70% 0px",
      }
    )

    if (sectionRef.current) {
      lazyObserver.observe(sectionRef.current)
      spyObserver.observe(sectionRef.current)
    }

    return () => {
      lazyObserver.disconnect()
      spyObserver.disconnect()
    }
  }, [id, onVisible])

  return (
    <div
      id={id}
      ref={sectionRef}
      className={cn("min-h-[100px] scroll-mt-24", className)}
    >
      {hasBeenVisible ? (
        children
      ) : (
        <Card className="flex h-[400px] animate-pulse items-center justify-center bg-muted/5 p-8">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-muted" />
            <div className="h-4 w-32 rounded bg-muted" />
          </div>
        </Card>
      )}
    </div>
  )
}

export function DetailTabs({ employee, className }: DetailTabsProps) {
  const [activeTab, setActiveTab] = React.useState("overview")
  const [isManualScrolling, setIsManualScrolling] = React.useState(false)

  const activeGroupTitle = React.useMemo(() => {
    return TAB_GROUPS.find((group) =>
      group.tabs.some((tab) => tab.id === activeTab)
    )?.title
  }, [activeTab])

  const handleScrollTo = (id: string) => {
    setIsManualScrolling(true)
    setActiveTab(id)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    setTimeout(() => setIsManualScrolling(false), 1000)
  }

  const [showScrollTop, setShowScrollTop] = React.useState(false)

  React.useEffect(() => {
    const toggleVisible = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }
    window.addEventListener("scroll", toggleVisible)
    return () => window.removeEventListener("scroll", toggleVisible)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const onSectionVisible = (id: string) => {
    if (!isManualScrolling) {
      setActiveTab(id)
    }
  }

  const renderTabContent = (id: string) => {
    switch (id) {
      case "overview":
        return <OverviewTab employee={employee} />
      case "personal":
        return <PersonalTab employee={employee} />
      case "education":
        return <EducationTab employeeId={employee.id} />
      case "family":
        return <FamilyTab employeeId={employee.id} />
      case "emergency":
        return <EmergencyContactTab employeeId={employee.id} />
      case "experience":
        return <ExperienceTab employeeId={employee.id} />
      case "warning":
        return <WarningTab employeeId={employee.id} />
      case "license":
        return <LicenseTab employeeId={employee.id} />
      case "vehicle":
        return <VehicleTab employeeId={employee.id} />
      case "attachment":
        return <AttachmentTab employeeId={employee.id} />
      case "insurance":
        return <InsuranceTab employeeId={employee.id} />
      case "bank":
        return <BankTab employeeId={employee.id} />
      case "payroll":
        return <PayrollTab employeeId={employee.id} />
      case "attendance-user":
        return <AttendanceUserTab employeeId={employee.id} />

      default:
        const tab = ALL_TABS.find((t) => t.id === id)
        return (
          <Card className="flex min-h-[400px] flex-col items-center justify-center border-dashed bg-muted/5 p-8 text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/5 text-primary ring-1 ring-primary/10">
              <HugeiconsIcon
                icon={tab?.icon || InformationCircleIcon}
                className="h-8 w-8"
              />
            </div>
            <CardTitle className="mb-2 text-xl">{tab?.label}</CardTitle>
            <p className="max-w-[280px] text-sm text-muted-foreground">
              Data {tab?.label} sedang dalam pengembangan dan akan segera
              tersedia.
            </p>
          </Card>
        )
    }
  }

  return (
    <div className={cn("relative flex flex-col gap-4 lg:flex-row", className)}>
      <aside className="w-full shrink-0 lg:w-1/5">
        <div className="sticky top-8 space-y-4">
          {TAB_GROUPS.map((group) => {
            const isGroupActive = activeGroupTitle === group.title

            return (
              <div key={group.title} className="space-y-2">
                {/* Category Header */}
                <button
                  onClick={() => handleScrollTo(group.tabs[0].id)}
                  className="group flex w-full items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted/30"
                >
                  <div
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-md transition-all duration-300",
                      isGroupActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 text-muted-foreground"
                    )}
                  >
                    <div
                      className={cn(
                        "h-1.5 w-1.5 rounded-full transition-all",
                        isGroupActive
                          ? "scale-125 bg-white"
                          : "bg-muted-foreground/40"
                      )}
                    />
                  </div>
                  <h4
                    className={cn(
                      "text-[10px] font-bold tracking-widest uppercase transition-colors",
                      isGroupActive
                        ? "text-foreground"
                        : "text-muted-foreground/70"
                    )}
                  >
                    {group.title}
                  </h4>
                </button>

                {/* Collapsible Content with Tree Line */}
                <div
                  className={cn(
                    "grid transition-all duration-500 ease-in-out",
                    isGroupActive
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="relative mb-4 ml-4 space-y-1 border-l border-muted-foreground/10 pl-4">
                      {group.tabs.map((tab) => {
                        const isActive = activeTab === tab.id
                        return (
                          <button
                            key={tab.id}
                            onClick={() => handleScrollTo(tab.id)}
                            className={cn(
                              "group relative flex w-full items-center gap-3 rounded-md px-3 py-1.5 text-[13px] font-medium transition-all duration-200",
                              isActive
                                ? "bg-primary/5 text-primary"
                                : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                            )}
                          >
                            {/* Tree Branch Connector (Dot) */}
                            <div
                              className={cn(
                                "absolute top-1/2 left-[-19px] z-10 h-[5px] w-[5px] -translate-y-1/2 rounded-full border border-background transition-all duration-300",
                                isActive
                                  ? "scale-125 bg-primary ring-4 ring-primary/20"
                                  : "bg-muted-foreground/30 group-hover:bg-muted-foreground/60"
                              )}
                            />

                            <HugeiconsIcon
                              icon={tab.icon}
                              className={cn(
                                "h-3.5 w-3.5 transition-transform duration-200",
                                isActive
                                  ? "text-primary"
                                  : "text-muted-foreground/60"
                              )}
                            />
                            <span className="truncate">{tab.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </aside>

      <div className="flex-1 space-y-12">
        {ALL_TABS.map((tab) => (
          <ScrollSection key={tab.id} id={tab.id} onVisible={onSectionVisible}>
            <div className="space-y-4">{renderTabContent(tab.id)}</div>
          </ScrollSection>
        ))}
      </div>

      <button
        onClick={scrollToTop}
        className={cn(
          "group fixed right-8 bottom-8 z-50 rounded-2xl bg-primary p-4 text-primary-foreground shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95",
          showScrollTop
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-20 scale-50 opacity-0"
        )}
      >
        <HugeiconsIcon
          icon={ArrowUp01Icon}
          className="h-6 w-6 transition-transform duration-300 group-hover:-translate-y-1"
        />
      </button>
    </div>
  )
}
