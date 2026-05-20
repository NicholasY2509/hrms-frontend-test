import {
  Notification01Icon,
  Calendar01Icon,
  Clock01Icon,
  Mail01Icon,
  InformationCircleIcon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
  LicenseIcon,
  DoorIcon,
  ArrowLeftRightIcon,
  Alert02Icon,
  Tick02Icon,
  Briefcase01Icon,
  BirthdayCakeIcon,
} from "@hugeicons/core-free-icons"

export const getNotificationIcon = (type: string, iconName?: string) => {
  const identifier = (iconName || type).toLowerCase();

  // Priority 1: Explicitly mapped icons from backend
  if (identifier.includes('approval_required')) return Mail01Icon;
  if (identifier.includes('approval_approved')) return CheckmarkCircle02Icon;
  if (identifier.includes('approval_rejected')) return Cancel01Icon;
  if (identifier.includes('approval_submitted')) return Tick02Icon;
  if (identifier.includes('birthday')) return BirthdayCakeIcon;
  if (identifier.includes('late')) return Clock01Icon;
  if (identifier.includes('missing_log')) return Alert02Icon;

  // Priority 2: Type-based module fallbacks
  if (identifier.includes('unpaidleave') || identifier.includes('leave')) return Calendar01Icon;
  if (identifier.includes('overtime')) return Clock01Icon;
  if (identifier.includes('career')) return Briefcase01Icon;
  if (identifier.includes('resignation')) return DoorIcon;
  if (identifier.includes('certificate')) return LicenseIcon;
  if (identifier.includes('warning')) return Alert02Icon;
  if (identifier.includes('paidleavereversal')) return ArrowLeftRightIcon;

  return InformationCircleIcon;
}

export const getNotificationTitle = (type: string, backendTitle?: string) => {
  if (backendTitle) return backendTitle;

  const t = type.toLowerCase();
  if (t.includes("attendance_late")) return "Terlambat Datang";
  if (t.includes("attendance_missing_log")) return "Log Absensi";
  if (t.includes("social_birthday_self")) return "Selamat Ulang Tahun";
  if (t.includes("approval_submitted")) return "Pengajuan Berhasil";
  if (t.includes("unpaidleave")) return "Pengajuan Izin";
  if (t.includes("leave")) return "Pengajuan Cuti";
  if (t.includes("overtime")) return "Lembur";
  if (t.includes("career")) return "Transisi Karir";
  if (t.includes("resignation")) return "Pengunduran Diri";
  if (t.includes("certificate")) return "Surat Keterangan";
  if (t.includes("warning")) return "Surat Peringatan";
  if (t.includes("paidleavereversal")) return "Pengembalian Hak Cuti";
  if (t.includes("approval")) return "Persetujuan";
  
  return "Notifikasi";
}
