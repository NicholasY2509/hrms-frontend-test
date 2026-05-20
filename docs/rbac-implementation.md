# HRMS Authentication & RBAC Implementation Guide

This document outlines the high-performance, JWT-based Role-Based Access Control (RBAC) system implemented across the HRMS ecosystem (Passport, HRMS-API, and HRMS-Frontend).

## 1. Overview
The system uses **Self-Describing JWTs**. Instead of the API server calling the Passport server on every request to identify the user (legacy HTTP sync), the JWT itself contains all the user's identity and permission context.

### The Flow:
1. **Passport:** Issues a JWT with custom claims (roles, permissions, email, employee ID).
2. **HRMS-API:** Decodes the JWT locally (zero network latency) and enforces roles via middleware.
3. **HRMS-Frontend:** Decodes the JWT to filter the sidebar, switch workspaces, and hide/show UI elements.

---

## 2. JWT Structure (Custom Claims)
Every token issued by Passport includes these custom claims:
- `email`: User's primary email.
- `eid`: Employee ID Number.
- `roles`: Array of role names (e.g., `["Employee", "Manager"]`).
- `permissions`: Array of granular permissions (e.g., `["view users", "create employee"]`).

### Optimization: Client-ID Scoping
To prevent the token from becoming too large, claims are filtered by the **Client ID** of the requesting application. A user may have 600 permissions system-wide, but if they log into the HRMS-API, they only receive the permissions relevant to that specific client.

---

## 3. Frontend Implementation (`hrms-frontend`)

### A. The `usePermission` Hook
Located at `@/hooks/use-permission.ts`, this is the primary way to check for access in the UI.
- **God Mode:** Any user with the `IT` role automatically passes all `hasRole` and `hasPermission` checks.
- **Usage:**
  ```tsx
  const { hasPermission, hasRole } = usePermission();
  if (hasPermission('create user')) { /* ... */ }
  ```

### B. The `PermissionGuard` Component
Located at `@/components/layout/permission-guard.tsx`. Use this to wrap components or entire pages.
```tsx
<PermissionGuard permissions={['view employees']} roles={['admin']}>
  <EmployeeList />
</PermissionGuard>
```

### C. Sidebar & Workspace Management
High-level navigation is managed via two custom hooks in `@/hooks/use-sidebar-navigation.ts`:
1. **`useSidebarRoles`**: Manages the **Team Switcher**. It filters available workspaces based on the `allowedRoles` mapping in `sidebar-data.tsx`.
2. **`useSidebarNavigation`**: Recursively filters the sidebar menu items based on the user's current roles/permissions.

### D. Mapping Roles to Workspaces
In `data/sidebar-data.tsx`, you can map multiple backend roles to a single UI workspace:
```tsx
{
  name: "Manager",
  id: "manager",
  allowedRoles: ["Manager", "Admin HRD", "Dept Head"], // These backend roles all see the "Manager" workspace.
}
```

---

## 4. Backend Implementation (`hrms-api`)

### A. Local Decoding (`AuthSyncService`)
The `AuthSyncService` attempts to decode the JWT locally first. If the token contains the required claims, it skips the expensive HTTP call to the Passport server, saving ~300ms per request.

### B. Role Middleware
Enforce access on API routes using the `role` middleware:
```php
Route::get('/sensitive-data', [Controller::class, 'index'])->middleware('role:admin,hr-manager');
```
*Note: Users with the `IT` role automatically bypass these checks.*

---

## 5. Troubleshooting & Maintenance
- **Token Size:** If tokens exceed 8KB, check Nginx `large_client_header_buffers`. Client-ID scoping is designed to prevent this.
- **Logs:** 
  - Passport logs: `storage/logs/laravel.log` (look for `CustomAccessToken`).
  - API logs: `storage/logs/laravel.log` (look for `AuthSyncService`).
- **Debugging:** Paste the `access_token` into [jwt.io](https://jwt.io) to verify that claims are being correctly injected by Passport.
