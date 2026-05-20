'use client';

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  InformationCircleIcon,
  Mail01Icon,
  CallIcon,
  Home01Icon
} from '@hugeicons/core-free-icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ContactItem } from './detail-items';
import { Employee } from '../../types';

interface ContactInfoProps {
  employee: Employee;
}

export function ContactInfo({ employee }: ContactInfoProps) {
  return (
    <Card className="shadow-sm border-muted/60 overflow-hidden pt-0">
      <CardHeader className="pb-3 border-b border-muted/40 bg-muted/20 py-4">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <HugeiconsIcon icon={InformationCircleIcon} className="w-4 h-4 text-primary" />
          Info Kontak
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-muted/40">
          <ContactItem
            icon={Mail01Icon}
            label="Email Perusahaan"
            value={employee.company_email || employee.email}
          />
          <ContactItem
            icon={CallIcon}
            label="Nomor Telepon"
            value={employee.handphone || employee.phone_number || '-'}
          />
          <ContactItem
            icon={Home01Icon}
            label="Alamat Sekarang"
            value={employee.current_address || '-'}
          />
        </div>
      </CardContent>
    </Card>
  );
}
