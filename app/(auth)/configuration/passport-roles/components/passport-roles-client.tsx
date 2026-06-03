'use client';

import * as React from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GlobalPassportRolesClient } from './global-passport-roles-client';
import { WorkPositionRolesClient } from './work-position-roles-client';

export function PassportRolesClient() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Konfigurasi Peran Passport"
        description="Atur hak akses dan peran karyawan pada aplikasi-aplikasi yang terintegrasi (Passport)."
      />

      <Tabs defaultValue="global" className="space-y-6">
        <TabsList>
          <TabsTrigger value="global">Peran Global</TabsTrigger>
          <TabsTrigger value="work-position">Peran Posisi Kerja</TabsTrigger>
        </TabsList>
        <TabsContent value="global" className="space-y-6">
          <GlobalPassportRolesClient />
        </TabsContent>
        <TabsContent value="work-position" className="space-y-6">
          <WorkPositionRolesClient />
        </TabsContent>
      </Tabs>
    </div>
  );
}
