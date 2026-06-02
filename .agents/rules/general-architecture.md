---
trigger: always_on
---

# General Frontend Architecture Documentation

This document outlines the standard architectural patterns and best practices for building scalable frontend web applications. The goal is to provide a clear, reusable blueprint that ensures consistency, scalability, and maintainability across various projects.

## 1. Core Principles

- **Modular Design**: Core domain logic is encapsulated within feature-based modules.
- **Strict Separation of Concerns**: Separation between API interaction (services), state management (hooks), UI components, and page assembly.
- **Pages as Assemblers**: The `app/` directory contains thin page components that assemble UI from global components and logic from modules.
- **Strict TypeScript**: Explicit typing for all data models and API responses.
- **Consistency**: Unified patterns for data fetching, error handling, and UI styling.

---

## 2. Directory Structure

```text
├── app/                  # Next.js App Router (Routing & Page Assembly)
│   ├── (public)/         # Unauthenticated/public routes group
│   ├── (auth)/           # Authenticated user routes
│   └── layout.tsx        # Global layout
├── modules/              # Feature-based domain logic
│   └── {feature}/        # e.g., users, products, auth
│       ├── components/   # Feature-specific UI components
│       ├── endpoints/    # API endpoint constants
│       ├── hooks/        # Custom data fetching hooks (TanStack Query)
│       ├── services/     # API service layer (axios/fetch)
│       └── types/        # TypeScript interfaces/types
├── components/           # UI Components
│   ├── ui/               # shadcn/ui base components
│   ├── layout/           # PageHeader, PageError, etc.
│   └── data-table/       # Generic DataTable implementations
├── hooks/                # Global utility hooks (e.g., useDebounce)
├── lib/                  # Library configurations (e.g., apiClient)
├── types/                # Global types (e.g., PaginatedResponse)
└── public/               # Static assets
```

---

## 3. Module Pattern (`@/modules/{feature}`)

Every feature domain must reside in its own folder inside `modules/`. This isolates business logic and makes the codebase easier to navigate.

### 3.1 Endpoints (`endpoints/`)
Define all API paths as constants.
```typescript
export const FEATURE_ENDPOINTS = {
  LIST: "/feature/list",
  CREATE: "/feature/create",
} as const;
```

### 3.2 Services (`services/`)
Handles the actual HTTP requests. Use a central `apiClient`. Services should return the full `response.data` (which includes metadata for paginated responses or the `data` wrapper for single items).

```typescript
import { PaginatedResponse, ApiResponse } from "@/types";

export const featureService = {
  // List with pagination
  getList: async (params?: Record<string, any>) => {
    const response = await apiClient.get<PaginatedResponse<FeatureModel>>(FEATURE_ENDPOINTS.LIST, { params });
    return response.data;
  },

  // Single item or action
  getDetail: async (id: string | number) => {
    const response = await apiClient.get<ApiResponse<FeatureModel>>(FEATURE_ENDPOINTS.DETAIL(id));
    return response.data;
  }
};
```

### 3.3 Types (`types/`)
Define strict interfaces for the domain.
```typescript
export interface FeatureModel {
  id: string;
  name: string;
  // ...
}
```

### 3.4 Hooks (`hooks/`)
Use **TanStack Query** for data fetching and mutations. Hooks must return a consistent object. Extract the actual data from the response wrapper (e.g., `data.data`) to keep components clean.

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useFeatureList(params?: Record<string, any>) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [FEATURE_ENDPOINTS.LIST, params],
    queryFn: () => featureService.getList(params),
  });

  return {
    items: data?.data || [], // PaginatedResponse has a 'data' array
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate: refetch, 
  };
}
// ...
```

### 3.5 Components (`components/`)
Feature-specific UI components should be placed within the corresponding module's `components/` folder (e.g., `@/modules/feature/components/`). Only shared, generic UI components should be placed in the global `@/components/` directory.

---

## 4. Page Assembly Pattern (`app/`)

Files in `app/` should be minimal. They act as "assemblers".

### Rules for `page.tsx`:
1. Use `'use client'` only if hooks or interactivity are needed. Note that you cannot export metadata from a Client Component.
2. Import domain logic from `@/modules`.
3. Import UI components from `@/components`.
4. Handle loading and error states locally using skeleton loaders and error components.
5. Move complex table column definitions to a separate `columns.tsx` file in the same directory.
6. **Metadata**: Each page must explicitly declare its `metadata` (title and description) using the Next.js Metadata API for SEO. If the page must be a Client Component, export metadata from a `layout.tsx` or wrap it in a Server Component.
7. **Next.js Conventions**: Always maintain the newest Next.js App Router conventions and styles.

Example Server Component (`page.tsx`) with Metadata:
```tsx
import { Metadata } from 'next'
import { FeatureClient } from './feature-client'

export const metadata: Metadata = {
  title: 'Feature Management',
  description: 'View and manage features',
}

export default function FeaturePage() {
  return <FeatureClient />
}
```

Example Client Component (`feature-client.tsx`):
```tsx
'use client'
import { useFeatureList } from '@/modules/feature/hooks/use-feature'
import { DataTable } from '@/components/data-table/data-table'

export function FeatureClient() {
  const { items, isLoading, isError } = useFeatureList()

  if (isLoading) return <DataTableSkeleton />
  if (isError) return <PageError />

  return (
    <DataTable data={items} />
  )
}
```

---

## 5. UI & Styling Conventions

- **Tailwind CSS**: Use utility classes for all styling.
- **shadcn/ui**: Use and extend components from `@/components/ui`.
- **Icons**: Use `lucide-react`.
- **Data Tables**: Use custom `<DataTable />` implementations.
- **Skeleton Loaders**: Always provide a `<DataTableSkeleton />` or similar for loading states.

---

## 6. Best Practices

- **Debouncing**: Always debounce search inputs using a global `useDebounce` hook before passing them to fetching hooks.
- **Naming Conventions**: Use `kebab-case` for all file and directory names (e.g., `user-profile-card.tsx`).
- **Modal Logic**: Manage modal visibility state in the parent page component to prevent unnecessary re-renders in lists. Always use a standalone button to manage the open/close state of the dialog rather than using `DialogTrigger` directly.
- **API Response Handling**: Standardize API responses using global wrappers to ensure consistency.
  - **Lists**: Use `PaginatedResponse<T>` which includes `data: T[]`, `meta`, and `links`.
  - **Single Items**: Use `ApiResponse<T>` which includes `data: T` and optional `message`.

---

## 7. Technology Stack

- **Framework**: Next.js App Router
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Data Fetching**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod

---

## 8. Form Field & Submission Pattern

Standardized approach for forms using **React Hook Form**, **Zod**, and custom UI components.

### 8.1 Schema Definition
Schemas are defined in `@/modules/{feature}/schemas/` using Zod.

```typescript
import * as z from "zod"
export const featureSchema = z.object({
  name: z.string().min(1, "Required"),
})
export type FeatureFormValues = z.infer<typeof featureSchema>
```

### 8.2 Submission Hooks
Submissions are handled by custom hooks (built on `useMutation`) that manage loading states and provide feedback via toasts.

---

## 9. Routing & Backend Tier Pattern

Applications should follow a structured routing pattern that separates concerns between different user contexts (e.g., public vs. admin vs. user dashboard).

### 9.1 URL Structure (Frontend)
Frontend routes should be grouped logically by domain context:
- `/dashboard/*`: Routes for standard authenticated user workflows.
- `/admin/*`: Routes for administrative management and configuration.

### 9.2 API Endpoint Structure (Backend)
API endpoints should follow a tiered architecture that matches the user context, enhancing security and organization:
- `/v1/{module}/portal/dashboard/*`: Endpoints for standard user features.
- `/v1/{module}/portal/admin/*`: Endpoints for admin-facing features.

---

## 10. Advanced Architectural Patterns

### 10.1 Report Generation
To maintain a modular and reusable approach for generating files and reports:
- **Dedicated Modules**: Create a dedicated module for complex report domains (e.g., `@/modules/report-sales`).
- **Export Services**: Use a shared HTTP client configuration to fetch file blobs (e.g., PDF, Excel), ensuring `responseType: 'blob'` is set correctly.
- **Reusable Filters**: Implement generic UI filter components (date ranges, multi-selects) that can be easily plugged into various report pages.

### 10.2 Action Locking (Business Rule Enforcement)
When a record's state restricts user actions (e.g., a "Published" status preventing further edits):
- **Status-Based Rendering**: Conditionally disable or hide action buttons (Edit, Delete, Submit) based on the entity's status.
- **Derived State in Hooks**: Manage the locking logic (e.g., `isActionLocked` or `canEdit`) directly within custom hooks or page assemblers to keep the base UI components reusable and dumb.
