'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePermission } from '@/hooks/use-permission';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';

interface PermissionGuardProps {
  children: ReactNode;
  permissions?: string[];
  roles?: string[];
  requireAll?: boolean;
  fallback?: ReactNode;
}

/**
 * A wrapper component to protect UI elements or routes based on permissions/roles.
 */
export function PermissionGuard({
  children,
  permissions = [],
  roles = [],
  requireAll = false,
  fallback,
}: PermissionGuardProps) {
  const { hasPermission, hasRole, isLoading } = usePermission();
  const router = useRouter();

  const hasAccess = () => {
    // IT role always has access
    if (hasRole('IT')) return true;

    if (permissions.length > 0) {
      const results = permissions.map(p => hasPermission(p));
      if (requireAll) return results.every(Boolean);
      if (results.some(Boolean)) return true;
    }

    if (roles.length > 0) {
      const results = roles.map(r => hasRole(r));
      if (requireAll) return results.every(Boolean);
      if (results.some(Boolean)) return true;
    }

    // If no specific requirements, default to true
    return permissions.length === 0 && roles.length === 0;
  };

  const allowed = hasAccess();

  // If we're guarding a whole page and access is denied
  useEffect(() => {
    if (!isLoading && !allowed && !fallback) {
      router.replace('/forbidden');
    }
  }, [allowed, isLoading, fallback, router]);

  if (isLoading) {
    return <DataTableSkeleton columnCount={3} />;
  }

  if (!allowed) {
    return fallback || null;
  }

  return <>{children}</>;
}
