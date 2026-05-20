---
trigger: always_on
---

# Project Architecture Documentation: Aftersales Frontend

This document outlines the architectural patterns and best practices used in this project. The goal is to provide a clear blueprint that can be replicated in other frontend projects to ensure consistency, scalability, and maintainability.

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
│   ├── (auth)/           # Authenticated routes group
│   │   ├── employee/     # Employee self-service routes
│   │   ├── management/   # Management & HR routes
│   │   └── configuration/# System configuration routes
│   └── layout.tsx        # Global layout
├── modules/              # Feature-based domain logic
│   └── {feature}/        # e.g., reception, gate-in, auth
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
    mutate: refetch, // Aligned with SWR's naming for consistency
  };
}

export function useFeatureDetail(id: string | number) {
  const { data, error, isLoading } = useQuery({
    queryKey: id ? [FEATURE_ENDPOINTS.DETAIL(id)] : null,
    queryFn: () => featureService.getDetail(id),
    enabled: !!id,
  });

  return {
    item: data?.data, // ApiResponse has a 'data' object
    isLoading,
    isError: error,
  };
}

export function useFeatureMutation() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (data: FeatureFormValues) => featureService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FEATURE_ENDPOINTS.LIST] });
    }
  });
  
  return mutation;
}
```

---

## 4. Page Assembly Pattern (`app/`)

Files in `app/` should be minimal. They act as "assemblers".

### Rules for `page.tsx`:
1. Use `'use client'` only if hooks or interactivity are needed.
2. Import domain logic from `@/modules`.
3. Import UI components from `@/components`.
4. Handle loading and error states locally using skeleton loaders and error components.
5. Move complex table column definitions to a separate `columns.tsx` file in the same directory.

Example:
```tsx
'use client'
import { useFeatureList } from '@/modules/feature/hooks/use-feature'
import { DataTable } from '@/components/data-table/data-table'
import { columns } from './columns'

export default function FeaturePage() {
  const { items, isLoading, isError } = useFeatureList()

  if (isLoading) return <DataTableSkeleton />
  if (isError) return <PageError />

  return (
    <DataTable columns={columns} data={items} />
  )
}
```

---

## 5. UI & Styling Conventions

- **Tailwind CSS**: Use utility classes for all styling.
- **shadcn/ui**: Use and extend components from `@/components/ui`.
- **Icons**: Use `lucide-react`.
- **Data Tables**: Use the custom `<DataTable />` and `<DataTablePagination />` components.
- **Skeleton Loaders**: Always provide a `<DataTableSkeleton />` or similar for loading states.

---

## 6. Best Practices

- **Debouncing**: Always debounce search inputs using the global `useDebounce` hook before passing them to fetching hooks.
- **Modal Logic**: Manage modal visibility state in the parent page component to prevent unnecessary re-renders in lists.
- **API Response Handling**: Standardize API responses using global wrappers to ensure consistency.
  - **Lists**: Use `PaginatedResponse<T>` which includes `data: T[]`, `meta`, and `links`.
  - **Single Items**: Use `ApiResponse<T>` which includes `data: T` and optional `message`.
  - Services return the wrapper; Hooks extract the content.
- **Error Handling**: Use the `<PageError />` component for high-level errors to provide a consistent user experience.

---

## 7. Technology Stack

- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Data Fetching**: TanStack Query (React Query)
- **HTTP Client**: Axios (wrapped in `apiClient`)
- **Icons**: Lucide React
- **State Management**: React Hooks + TanStack Query Cache

## 8. Form Field & Submission Pattern

This project uses a standardized approach for forms using **React Hook Form**, **Zod**, and custom UI components.

### 8.1 Schema Definition
Schemas are defined in `@/modules/{feature}/schemas/` using Zod. Always export a `FormValues` type.

```typescript
import * as z from "zod"
export const featureSchema = z.object({
  name: z.string().min(1, "Wajib diisi"),
})
export type FeatureFormValues = z.infer<typeof featureSchema>
```

### 8.2 Field Components
We use a custom field system in `@/components/ui/field.tsx`:
- `FieldGroup`: Container for grouping fields.
- `Field`: Wrapper for a single field (label + input + error).
- `FieldLabel`: Label with an optional `required` asterisk.
- `FieldError`: Displays validation errors.

### 8.3 Form Implementation
Integrate with `react-hook-form` using the `Controller` component.

```tsx
<Controller
  name="name"
  control={control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name} required>Nama</FieldLabel>
      <Input {...field} id={field.name} aria-invalid={fieldState.invalid} />
      <FieldError errors={[fieldState.error]} />
    </Field>
  )}
/>
```

### 8.4 Submission Hooks
Submissions are handled by custom hooks (built on `useMutation`) that manage loading states and provide feedback via `sonner` toasts.

```typescript
export function useCreateFeature(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (data: FeatureFormValues) => featureService.create(data),
    onSuccess: () => {
      toast.success("Berhasil!");
      queryClient.invalidateQueries({ queryKey: [FEATURE_ENDPOINTS.LIST] });
      options?.onSuccess?.();
    },
    onError: () => {
      toast.error("Gagal!");
    }
  });
  
  return { 
    createFeature: mutation.mutateAsync, 
    isLoading: mutation.isPending 
  };
}
```

---

## 9. Routing & Backend Tier Pattern

The application follows a structured routing pattern that separates concerns between different user contexts and system configuration.

### 9.1 URL Structure (Frontend)
Frontend routes are simplified for readability and do not include the `portal/` prefix in the URL:
- `/employee/*`: Routes for individual employee self-service (e.g., Dashboard, Leave Requests).
- `/management/*`: Routes for managers and HR administration (e.g., Approvals, Master Data).
- `/configuration/*`: Routes for system-wide configuration and IT setup (e.g., Approval Workflows).

### 9.2 API Endpoint Structure (Backend)
API endpoints follow a tiered architecture that must match the backend's module structure. These tiers are defined in each module's `endpoints/index.ts`:
- `/v1/{module}/portal/employee/*`: Endpoints for employee-facing features.
- `/v1/{module}/portal/management/*`: Endpoints for management-facing features.
- `/v1/{module}/config/*`: Endpoints for system configuration.

Example `endpoints/index.ts`:
```typescript
export const FEATURE_ENDPOINTS = {
  PORTAL: {
    EMPLOYEE: {
      LIST: '/v1/feature/portal/employee/list',
    },
    MANAGEMENT: {
      LIST: '/v1/feature/portal/management/list',
    }
  },
  CONFIG: {
    LIST: '/v1/feature/config/list',
  }
} as const;
```
