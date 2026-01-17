"use client";
import { StatsCards } from "./stats-cards";
import {
    useDashboardStats,
    useRevenueAnalytics,
    useRecentActivities,
    useTopProducts
} from "@/lib/react-query/hooks";
// import { RevenueChart } from "./revenue-chart";
// import { RecentActivity } from "./recent-activity";

export default function AdminDashboardPage() {
    // Use React Query hooks for all data fetching
    const { data: stats } = useDashboardStats();
    const { data: revenueData } = useRevenueAnalytics();
    const { data: activities = [] } = useRecentActivities(10);
    const { data: topProducts = [] } = useTopProducts(5);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
                <p className="text-gray-400">Monitor your perfume store performance</p>
            </div>

            {stats && (
                <StatsCards
                    stats={stats}
                    recentActivity={activities}
                    topProducts={topProducts}
                />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    {/* <RevenueChart data={revenueData} /> */}
                </div>
                <div>
                    {/* <RecentActivity activities={activities} /> */}
                </div>
            </div>
        </div>
    );
}

