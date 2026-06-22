import { HugeiconsIcon } from "@hugeicons/react"
import {
  LayoutBottomIcon,
  ComputerTerminalIcon,
  ComponentIcon,
  UserIcon,
  Settings05Icon,
  Calendar01Icon,
  Briefcase01Icon,
  Clock01Icon,
  CalendarIcon,
  Reload,
  DocumentCodeIcon,
  Document,
  User03Icon,
  LocationIcon,
  Mail01Icon,
  IdCardLanyardIcon,
  Warning,
  DocumentValidationIcon,
  DoorIcon,
  BuildingIcon,
  UserGroup02Icon,
  TieIcon,
  ArrowLeftRightIcon,
  BiometricDeviceIcon,
  Banknote,
  Clock02Icon,
  SmartPhone01Icon,
  HealtcareIcon,
  DocumentAttachmentIcon,
  MapPinIcon,
  OfficeIcon,
  Sun,
  History,
  Clock05Icon,
  WorkoutRunIcon,
  DashboardSpeed01Icon,
  HierarchyIcon,
  Settings01Icon,
} from "@hugeicons/core-free-icons"

export const sidebarData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  roles: [
    {
      name: "Karyawan",
      description: "Ruang Kerja Pribadi",
      logo: <HugeiconsIcon icon={UserIcon} strokeWidth={2} />,
      id: "employee",
      allowedRoles: ["Employee"],
    },
    {
      name: "Manajemen",
      description: "Manajemen",
      logo: <HugeiconsIcon icon={OfficeIcon} strokeWidth={2} />,
      id: "manager",
      allowedRoles: ["Department Head", "Admin HRD", "Supervisor"],
    },
    {
      name: "Administrator",
      description: "Kontrol Sistem",
      logo: <HugeiconsIcon icon={Settings05Icon} strokeWidth={2} />,
      id: "admin",
      allowedRoles: ["Admin HRD"],
    },
  ],

  navByRole: {
    employee: [
      {
        label: "Utama",
        items: [
          {
            title: "Dashboard Saya",
            url: "/employee/dashboard",
            icon: <HugeiconsIcon icon={ComputerTerminalIcon} strokeWidth={2} />,
          },
          {
            title: "Riwayat Kehadiran",
            url: "/employee/attendance",
            icon: <HugeiconsIcon icon={User03Icon} strokeWidth={2} />,
          },
          {
            title: "Pengajuan Cuti & Izin",
            url: "/employee/unpaid-leave",
            icon: <HugeiconsIcon icon={Calendar01Icon} strokeWidth={2} />,
          },
          {
            title: "Pengajuan Lembur",
            url: "/employee/overtime",
            icon: <HugeiconsIcon icon={Clock01Icon} strokeWidth={2} />,
          },
          {
            title: "Pengajuan Pertukaran Shift",
            url: "/employee/shift-exchange",
            icon: <HugeiconsIcon icon={ArrowLeftRightIcon} strokeWidth={2} />,
          },
          {
            title: "Surat Peringatan",
            url: "/employee/warning-letter",
            icon: <HugeiconsIcon icon={Warning} strokeWidth={2} />,
          },
          {
            title: "Pengajuan Pengunduran Diri",
            url: "/employee/resignation",
            icon: <HugeiconsIcon icon={DoorIcon} strokeWidth={2} />,
          },
          // {
          //   title: "Pengajuan Pertukaran Shift",
          //   url: "/employee/shift-exchange",
          //   icon: <HugeiconsIcon icon={ArrowLeftRightIcon} strokeWidth={2} />,
          // }
        ],
      },
    ],
    manager: [
      {
        items: [
          {
            title: "Dashboard Manajemen",
            url: "/management/dashboard",
            icon: <HugeiconsIcon icon={ComputerTerminalIcon} strokeWidth={2} />,
          },
          {
            title: "Permintaan Persetujuan",
            url: "/management/approval-workflow/inbox",
            icon: <HugeiconsIcon icon={Mail01Icon} strokeWidth={2} />,
          },
          {
            title: "History Laporan",
            url: "/management/reports",
            icon: (
              <HugeiconsIcon icon={DocumentAttachmentIcon} strokeWidth={2} />
            ),
          },
        ],
      },
      {
        label: "Karyawan",
        roles: ["admin", "manager"],
        items: [
          {
            title: "Data Karyawan",
            url: "/management/employees",
            icon: <HugeiconsIcon icon={IdCardLanyardIcon} strokeWidth={2} />,
          },
          // {
          //   title: "Data Atasan & SPV",
          //   url: "/management/supervisors-and-spv",
          //   icon: <HugeiconsIcon icon={TieIcon} strokeWidth={2} />,
          // },
          {
            title: "Data User",
            url: "/management/users",
            icon: <HugeiconsIcon icon={User03Icon} strokeWidth={2} />,
            roles: ["Admin HRD"],
          },
          {
            title: "Transisi Karir",
            url: "/management/career",
            icon: <HugeiconsIcon icon={ArrowLeftRightIcon} strokeWidth={2} />,
          },
          {
            title: "Surat Peringatan",
            url: "/management/warning-letters",
            icon: <HugeiconsIcon icon={Warning} strokeWidth={2} />,
          },
          {
            title: "Pelatihan Pegawai",
            url: "#",
            icon: <HugeiconsIcon icon={WorkoutRunIcon} strokeWidth={2} />,
          },
          {
            title: "Performa Pegawai",
            url: "#",
            icon: <HugeiconsIcon icon={DashboardSpeed01Icon} strokeWidth={2} />,
          },
          {
            title: "Surat Keterangan Kerja",
            url: "/management/certificate-of-employment",
            icon: (
              <HugeiconsIcon icon={DocumentValidationIcon} strokeWidth={2} />
            ),
          },
          {
            title: "Pengunduran Diri",
            url: "/management/resignation",
            icon: <HugeiconsIcon icon={DoorIcon} strokeWidth={2} />,
          },
        ],
      },
      {
        label: "Susunan",
        roles: ["Admin HRD"],
        items: [
          {
            title: "Diagram Perusahaan",
            url: "/management/organization-chart",
            icon: <HugeiconsIcon icon={HierarchyIcon} strokeWidth={2} />,
            roles: ["Admin HRD", "Department Head"],
          },
          {
            title: "Departemen",
            url: "/management/departments",
            icon: <HugeiconsIcon icon={BuildingIcon} strokeWidth={2} />,
            roles: ["Admin HRD"],
          },
          {
            title: "Tim",
            url: "/management/teams",
            icon: <HugeiconsIcon icon={UserGroup02Icon} strokeWidth={2} />,
            roles: ["Admin HRD"],
          },
          {
            title: "Posisi Kerja",
            url: "/management/work-positions",
            icon: <HugeiconsIcon icon={Briefcase01Icon} strokeWidth={2} />,
            roles: ["Admin HRD"],
          },
          {
            title: "Lokasi Kerja",
            url: "/management/work-locations",
            icon: <HugeiconsIcon icon={MapPinIcon} strokeWidth={2} />,
            roles: ["Admin HRD"],
          },
        ],
      },
      {
        label: "Lembur",
        roles: ["Admin HRD", "Department Head"],
        items: [
          {
            title: "Pengajuan lembur",
            url: "/management/overtime",
            icon: <HugeiconsIcon icon={Clock01Icon} strokeWidth={2} />,
          },
          {
            title: "Jadwal Lembur Pegawai",
            url: "/management/overtime-schedules",
            icon: <HugeiconsIcon icon={Clock01Icon} strokeWidth={2} />,
          },
        ],
      },
      {
        label: "Izin & Cuti",
        roles: ["Admin HRD", "Department Head"],
        items: [
          {
            title: "Pengajuan Izin",
            url: "/management/unpaid-leave",
            icon: <HugeiconsIcon icon={Document} strokeWidth={2} />,
          },

          {
            title: "Hari Libur",
            url: "/management/holidays",
            icon: <HugeiconsIcon icon={Sun} strokeWidth={2} />,
            roles: ["Admin HRD"],
          },
          {
            title: "Hak Cuti Pegawai",
            url: "/management/annual-leaves",
            icon: <HugeiconsIcon icon={CalendarIcon} strokeWidth={2} />,
          },
          {
            title: "Pengembalian Hak Cuti",
            url: "/management/annual-leaves-returns",
            icon: <HugeiconsIcon icon={Reload} strokeWidth={2} />,
          },
        ],
      },
      {
        label: "Absensi",
        roles: ["Admin HRD", "Department Head"],
        items: [
          {
            title: "Data Absensi Pegawai",
            url: "/management/attendance",
            icon: <HugeiconsIcon icon={User03Icon} strokeWidth={2} />,
          },
          {
            title: "Jam Kerja Karyawan",
            url: "/management/attendance-working-hour",
            icon: <HugeiconsIcon icon={Calendar01Icon} strokeWidth={2} />,
            roles: ["Admin HRD"],
          },
          {
            title: "Pertukaran Jam Kerja",
            url: "/management/shift-exchange",
            icon: <HugeiconsIcon icon={ArrowLeftRightIcon} strokeWidth={2} />,
          },

          {
            title: "Data User Absensi",
            url: "/management/attendance-user",
            icon: <HugeiconsIcon icon={User03Icon} strokeWidth={2} />,
            roles: ["Admin HRD"],
          },
          {
            title: "Data User Mesin Absensi",
            url: "/management/zkteco-users",
            icon: <HugeiconsIcon icon={User03Icon} strokeWidth={2} />,
            roles: ["Admin HRD"],
          },
          {
            title: "Log Absensi Mesin",
            url: "/management/attendance-machine-log",
            icon: <HugeiconsIcon icon={Clock02Icon} strokeWidth={2} />,
            roles: ["Admin HRD"],
          },
          {
            title: "Log Absensi Mobile",
            url: "/management/attendance-mobile-log",
            icon: <HugeiconsIcon icon={SmartPhone01Icon} strokeWidth={2} />,
            roles: ["Admin HRD"],
          },
        ],
      },
      {
        label: "Payroll",
        roles: ["Admin HRD", "Department Head"],
        items: [
          {
            title: "Payroll",
            url: "/management/payroll",
            icon: <HugeiconsIcon icon={Banknote} strokeWidth={2} />,
          },
          {
            title: "Data Gaji Pegawai",
            url: "/management/employee-salary",
            icon: <HugeiconsIcon icon={ComponentIcon} strokeWidth={2} />,
          },
          {
            title: "BPJS Kesehatan",
            url: "/management/bpjs-kesehatan",
            icon: <HugeiconsIcon icon={HealtcareIcon} strokeWidth={2} />,
          },
          {
            title: "BPJS Ketenagakerjaan",
            url: "/management/bpjs-ketenagakerjaan",
            icon: <HugeiconsIcon icon={Briefcase01Icon} strokeWidth={2} />,
          },
          {
            title: "PPH 21",
            url: "/management/pph-21",
            icon: <HugeiconsIcon icon={Banknote} strokeWidth={2} />,
          },
          {
            title: "Master Data Pajak",
            icon: <HugeiconsIcon icon={ComponentIcon} strokeWidth={2} />,
            items: [
              {
                title: "Tipe Kategori Pajak",
                url: "/management/tax/tax-category-types",
              },
              {
                title: "Kategori Pajak",
                url: "/management/tax/tax-categories",
              },
              {
                title: "Tunjangan Masa Kerja",
                url: "/management/tax/length-of-service-allowance",
              },
              {
                title: "Tunjangan Sertifikat Kerja",
                url: "/management/tax/certificate-allowance",
              },
              {
                title: "Pajak Penghasilan",
                url: "/management/tax/income-tax",
              },
              {
                title: "PTKP",
                url: "/management/tax/ptkp",
              },
            ],
          },
        ],
      },
    ],
    admin: [
      {
        label: "Konfigurasi Sistem",
        items: [
          {
            title: "Konfigurasi Alur",
            url: "#",
            icon: <HugeiconsIcon icon={Settings05Icon} strokeWidth={2} />,
            items: [
              {
                title: "Kebijakan",
                url: "/configuration/approval-workflow/policies",
              },
              {
                title: "Grup Persetujuan",
                url: "/configuration/approval-workflow/groups",
              },
              {
                title: "Tipe Tahapan",
                url: "/configuration/approval-workflow/step-types",
              },
            ],
          },
          {
            title: "Approval Limit Settings",
            url: "/configuration/approval-settings",
            icon: <HugeiconsIcon icon={Settings05Icon} strokeWidth={2} />,
          },
          {
            title: "Konfigurasi Absensi",
            url: "#",
            icon: <HugeiconsIcon icon={Settings05Icon} strokeWidth={2} />,
            items: [
              {
                title: "Pengaturan Umum",
                url: "/configuration/attendance/settings",
              },
              {
                title: "Pengaturan Kalkulasi",
                url: "/configuration/attendance/calculation-settings",
              },
            ],
          },
          {
            title: "Konfigurasi Passport Roles",
            url: "/configuration/passport-roles",
            icon: <HugeiconsIcon icon={Settings05Icon} strokeWidth={2} />,
          },
          {
            title: "Konfigurasi Payroll",
            url: "#",
            icon: <HugeiconsIcon icon={ComponentIcon} strokeWidth={2} />,
            items: [
              {
                title: "Komponen Gaji",
                url: "/configuration/payroll/salary-components",
              },
            ],
          },

          {
            title: "Hirarki Supervisor",
            url: "/configuration/position-hierarchy-matrix",
            icon: <HugeiconsIcon icon={ComponentIcon} strokeWidth={2} />,
          },
        ],
      },
      {
        label: "Master Data",
        items: [
          {
            title: "Tipe Lembur DAC",
            url: "/configuration/overtime-types",
            icon: <HugeiconsIcon icon={ComponentIcon} strokeWidth={2} />,
          },
          {
            title: "Tipe Pengajuan Izin",
            url: "/configuration/unpaid-leave-types",
            icon: <HugeiconsIcon icon={ComponentIcon} strokeWidth={2} />,
          },
          {
            title: "Data Lokasi Absensi",
            url: "/configuration/attendance-locations",
            icon: <HugeiconsIcon icon={ComponentIcon} strokeWidth={2} />,
          },
          {
            title: "Data Jam Kerja",
            url: "/configuration/working-hours",
            icon: <HugeiconsIcon icon={ComponentIcon} strokeWidth={2} />,
          },
          {
            title: "Data Mesin Absensi",
            url: "/configuration/fingerprint-machines",
            icon: <HugeiconsIcon icon={ComponentIcon} strokeWidth={2} />,
          },
        ],
      },
      {
        label: "Log",
        items: [
          {
            title: "Activity Log",
            url: "/configuration/audit-logs",
            icon: <HugeiconsIcon icon={Clock05Icon} strokeWidth={2} />,
          },
          {
            title: "Task Log",
            url: "/configuration/task-logs",
            icon: <HugeiconsIcon icon={Clock05Icon} strokeWidth={2} />,
          },
        ],
      },
    ],
  },
}
