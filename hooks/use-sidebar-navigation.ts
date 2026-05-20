'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { sidebarData } from '@/data/sidebar-data';
import { usePermission } from '@/hooks/use-permission';
import { usePendingApprovals } from '@/modules/approval-workflow/actions/hooks/use-approvals';

/**
 * Hook to manage sidebar roles and workspace switching
 */
export function useSidebarRoles(initialRoleId: string) {
  const [activeRoleId, setActiveRoleId] = React.useState<string>(initialRoleId);
  const { user, hasRole } = usePermission();

  const handleRoleChange = React.useCallback((roleId: string) => {
    setActiveRoleId(roleId);
    document.cookie = `active_role=${roleId}; path=/; max-age=${60 * 60 * 24 * 7}`;
    localStorage.setItem('activeRoleId', roleId);
  }, []);

  const filteredRoles = React.useMemo(() => {
    if (!user) return [];
    const userRoleNames = user.roles || [];

    return sidebarData.roles.filter(r => {
      if (hasRole('IT')) return true;

      if (r.allowedRoles) {
        return r.allowedRoles.some(role => userRoleNames.includes(role));
      }

      return userRoleNames.includes(r.id) || r.id === 'employee';
    });
  }, [user, hasRole]);

  React.useEffect(() => {
    if (filteredRoles.length > 0 && !filteredRoles.some((r) => r.id === activeRoleId)) {
      handleRoleChange(filteredRoles[0].id);
    }
  }, [filteredRoles, activeRoleId, handleRoleChange]);

  return {
    activeRoleId,
    filteredRoles,
    handleRoleChange,
  };
}

/**
 * Hook to manage navigation item filtering and state
 */
export function useSidebarNavigation(activeRoleId: string) {
  const pathname = usePathname();
  const { hasPermission, hasRole } = usePermission();

  const { approvals } = usePendingApprovals(undefined, {
    enabled: activeRoleId === 'manager',
  });

  const navMainWithActive = React.useMemo(() => {
    const groups = (sidebarData.navByRole as any)[activeRoleId] || [];

    const checkAccess = (item: any) => {
      if (item.roles && !item.roles.some((r: string) => hasRole(r))) return false;
      if (item.permissions && !item.permissions.some((p: string) => hasPermission(p))) return false;
      return true;
    };

    const processItem = (item: any): any => {
      const isChildActive = item.items?.some(
        (subItem: any) => pathname === subItem.url || pathname.startsWith(subItem.url + '/')
      );
      const isActive = pathname === item.url || pathname.startsWith(item.url + '/') || isChildActive;

      // Dynamic Badge Logic
      let badge = item.badge;
      if (item.title === 'Permintaan Persetujuan' && approvals.length > 0) {
        badge = approvals.length.toString();
      }

      return {
        ...item,
        isActive,
        badge,
        items: item.items?.filter(checkAccess).map(processItem),
      };
    };

    return groups
      .map((group: any) => ({
        ...group,
        items: group.items.filter(checkAccess).map(processItem),
      }))
      .filter((group: any) => group.items.length > 0);
  }, [pathname, activeRoleId, approvals, hasPermission, hasRole]);

  return {
    navMainWithActive,
    approvals,
  };
}
