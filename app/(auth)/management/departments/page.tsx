import { Metadata } from 'next'
import { DepartmentManagementClient } from './components/department-management-client'

export const metadata: Metadata = {
  title: 'Departemen',
  description: 'Kelola departemen organisasi dan kepalanya.',
}

export default function DepartmentsPage() {
  return <DepartmentManagementClient />
}