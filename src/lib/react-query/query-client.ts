import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Keep unused data in cache for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Refetch data when window regains focus
      refetchOnWindowFocus: true,
      // Retry failed requests
      retry: 1,
      // Don't refetch on mount if data is fresh
      refetchOnMount: false,
    },
  },
});
