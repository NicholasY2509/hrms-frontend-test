'use client';

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
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
  ArrowUp01Icon
} from '@hugeicons/core-free-icons';
import { Card, CardTitle } from '@/components/ui/card';
import { Employee } from '../../types';
import { cn } from '@/lib/utils';
import { EducationTab } from './tabs/education-tab';
import { FamilyTab } from './tabs/family-tab';
import { WarningTab } from './tabs/warning-tab';
import { ExperienceTab } from './tabs/experience-tab';
import { LicenseTab } from './tabs/license-tab';
import { VehicleTab } from './tabs/vehicle-tab';
import { AttachmentTab } from './tabs/attachment-tab';
import { InsuranceTab } from './tabs/insurance-tab';
import { BankTab } from './tabs/bank-tab';
import { OverviewTab } from './tabs/overview-tab';
import { PersonalTab } from './tabs/personal-tab';
import { EmergencyContactTab } from './tabs/emergency-contact-tab';
import { PayrollTab } from './tabs/payroll-tab';


interface DetailTabsProps {
  employee: Employee;
  className?: string;
}

const TAB_GROUPS = [
  {
    title: 'Profil Utama',
    tabs: [
      { id: 'overview', label: 'Overview', icon: InformationCircleIcon },
      { id: 'personal', label: 'Personal Data', icon: IdCardLanyardIcon },
      { id: 'family', label: 'Anggota Keluarga', icon: UserGroupIcon },
      { id: 'emergency', label: 'Kontak Darurat', icon: ContactIcon },
    ]
  },
  {
    title: 'Karir & Kompetensi',
    tabs: [
      { id: 'education', label: 'Riwayat Pendidikan', icon: LicenseIcon },
      { id: 'experience', label: 'Pengalaman Kerja', icon: Briefcase01Icon },
      { id: 'training', label: 'Pelatihan', icon: DiplomaIcon },
      { id: 'performance', label: 'Performa', icon: Task01Icon },
      { id: 'contract', label: 'Histori Kontrak', icon: Briefcase01Icon },
    ]
  },
  {
    title: 'Keuangan & Jaminan',
    tabs: [
      { id: 'payroll', label: 'Payroll & Pajak', icon: BankIcon },
      { id: 'insurance', label: 'Jaminan Sosial', icon: Shield },
      { id: 'social_security', label: 'Asuransi Tambahan', icon: Shield01Icon },
      { id: 'bank', label: 'Rekening Bank', icon: BankIcon },
    ]
  },

  {
    title: 'Aset & Dokumen',
    tabs: [
      { id: 'inventory', label: 'Inventaris', icon: Boxes },
      { id: 'license', label: 'SIM', icon: IdCardLanyardIcon },
      { id: 'vehicle', label: 'Kendaraan Pribadi', icon: Car01Icon },
      { id: 'attachment', label: 'Lampiran', icon: AttachmentIcon },
    ]
  },
  {
    title: 'Lainnya',
    tabs: [
      { id: 'warning', label: 'Surat Peringatan', icon: InformationCircleIcon },
      { id: 'approvals', label: 'Approval Izin', icon: UserCheck01Icon },
    ]
  }
];

const ALL_TABS = TAB_GROUPS.flatMap(group => group.tabs);

function ScrollSection({
  id,
  children,
  onVisible,
  className
}: {
  id: string;
  children: React.ReactNode;
  onVisible: (id: string) => void;
  className?: string;
}) {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const [hasBeenVisible, setHasBeenVisible] = React.useState(false);

  React.useEffect(() => {
    // Observer for Lazy Loading (Prefetch data 1000px before it enters viewport)
    const lazyObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasBeenVisible(true);
          lazyObserver.disconnect();
        }
      },
      { rootMargin: '0px 0px 1000px 0px' }
    );

    // Observer for Scroll Spy (Accuracy for sidebar active state)
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onVisible(id);
          }
        });
      },
      {
        threshold: [0, 0.1, 0.2, 0.5],
        rootMargin: '-20% 0px -70% 0px'
      }
    );

    if (sectionRef.current) {
      lazyObserver.observe(sectionRef.current);
      spyObserver.observe(sectionRef.current);
    }

    return () => {
      lazyObserver.disconnect();
      spyObserver.disconnect();
    };
  }, [id, onVisible]);

  return (
    <div
      id={id}
      ref={sectionRef}
      className={cn("scroll-mt-24 min-h-[100px]", className)}
    >
      {hasBeenVisible ? (
        children
      ) : (
        <Card className="p-8 h-[400px] flex items-center justify-center bg-muted/5 animate-pulse">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-muted" />
            <div className="h-4 w-32 bg-muted rounded" />
          </div>
        </Card>
      )}
    </div>
  );
}

export function DetailTabs({ employee, className }: DetailTabsProps) {
  const [activeTab, setActiveTab] = React.useState('overview');
  const [isManualScrolling, setIsManualScrolling] = React.useState(false);

  const activeGroupTitle = React.useMemo(() => {
    return TAB_GROUPS.find(group =>
      group.tabs.some(tab => tab.id === activeTab)
    )?.title;
  }, [activeTab]);

  const handleScrollTo = (id: string) => {
    setIsManualScrolling(true);
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setTimeout(() => setIsManualScrolling(false), 1000);
  };

  const [showScrollTop, setShowScrollTop] = React.useState(false);

  React.useEffect(() => {
    const toggleVisible = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const onSectionVisible = (id: string) => {
    if (!isManualScrolling) {
      setActiveTab(id);
    }
  };

  const renderTabContent = (id: string) => {
    switch (id) {
      case 'overview': return <OverviewTab employee={employee} />;
      case 'personal': return <PersonalTab employee={employee} />;
      case 'education': return <EducationTab employeeId={employee.id} />;
      case 'family': return <FamilyTab employeeId={employee.id} />;
      case 'emergency': return <EmergencyContactTab employeeId={employee.id} />;
      case 'experience': return <ExperienceTab employeeId={employee.id} />;
      case 'warning': return <WarningTab employeeId={employee.id} />;
      case 'license': return <LicenseTab employeeId={employee.id} />;
      case 'vehicle': return <VehicleTab employeeId={employee.id} />;
      case 'attachment': return <AttachmentTab employeeId={employee.id} />;
      case 'insurance': return <InsuranceTab employeeId={employee.id} />;
      case 'bank': return <BankTab employeeId={employee.id} />;
      case 'payroll': return <PayrollTab employeeId={employee.id} />;

      default:
        const tab = ALL_TABS.find(t => t.id === id);
        return (
          <Card className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-muted/5 border-dashed">
            <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-6 ring-1 ring-primary/10">
              <HugeiconsIcon icon={tab?.icon || InformationCircleIcon} className="w-8 h-8" />
            </div>
            <CardTitle className="text-xl mb-2">{tab?.label}</CardTitle>
            <p className="text-sm text-muted-foreground max-w-[280px]">
              Data {tab?.label} sedang dalam pengembangan dan akan segera tersedia.
            </p>
          </Card>
        );
    }
  };

  return (
    <div className={cn("flex flex-col lg:flex-row gap-4 relative", className)}>
      <aside className="w-full lg:w-1/5 shrink-0">
        <div className="sticky top-8 space-y-4">
          {TAB_GROUPS.map((group) => {
            const isGroupActive = activeGroupTitle === group.title;

            return (
              <div key={group.title} className="space-y-2">
                {/* Category Header */}
                <button
                  onClick={() => handleScrollTo(group.tabs[0].id)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-muted/30 rounded-lg transition-colors group"
                >
                  <div className={cn(
                    "w-5 h-5 rounded-md flex items-center justify-center transition-all duration-300",
                    isGroupActive ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground"
                  )}>
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full transition-all",
                      isGroupActive ? "bg-white scale-125" : "bg-muted-foreground/40"
                    )} />
                  </div>
                  <h4 className={cn(
                    "text-[10px] font-bold uppercase tracking-widest transition-colors",
                    isGroupActive ? "text-foreground" : "text-muted-foreground/70"
                  )}>
                    {group.title}
                  </h4>
                </button>

                {/* Collapsible Content with Tree Line */}
                <div className={cn(
                  "grid transition-all duration-500 ease-in-out",
                  isGroupActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}>
                  <div className="overflow-hidden">
                    <div className="ml-4 pl-4 border-l border-muted-foreground/10 space-y-1 relative mb-4">
                      {group.tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => handleScrollTo(tab.id)}
                            className={cn(
                              "w-full flex items-center gap-3 px-3 py-1.5 text-[13px] font-medium rounded-md transition-all duration-200 group relative",
                              isActive
                                ? "text-primary bg-primary/5"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                            )}
                          >
                            {/* Tree Branch Connector (Dot) */}
                            <div className={cn(
                              "absolute left-[-19px] top-1/2 -translate-y-1/2 w-[5px] h-[5px] rounded-full border border-background transition-all duration-300 z-10",
                              isActive
                                ? "bg-primary ring-4 ring-primary/20 scale-125"
                                : "bg-muted-foreground/30 group-hover:bg-muted-foreground/60"
                            )} />

                            <HugeiconsIcon
                              icon={tab.icon}
                              className={cn(
                                "w-3.5 h-3.5 transition-transform duration-200",
                                isActive ? "text-primary" : "text-muted-foreground/60"
                              )}
                            />
                            <span className="truncate">{tab.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      <div className="flex-1 space-y-12">
        {ALL_TABS.map((tab) => (
          <ScrollSection
            key={tab.id}
            id={tab.id}
            onVisible={onSectionVisible}
          >
            <div className="space-y-4">
              {renderTabContent(tab.id)}
            </div>
          </ScrollSection>
        ))}
      </div>

      <button
        onClick={scrollToTop}
        className={cn(
          "fixed bottom-8 right-8 z-50 p-4 rounded-2xl bg-primary text-primary-foreground shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 group",
          showScrollTop ? "translate-y-0 opacity-100 scale-100" : "translate-y-20 opacity-0 scale-50 pointer-events-none"
        )}
      >
        <HugeiconsIcon
          icon={ArrowUp01Icon}
          className="w-6 h-6 transition-transform duration-300 group-hover:-translate-y-1"
        />
      </button>
    </div>
  );
}
