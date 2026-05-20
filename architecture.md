# Project Architecture Documentation: HRMS Frontend

This document outlines the architectural patterns and best practices used in this project. The goal is to provide a clear blueprint that ensures consistency, scalability, and maintainability.

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
Define all API paths as constants. **Rules:**
- Always use a leading slash `/` for endpoint strings (e.g., `"/v1/..."`).
- Group by context: `PORTAL: { EMPLOYEE, MANAGEMENT }` and `CONFIG`.

```typescript
export const FEATURE_ENDPOINTS = {
  PORTAL: {
    MANAGEMENT: {
      LIST: "/v1/feature/portal/management/list",
      DETAIL: (id: string | number) => `/v1/feature/portal/management/detail/${id}`,
    }
  }
} as const;
```

### 3.2 Services (`services/`)
Handles the actual HTTP requests. Use a central `apiClient`.
- **Naming**: Always use `services/index.ts` to allow cleaner imports.
- **Methods**: Use standard method names like `getList`, `getDetail`, `create`, `update`, `delete`. Avoid entity-specific names like `getUsers` in favor of generic `getList`.

```typescript
export const featureService = {
  getList: async (params?: Record<string, any>) => {
    const response = await apiClient.get<PaginatedResponse<FeatureModel>>(FEATURE_ENDPOINTS.PORTAL.MANAGEMENT.LIST, { params });
    return response.data;
  },
};
```

### 3.3 Hooks (`hooks/`)
Use **TanStack Query** for data fetching and mutations.
- **Return Pattern**: List hooks must return `{ items, meta, isLoading, ... }`. Always use `items` as the key for the data array.
- **Query Key Safety**: Detail hooks must use the unique endpoint constant as the query key to avoid cache collisions with the list (e.g., `[FEATURE_ENDPOINTS.DETAIL(id)]`).
- **Mutation Placement**: Keep mutations (e.g., `useCreateFeature`) in the same file as the query hooks for that entity to keep the folder structure flat.

---

## 4. Page Assembly Pattern (`app/`)

Files in `app/` should be minimal. They act as "assemblers".

### Rules for `page.tsx`:
1. Use `'use client'` only if hooks or interactivity are needed.
2. Import domain logic from `@/modules`.
3. Import UI components from `@/components`.
4. Handle loading and error states locally using skeleton loaders and error components.
5. Move complex table column definitions to a separate `columns.tsx` file in the same directory.

---

## 5. UI & Styling Conventions

- **Tailwind CSS**: Use utility classes for all styling.
- **shadcn/ui**: Use and extend components from `@/components/ui`.
- **Icons**: Use `lucide-react` or `@hugeicons/react`.
- **Data Tables**: Use the custom `<DataTable />` and `<DataTablePagination />` components.
- **Skeleton Loaders**: Always provide a `<DataTableSkeleton />` or similar for loading states.

---

## 6. Best Practices

- **Debouncing**: Always debounce search inputs using the global `useDebounce` hook before passing them to fetching hooks.
- **Modal Logic**: Manage modal visibility state in the parent page component to prevent unnecessary re-renders in lists.
- **API Response Handling**: Standardize API responses using global wrappers to ensure consistency.
  - **Lists**: Use `PaginatedResponse<T>` which includes `data: T[]`, `meta`, and `links`.
  - **Single Items**: Use `ApiResponse<T>` which includes `data: T` and optional `message`.
- **Error Handling**: Use the `<PageError />` component for high-level errors to provide a consistent user experience.
- **Naming Consistency Check**:
    - Endpoints: Start with `/`.
    - Services: Inside `index.ts`.
    - Service Methods: `getList` (not `getUsers`).
    - Hook Returns: `items` (not `types` or `users`).
    - Detail QueryKeys: Must be unique (don't reuse list key).

---

## 7. Technology Stack

- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Data Fetching**: TanStack Query (React Query)
- **HTTP Client**: Axios (wrapped in `apiClient`)
- **Icons**: Hugeicons / Lucide React
- **State Management**: React Hooks + TanStack Query Cache

---

## 8. Form Field & Submission Pattern

This project uses a standardized approach for forms using **React Hook Form**, **Zod**, and custom UI components.

---

## 9. Routing & Backend Tier Pattern

The application follows a structured routing pattern that separates concerns between different user contexts and system configuration.

- `/employee/*`: Employee self-service.
- `/management/*`: Manager and HR administration.
- `/configuration/*`: System configuration.

---

## 10. Paginated Picker Pattern (Selected Value Hydration)

When using paginated or searchable pickers (Combobox), a common issue occurs when the selected value is not present in the current page of results (e.g., it's on page 5, or filtered out by search).

To resolve this, we follow the **Selected Value Hydration** pattern:

### 10.1 Principle
Separate the **paginated options** from the **selected value**.

1.  **Independent Fetching**: Always fetch the selected item by its ID using a dedicated "Detail" hook (e.g., `useEmployeeDetail`).
2.  **Options Merging**: Merge the independently fetched item into the paginated list to ensure the UI can always resolve the label.

### 10.2 Implementation
```tsx
const { items: paginatedItems, isLoading: isLoadingList } = useFeatureList({ search });
const { item: selectedItem, isLoading: isLoadingDetail } = useFeatureDetail(value);

const options = useMemo(() => {
  if (!selectedItem) return paginatedItems;
  const exists = paginatedItems.some((i) => i.id === selectedItem.id);
  return exists ? paginatedItems : [selectedItem, ...paginatedItems];
}, [paginatedItems, selectedItem]);

const isLoading = isLoadingList || isLoadingDetail;
```

This ensures:
-   The selected item is always visible with its correct label.
-   No "flickering" or placeholder text when the item is on a different page.
-   The picker remains lightweight by only fetching the list and the specific selected item.
