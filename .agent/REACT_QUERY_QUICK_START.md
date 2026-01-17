# Quick Start: Adding React Query to New Admin Pages

This guide shows you how to add React Query caching to any new admin page.

## Step 1: Create Custom Hook

Create a new file in `src/lib/react-query/hooks/` for your data domain.

### Example: Adding a "Reports" page

**File:** `src/lib/react-query/hooks/use-reports.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getReports, generateReport } from "@/data-access/admin/reports";
import { toast } from "sonner";

// 1. Define Query Keys (hierarchical structure)
export const reportKeys = {
  all: ["reports"] as const,
  lists: () => [...reportKeys.all, "list"] as const,
  list: (filters: any) => [...reportKeys.lists(), filters] as const,
  detail: (id: string) => [...reportKeys.all, "detail", id] as const,
};

// 2. Create Query Hook
export function useReports(filters: { type?: string; dateRange?: string }) {
  return useQuery({
    queryKey: reportKeys.list(filters),
    queryFn: () => getReports(filters),
    // Optional: Override default config
    staleTime: 2 * 60 * 1000, // 2 minutes for reports
  });
}

// 3. Create Mutation Hook
export function useGenerateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reportConfig: any) => generateReport(reportConfig),
    onSuccess: () => {
      toast.success("Report generated successfully");
      // Invalidate reports list to refetch
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
    },
    onError: () => {
      toast.error("Failed to generate report");
    },
  });
}
```

## Step 2: Export Hook

Add to `src/lib/react-query/hooks/index.ts`:

```typescript
export * from "./use-reports";
```

## Step 3: Use in Page Component

**File:** `src/app/(admin)/dashboard/reports/page.tsx`

```typescript
"use client";
import { useState } from 'react';
import { useReports, useGenerateReport } from '@/lib/react-query/hooks';

export default function ReportsPage() {
    const [filters, setFilters] = useState({ type: 'sales', dateRange: 'month' });

    // Use the query hook
    const { data: reports = [], isLoading, error } = useReports(filters);

    // Use the mutation hook
    const generateMutation = useGenerateReport();

    const handleGenerate = () => {
        generateMutation.mutate({ type: 'sales', format: 'pdf' });
    };

    return (
        <div>
            <h1>Reports</h1>

            {isLoading && <div>Loading...</div>}
            {error && <div>Error loading reports</div>}

            <button onClick={handleGenerate} disabled={generateMutation.isPending}>
                {generateMutation.isPending ? 'Generating...' : 'Generate Report'}
            </button>

            <ul>
                {reports.map(report => (
                    <li key={report.id}>{report.title}</li>
                ))}
            </ul>
        </div>
    );
}
```

## Common Patterns

### Pattern 1: List with Filters

```typescript
export function useProducts(filters: { search?: string; page?: number }) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => getProducts(filters),
    // Filters are part of the key, so different filters = different cache
  });
}
```

### Pattern 2: Detail View

```typescript
export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => getProduct(id),
    enabled: !!id, // Only run if ID exists
  });
}
```

### Pattern 3: Mutation with Optimistic Update

```typescript
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string; updates: any }) =>
      updateProduct(data.id, data.updates),

    // Optimistic update (instant UI)
    onMutate: async ({ id, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: productKeys.detail(id) });

      // Snapshot current value
      const previous = queryClient.getQueryData(productKeys.detail(id));

      // Optimistically update
      queryClient.setQueryData(productKeys.detail(id), (old: any) => ({
        ...old,
        ...updates,
      }));

      return { previous };
    },

    // Rollback on error
    onError: (err, { id }, context) => {
      queryClient.setQueryData(productKeys.detail(id), context?.previous);
      toast.error("Failed to update");
    },

    // Always refetch after success or error
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
    },
  });
}
```

### Pattern 4: Dependent Queries

```typescript
export function useProductWithBrand(productId: string) {
  // First query
  const { data: product } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProduct(productId),
  });

  // Second query depends on first
  const { data: brand } = useQuery({
    queryKey: ["brand", product?.brand_id],
    queryFn: () => getBrand(product!.brand_id),
    enabled: !!product?.brand_id, // Only run when we have brand_id
  });

  return { product, brand };
}
```

### Pattern 5: Pagination

```typescript
export function useProducts(page: number, pageSize: number = 10) {
  return useQuery({
    queryKey: ["products", { page, pageSize }],
    queryFn: () => getProducts({ page, limit: pageSize }),
    keepPreviousData: true, // Keep old data while new is loading
  });
}
```

### Pattern 6: Infinite Scroll

```typescript
export function useInfiniteProducts() {
  return useInfiniteQuery({
    queryKey: ["products", "infinite"],
    queryFn: ({ pageParam = 1 }) => getProducts({ page: pageParam }),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length + 1 : undefined;
    },
  });
}

// In component:
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
  useInfiniteProducts();
```

## Query Key Best Practices

### Hierarchical Structure

```typescript
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: any) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};
```

### Why This Structure?

```typescript
// Invalidate ALL product queries
queryClient.invalidateQueries({ queryKey: productKeys.all });

// Invalidate ALL product lists (but not details)
queryClient.invalidateQueries({ queryKey: productKeys.lists() });

// Invalidate specific filtered list
queryClient.invalidateQueries({
  queryKey: productKeys.list({ status: "active" }),
});

// Invalidate specific detail
queryClient.invalidateQueries({ queryKey: productKeys.detail("123") });
```

## Configuration Options

### Query Options

```typescript
useQuery({
  queryKey: ["data"],
  queryFn: fetchData,

  // Caching
  staleTime: 5 * 60 * 1000, // Fresh for 5 min
  gcTime: 10 * 60 * 1000, // Cache for 10 min

  // Refetching
  refetchOnMount: false, // Don't refetch on mount if fresh
  refetchOnWindowFocus: true, // Refetch when tab gains focus
  refetchOnReconnect: true, // Refetch when reconnecting
  refetchInterval: false, // Poll every X ms (or false)

  // Retries
  retry: 1, // Retry failed requests 1 time
  retryDelay: 1000, // Wait 1s between retries

  // Conditional
  enabled: !!userId, // Only run if condition is true

  // Callbacks
  onSuccess: (data) => {},
  onError: (error) => {},
  onSettled: (data, error) => {},
});
```

### Mutation Options

```typescript
useMutation({
  mutationFn: updateData,

  // Lifecycle
  onMutate: async (variables) => {
    // Before mutation runs
    // Great for optimistic updates
  },
  onSuccess: (data, variables, context) => {
    // After successful mutation
  },
  onError: (error, variables, context) => {
    // After failed mutation
  },
  onSettled: (data, error, variables, context) => {
    // Always runs after mutation
  },

  // Retries
  retry: 3,
});
```

## Debugging with DevTools

### Access DevTools

- Look for floating icon in bottom-right (development only)
- Click to expand panel

### What to Look For

- **Query Status:**
  - 🟢 Green = Fresh (no refetch needed)
  - 🟡 Yellow = Stale (refetching in background)
  - ⚪ Gray = Inactive (not mounted)
  - 🔴 Red = Error

- **Actions:**
  - Click query to see details
  - Click "Refetch" to manually trigger refetch
  - Click "Invalidate" to mark as stale
  - Click "Reset" to clear from cache

## Common Issues & Solutions

### ❌ Query Not Updating After Mutation

**Problem:** Data doesn't refresh after update
**Solution:** Invalidate related queries in `onSuccess`

```typescript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ["products"] });
};
```

### ❌ Too Many Network Requests

**Problem:** Data refetches too often
**Solution:** Increase `staleTime`

```typescript
useQuery({
  queryKey: ["data"],
  queryFn: fetchData,
  staleTime: 10 * 60 * 1000, // 10 minutes
});
```

### ❌ Stale Data Showing

**Problem:** Old data appears even after update
**Solution:** Lower `staleTime` or add manual invalidation

```typescript
queryClient.invalidateQueries({ queryKey: ["data"] });
```

### ❌ Query Runs When It Shouldn't

**Problem:** Query executes before data is ready
**Solution:** Use `enabled` option

```typescript
useQuery({
  queryKey: ["user", userId],
  queryFn: () => getUser(userId),
  enabled: !!userId, // Only run when userId exists
});
```

## Checklist for New Page

- [ ] Create custom hook in `src/lib/react-query/hooks/`
- [ ] Define query keys with hierarchical structure
- [ ] Export from `hooks/index.ts`
- [ ] Use hook in page component
- [ ] Add loading and error states
- [ ] For mutations: invalidate related queries
- [ ] Test with DevTools
- [ ] Verify cache behavior (navigate away and back)

---

**Pro Tip:** When in doubt, check existing hooks (`use-orders.ts`, `use-products.ts`) for reference!
