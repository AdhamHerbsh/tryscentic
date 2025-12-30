import { getDashboardStats, getRevenueAnalytics, getRecentActivities, getTopProducts } from "@/data-access/admin/dashboard";
import { StatsCards } from "./stats-cards";
// import { RevenueChart } from "./revenue-chart";
// import { RecentActivity } from "./recent-activity";

export default async function AdminDashboardPage() {
    const [stats, revenueData, activities, topProducts] = await Promise.all([
        getDashboardStats(),
        getRevenueAnalytics(),
        getRecentActivities(10),
        getTopProducts(5),
    ]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
                <p className="text-gray-400">Monitor your perfume store performance</p>
            </div>

            <StatsCards
                stats={stats}
                recentActivity={activities}
                topProducts={topProducts}
            />

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

