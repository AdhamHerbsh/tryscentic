import { useQuery } from "@tanstack/react-query";
import {
  getDashboardStats,
  getRevenueAnalytics,
  getRecentActivities,
  getTopProducts,
} from "@/data-access/admin/dashboard";

// Query Keys
export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const,
  revenue: () => [...dashboardKeys.all, "revenue"] as const,
  activities: (limit: number) =>
    [...dashboardKeys.all, "activities", limit] as const,
  topProducts: (limit: number) =>
    [...dashboardKeys.all, "topProducts", limit] as const,
};

// Hooks
export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: getDashboardStats,
  });
}

export function useRevenueAnalytics() {
  return useQuery({
    queryKey: dashboardKeys.revenue(),
    queryFn: getRevenueAnalytics,
  });
}

export function useRecentActivities(limit: number = 10) {
  return useQuery({
    queryKey: dashboardKeys.activities(limit),
    queryFn: () => getRecentActivities(limit),
  });
}

export function useTopProducts(limit: number = 5) {
  return useQuery({
    queryKey: dashboardKeys.topProducts(limit),
    queryFn: () => getTopProducts(limit),
  });
}
