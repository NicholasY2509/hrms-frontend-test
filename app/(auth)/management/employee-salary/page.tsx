import { Metadata } from 'next';
import { EmployeeSalaryClient } from './components/employee-salary-client';

export const metadata: Metadata = {
  title: 'Gaji Karyawan',
  description: 'Kelola dan pantau data gaji seluruh karyawan.',
};

export default function EmployeeSalaryPage() {
  return <EmployeeSalaryClient />;
}