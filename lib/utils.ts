import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"
import { id } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number | string) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value))
}

export function formatDate(date: string | Date | null | undefined, formatStr: string = 'dd MMMM yyyy') {
  if (!date) return '-';
  try {
    return format(new Date(date), formatStr, { locale: id });
  } catch (e) {
    return String(date);
  }
}

export function formatDateTime(date: string | Date | null | undefined) {
  return formatDate(date, 'dd MMM yyyy HH:mm');
}
