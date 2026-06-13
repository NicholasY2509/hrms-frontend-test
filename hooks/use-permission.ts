'use client';

import { useAuth } from '@/modules/auth/hooks/auth-context';

/**
 * Hook for role-based UI control.
 * 
 * Usage:
 *   const { hasRole, hasAnyRole } = usePermission();
 *   if (hasRole('admin')) { ... }
 *   if (hasAnyRole('admin', 'hr-manager')) { ... }
 */
export function usePermission() {
  const { user, roles, permissions } = useAuth();
  const isIT = roles.includes('IT');

  const hasRole = (role: string): boolean => isIT || roles.includes(role);

  const hasPermission = (permission: string): boolean => isIT || permissions.includes(permission);

  const hasAnyRole = (...requiredRoles: string[]): boolean =>
    requiredRoles.some((r) => roles.includes(r));

  const hasAllRoles = (...requiredRoles: string[]): boolean =>
    requiredRoles.every((r) => roles.includes(r));

  return {
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAllRoles,
    roles,
    permissions,
    user,
    isLoading: !user
  };
}
