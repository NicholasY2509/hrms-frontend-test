'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import {
  Briefcase01Icon,
  UserIcon,
  IdCardLanyardIcon,
  SaveIcon,
  Loading03Icon,
  InformationCircleIcon,
  AttachmentIcon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { createEmployeeSchema, CreateEmployeeFormValues } from '../schemas';
import { useCreateEmployee } from '../hooks/use-employee-mutation';
import { useGenerateNik } from '../hooks/use-employees';

import { WorkInfoSection } from './sections/work-info-section';
import { PersonalInfoSection } from './sections/personal-info-section';
import { IdentityAddressSection } from './sections/identity-address-section';
import { UserAccountSection } from './sections/user-account-section';
import { AttachmentSection } from './sections/attachment-section';

const FORM_GROUPS = [
  {
    title: 'Data Karyawan',
    sections: [
      { id: 'work', label: 'Informasi Pekerjaan', icon: Briefcase01Icon },
      { id: 'personal', label: 'Informasi Pribadi', icon: UserIcon },
      { id: 'identity', label: 'Identitas & Alamat', icon: IdCardLanyardIcon },
      { id: 'user', label: 'Akun Pengguna', icon: UserIcon },
      { id: 'attachment', label: 'Lampiran', icon: AttachmentIcon },
    ]
  }
];

const ALL_SECTIONS = FORM_GROUPS.flatMap(group => group.sections);

function ScrollSection({
  id,
  title,
  icon,
  children,
  onVisible,
  className
}: {
  id: string;
  title: string;
  icon: any;
  children: React.ReactNode;
  onVisible: (id: string) => void;
  className?: string;
}) {
  const sectionRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
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
      spyObserver.observe(sectionRef.current);
    }

    return () => spyObserver.disconnect();
  }, [id, onVisible]);

  return (
    <div id={id} ref={sectionRef} className={cn("scroll-mt-24", className)}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <HugeiconsIcon icon={icon} className="w-4 h-4" />
            </div>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </div>
  );
}

export function CreateEmployeeForm() {
  const router = useRouter();
  const [activeSection, setActiveSection] = React.useState('work');
  const [isManualScrolling, setIsManualScrolling] = React.useState(false);

  const activeGroupTitle = React.useMemo(() => {
    return FORM_GROUPS.find(group =>
      group.sections.some(section => section.id === activeSection)
    )?.title;
  }, [activeSection]);

  const { createEmployee, isLoading } = useCreateEmployee({
    onSuccess: (data) => {
      router.push(`/management/employees/${data.data.id}`);
    },
  });

  const { control, handleSubmit, watch, setValue, formState: { isDirty } } = useForm<CreateEmployeeFormValues>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: {
      employee_id_number: '',
      initial_name: '',
      company_email: '',
      work_position_id: undefined,
      department_id: undefined,
      team_id: null,
      work_location_id: undefined,
      employee_status_id: undefined,
      work_employee_status_id: 1, // Default Active
      join_date: format(new Date(), 'yyyy-MM-dd'),

      // Personal
      full_name: '',
      first_name: '',
      last_name: '',
      phone_number: '',
      handphone: '',
      gender_id: null,
      marital_status_id: null,
      id_card_number: '',
      religion_id: undefined,
      blood_group_id: undefined,
      place_birth: '',
      date_birth: '',
      current_address: '',
      residence_address: '',
      avatar: null,

      // User Account
      email: '',
      password: '',
      password_confirmation: '',

      // Attachments
      ktp: null,
      kartu_keluarga: null,
      ijazah: null,
      file_pendukung: [],
    },
  });

  const firstName = watch('first_name');
  const lastName = watch('last_name');
  const workPositionId = watch('work_position_id');

  const { nik, isLoading: isGeneratingNik } = useGenerateNik(workPositionId);

  React.useEffect(() => {
    const fullName = `${firstName || ''} ${lastName || ''}`.trim();
    setValue('full_name', fullName, { shouldValidate: !!fullName });
  }, [firstName, lastName, setValue]);

  React.useEffect(() => {
    if (nik) {
      setValue('employee_id_number', nik, { shouldValidate: true });
    }
  }, [nik, setValue]);

  const handleScrollTo = (id: string) => {
    setIsManualScrolling(true);
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setTimeout(() => setIsManualScrolling(false), 1000);
  };

  const onSectionVisible = (id: string) => {
    if (!isManualScrolling) {
      setActiveSection(id);
    }
  };

  const onSubmit = async (data: CreateEmployeeFormValues) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === 'file_pendukung' && Array.isArray(value)) {
          value.forEach((file) => {
            if (file instanceof File) {
              formData.append('file_pendukung[]', file);
            }
          });
        } else if (value instanceof File) {
          formData.append(key, value);
        } else if (typeof value === 'object' && !Array.isArray(value)) {
          formData.append(key, String(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    await createEmployee(formData);
  };

  const renderSectionContent = (id: string) => {
    switch (id) {
      case 'work':
        return <WorkInfoSection control={control} isGeneratingNik={isGeneratingNik} />;
      case 'personal':
        return <PersonalInfoSection control={control} />;
      case 'identity':
        return <IdentityAddressSection control={control} />;
      case 'user':
        return <UserAccountSection control={control} />;
      case 'attachment':
        return <AttachmentSection control={control} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 relative">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-1/5 shrink-0">
        <div className="sticky top-8 space-y-4">
          {FORM_GROUPS.map((group) => {
            const isGroupActive = activeGroupTitle === group.title;

            return (
              <div key={group.title} className="space-y-2">
                {/* Category Header */}
                <button
                  onClick={() => handleScrollTo(group.sections[0].id)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-muted/30 rounded-lg transition-colors group text-left"
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
                      {group.sections.map((section) => {
                        const isActive = activeSection === section.id;
                        return (
                          <button
                            key={section.id}
                            onClick={() => handleScrollTo(section.id)}
                            className={cn(
                              "w-full flex items-center gap-3 px-3 py-1.5 text-[13px] font-medium rounded-md transition-all duration-200 group relative text-left",
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
                              icon={section.icon}
                              className={cn(
                                "w-3.5 h-3.5 transition-transform duration-200",
                                isActive ? "text-primary" : "text-muted-foreground/60"
                              )}
                            />
                            <span className="truncate">{section.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="pt-4 mt-4 border-t space-y-2">
            <Button
              type="button"
              className="w-full justify-start gap-2"
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              {isLoading ? (
                <HugeiconsIcon icon={Loading03Icon} className="w-4 h-4 animate-spin" />
              ) : (
                <HugeiconsIcon icon={SaveIcon} className="w-4 h-4" />
              )}
              Simpan Karyawan
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              <HugeiconsIcon icon={InformationCircleIcon} className="w-4 h-4" />
              Batalkan
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex-1 space-y-6">
        <form
          onSubmit={handleSubmit(onSubmit, (errors) => {
            console.log('Create Employee Validation Errors:', errors);
          })}
          className="space-y-6"
        >
          {ALL_SECTIONS.map((section) => (
            <ScrollSection
              key={section.id}
              id={section.id}
              title={section.label}
              icon={section.icon}
              onVisible={onSectionVisible}
            >
              {renderSectionContent(section.id)}
            </ScrollSection>
          ))}
        </form>
      </div>
    </div>
  );
}
