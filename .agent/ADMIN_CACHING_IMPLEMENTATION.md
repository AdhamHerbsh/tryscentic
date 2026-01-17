# Admin Dashboard Caching Implementation

## Overview

This document outlines the implementation of **TanStack Query (React Query)** for client-side data caching in the admin dashboard. This eliminates redundant API calls and provides instant page loads when navigating between admin routes.

## Problem Statement

Previously, every time an admin navigated from Page A to Page B and back to Page A, the application would trigger fresh network requests, causing:

- Unnecessary loading states
- Sluggish user experience
- Wasted API calls
- Poor perceived performance

## Solution

Implemented **TanStack Query** with a "stale-while-revalidate" strategy that:

- Stores data in a global cache that persists during the browser session
- Shows cached data instantly when returning to visited pages
- Refetches data in the background to ensure freshness
- Manages loading and error states automatically

## Architecture

### 1. Query Client Configuration

**Location:** `src/lib/react-query/query-client.ts`

```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Data fresh for 5 minutes
      gcTime: 10 * 60 * 1000, // Cache for 10 minutes
      refetchOnWindowFocus: true, // Update when tab regains focus
      retry: 1, // Retry failed requests once
      refetchOnMount: false, // Don't refetch if data is fresh
    },
  },
});
```

**Key Settings:**

- **staleTime (5 minutes):** Navigating back to a page within 5 minutes shows data instantly with 0ms loading
- **gcTime (10 minutes):** Unused data stays in memory for 10 minutes
- **refetchOnWindowFocus:** Ensures data stays current without manual refresh
- **refetchOnMount: false:** Prevents unnecessary refetches when data is still fresh

### 2. Custom Hooks Structure

**Location:** `src/lib/react-query/hooks/`

We created domain-specific hooks for each data category:

#### `use-dashboard.ts`

- `useDashboardStats()` - Overall dashboard statistics
- `useRevenueAnalytics()` - Revenue data over time
- `useRecentActivities(limit)` - Latest activity feed
- `useTopProducts(limit)` - Best-selling products

#### `use-orders.ts`

- `usePendingOrders()` - Orders awaiting verification
- `useActiveOrders()` - Active/shipped orders
- `useVerifyOrder()` - Mutation for approving/rejecting orders
- `useUpdateOrderStatus()` - Mutation for updating order status

#### `use-products.ts`

- `useProducts(filters)` - Product list with pagination & filters
- `useBrands()` - Brand list
- `useCategories()` - Category list
- `useDeleteProduct()` - Mutation for product deletion
- `useToggleProductStatus()` - Mutation for activating/deactivating products

#### `use-users.ts`

- `useUsers()` - All user profiles

### 3. Query Key Strategy

Each hook uses a well-structured query key hierarchy for intelligent cache management:

```typescript
// Dashboard keys
dashboardKeys = {
    all: ['dashboard'],
    stats: ['dashboard', 'stats'],
    revenue: ['dashboard', 'revenue'],
    activities: ['dashboard', 'activities', limit],
    topProducts: ['dashboard', 'topProducts', limit],
}

// Product keys
productKeys = {
    all: ['products'],
    lists: ['products', 'list'],
    list: ['products', 'list', { search, page, filters... }],
    brands: ['brands'],
    categories: ['categories'],
}
```

This structure enables:

- Granular cache invalidation (e.g., invalidate only product lists, not brands)
- Automatic refetching of related queries
- Filter/pagination state preservation

### 4. Mutations with Cache Invalidation

Mutations automatically update the cache after successful operations:

```typescript
export function useVerifyOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, action }) => verifyOrder(orderId, action),
    onSuccess: () => {
      // Invalidate both pending and active orders
      queryClient.invalidateQueries({ queryKey: orderKeys.pending() });
      queryClient.invalidateQueries({ queryKey: orderKeys.active() });
    },
  });
}
```

## Implementation Changes

### Pages Refactored

#### 1. **Dashboard Page** (`dashboard/page.tsx`)

**Before:** Server Component with parallel async data fetching
**After:** Client Component using React Query hooks

```tsx
export default function AdminDashboardPage() {
  const { data: stats } = useDashboardStats();
  const { data: activities = [] } = useRecentActivities(10);
  const { data: topProducts = [] } = useTopProducts(5);
  // ... render
}
```

#### 2. **Users Page** (`dashboard/users/page.tsx`)

**Before:** useEffect with manual state management
**After:** Simple React Query hook

```tsx
const { data: users = [], isLoading } = useUsers();
```

#### 3. **Orders Page** (`dashboard/orders/page.tsx`)

**Before:** Complex useEffect with tab-based data fetching
**After:** Conditional hook calls based on active tab

```tsx
const { data: pendingOrders = [], isLoading: pendingLoading } =
  usePendingOrders();
const { data: activeOrders = [], isLoading: activeLoading } = useActiveOrders();
const orders = activeTab === "pending" ? pendingOrders : activeOrders;
```

#### 4. **Products Page** (`dashboard/products/page.tsx`)

**Before:** Manual pagination, filtering, and parallel data loading
**After:** Single hook with filters as dependencies

```tsx
const { data: productsData, isLoading } = useProducts({
  search,
  page,
  limit: 10,
  ...filters,
});
```

### Layout Enhancement

**Location:** `src/app/(admin)/layout.tsx`

Added `QueryClientProvider` wrapper and DevTools:

```tsx
return (
  <QueryClientProvider client={queryClient}>
    {/* Admin content */}
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
```

## Benefits Achieved

### ✅ Performance

- **0ms loading time** when navigating back to visited pages within 5 minutes
- Data appears instantly from cache
- Background refetch ensures data stays fresh

### ✅ Network Efficiency

- Eliminated redundant API calls
- Smart refetching only when necessary
- Automatic retry logic for failed requests

### ✅ User Experience

- No loading spinners for cached data
- Smooth transitions between pages
- Up-to-date data without manual refresh

### ✅ Developer Experience

- Simplified data fetching code
- Automatic loading/error states
- Built-in DevTools for debugging
- Type-safe hooks with TypeScript

## Testing & Verification

### How to Verify It Works

1. **Open React Query DevTools**
   - Look for the floating icon in the bottom-right corner (development only)
   - Click to open the DevTools panel

2. **Navigate Through Admin Pages**
   - Visit Dashboard → Users → Products → Dashboard
   - Watch the Network tab - you'll see requests on first visit only

3. **Check Query Status**
   - In DevTools, observe query states: `fresh`, `stale`, `fetching`
   - Fresh queries show data instantly without refetching

4. **Test Background Refetch**
   - Switch to another browser tab for 10 seconds
   - Return to the admin dashboard
   - Watch DevTools - queries will refetch in the background

5. **Verify Cache Persistence**
   - Visit the orders page → switch to another admin page
   - Return to orders within 5 minutes
   - Data should appear instantly (0ms)

## Cache Management

### Manual Cache Invalidation

If you need to manually invalidate cache:

```typescript
import { queryClient } from "@/lib/react-query/query-client";

// Invalidate specific query
queryClient.invalidateQueries({ queryKey: ["orders", "pending"] });

// Invalidate all queries for a key
queryClient.invalidateQueries({ queryKey: ["products"] });

// Clear all cache
queryClient.clear();
```

### Optimistic Updates

For instant UI feedback, mutations can include optimistic updates:

```typescript
useMutation({
  onMutate: async (newData) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ["users"] });

    // Snapshot the previous value
    const previousUsers = queryClient.getQueryData(["users"]);

    // Optimistically update to the new value
    queryClient.setQueryData(["users"], (old) => [...old, newData]);

    // Return snapshot for rollback
    return { previousUsers };
  },
  onError: (err, newData, context) => {
    // Rollback on error
    queryClient.setQueryData(["users"], context.previousUsers);
  },
});
```

## Future Enhancements

1. **Prefetching**
   - Prefetch next page when user is viewing paginated data
   - Prefetch related data on hover

2. **Optimistic Updates**
   - Implement for all mutations
   - Provide instant feedback before server response

3. **Infinite Query**
   - Replace pagination with infinite scroll
   - Better UX for long lists

4. **Query Cancellation**
   - Cancel ongoing queries when navigating away
   - Prevent race conditions

## Troubleshooting

### Data Not Updating After Mutation

**Solution:** Ensure mutation calls `invalidateQueries` with correct query key

### Cache Not Persisting

**Check:** `gcTime` and `staleTime` values in query client config

### Too Many Network Requests

**Adjust:** Increase `staleTime` for that specific query

### DevTools Not Showing

**Note:** DevTools only appear in development mode (`npm run dev`)

## References

- [TanStack Query Documentation](https://tanstack.com/query/latest/docs/react/overview)
- [Query Keys Best Practices](https://tkdodo.eu/blog/effective-react-query-keys)
- [Mutations & Optimistic Updates](https://tanstack.com/query/latest/docs/react/guides/optimistic-updates)
