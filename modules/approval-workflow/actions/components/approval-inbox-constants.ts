import {
  Calendar01Icon,
  Timer02Icon,
  Briefcase01Icon,
  Alert01Icon,
  LicenseIcon,
  FileEditIcon,
} from '@hugeicons/core-free-icons';

export const MODULE_CONFIGS: Record<string, { label: string; icon: any; color: string; bgColor: string; borderColor: string; accent: string; detailPath: string }> = {
  'UnpaidLeave': {
    label: 'Izin & Cuti',
    icon: Calendar01Icon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50/40',
    borderColor: 'border-blue-100/50',
    accent: 'bg-blue-500',
    detailPath: '/management/unpaid-leave',
  },
  'Overtime': {
    label: 'Lembur',
    icon: Timer02Icon,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50/40',
    borderColor: 'border-amber-100/50',
    accent: 'bg-amber-500',
    detailPath: '/management/overtime',
  },
  'Career': {
    label: 'Karir / Mutasi',
    icon: Briefcase01Icon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50/40',
    borderColor: 'border-purple-100/50',
    accent: 'bg-purple-500',
    detailPath: '/management/career',
  },
  'WarningLetter': {
    label: 'Surat Peringatan',
    icon: Alert01Icon,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50/40',
    borderColor: 'border-rose-100/50',
    accent: 'bg-rose-500',
    detailPath: '/management/warning-letters',
  },
  'CertificateOfEmployment': {
    label: 'Sertifikat Kerja',
    icon: LicenseIcon,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50/40',
    borderColor: 'border-emerald-100/50',
    accent: 'bg-emerald-500',
    detailPath: '/management/certificate-of-employment',
  },
  'Resignation': {
    label: 'Pengunduran Diri',
    icon: FileEditIcon,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50/40',
    borderColor: 'border-rose-100/50',
    accent: 'bg-rose-500',
    detailPath: '/management/resignation',
  },
  'PaidLeaveReversal': {
    label: 'Pengembalian Hak Cuti',
    icon: FileEditIcon,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50/40',
    borderColor: 'border-indigo-100/50',
    accent: 'bg-indigo-500',
    detailPath: '/management/annual-leaves-returns',
  },
  'default': {
    label: 'Pengajuan',
    icon: FileEditIcon,
    color: 'text-slate-600',
    bgColor: 'bg-slate-50/40',
    borderColor: 'border-slate-100/50',
    accent: 'bg-slate-500',
    detailPath: '/management/approval-workflow/detail',
  }
};

export const getModuleConfig = (type: string) => {
  if (type.includes('UnpaidLeave')) return MODULE_CONFIGS['UnpaidLeave'];
  if (type.includes('Overtime')) return MODULE_CONFIGS['Overtime'];
  if (type.includes('WarningLetter')) return MODULE_CONFIGS['WarningLetter'];
  if (type.includes('Career')) return MODULE_CONFIGS['Career'];
  if (type.includes('CertificateOfEmployment')) return MODULE_CONFIGS['CertificateOfEmployment'];
  if (type.includes('Resignation')) return MODULE_CONFIGS['Resignation'];
  if (type.includes('PaidLeaveReversal')) return MODULE_CONFIGS['PaidLeaveReversal'];
  return MODULE_CONFIGS['default'];
};
