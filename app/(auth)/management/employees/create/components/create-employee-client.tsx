'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { CreateEmployeeForm } from '@/modules/employee/employee/components/create-employee-form';

export function CreateEmployeeClient() {
  const router = useRouter();

  return (
    <div className="space-y-6 pb-12">
      <div className='flex flex-row items-center gap-4'>
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <HugeiconsIcon icon={ArrowLeft01Icon} className="h-5 w-5" />
        </Button>
        <PageHeader
          title="Tambah Karyawan Baru"
          description="Silahkan isi formulir di bawah ini untuk menambahkan karyawan baru ke sistem."
        />
      </div>


      <CreateEmployeeForm />
    </div>
  );
}
