"use client";

import React, { useState } from 'react';
import {
    DollarSign, ShoppingCart, Users, Package, AlertTriangle, Clock,
    TrendingUp, TrendingDown, Activity, CreditCard, ShoppingBag,
    CheckCircle, Calendar, XCircle, PieChart, MessageSquare
} from 'lucide-react';
import type { DashboardStats } from "@/types/database";

interface RecentActivity {
    id: string;
    type: 'order' | 'transaction' | 'user' | 'review' | 'product';
    description: string;
    timestamp: Date;
    status?: string;
    amount?: number;
}

interface TopProduct {
    id: string;
    name: string;
    sales: number;
    revenue: number;
    stock?: number;
}

interface StatsCardsProps {
    stats: DashboardStats;
    recentActivity: RecentActivity[];
    topProducts: TopProduct[];
}

const StatCard = ({ title, value, subtitle, icon: Icon, color, bgColor, trend, alert }: any) => (
    <div className={`bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-5 hover:border-${color}-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-${color}-500/10`}>
        <div className="flex items-start justify-between mb-3">
            <div className={`${bgColor} ${color} p-3 rounded-lg`}>
                <Icon className="w-5 h-5" />
            </div>
            {trend && (
                <div className={`flex items-center gap-1 text-sm ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span>{Math.abs(trend)}%</span>
                </div>
            )}
        </div>
        <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-white mb-1">{value}</p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        {alert && (
            <div className="mt-3 px-2 py-1 bg-amber-500/10 border border-amber-500/30 rounded text-xs text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Requires attention
            </div>
        )}
    </div>
);

const OverviewTab = ({ stats, recentActivity, topProducts }: StatsCardsProps) => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                title="Today's Revenue"
                value={`LE ${stats.todayRevenue.toLocaleString()}`}
                subtitle={`${stats.todayOrders} orders today`}
                icon={DollarSign}
                color="text-green-500"
                bgColor="bg-green-500/10"
            />
            <StatCard
                title="Pending Orders"
                value={stats.pendingOrders}
                subtitle="Requires processing"
                icon={Clock}
                color="text-yellow-500"
                bgColor="bg-yellow-500/10"
                alert={stats.pendingOrders > 20}
            />
            <StatCard
                title="Pending Deposits"
                value={`LE ${stats.pendingDeposits.toLocaleString()}`}
                subtitle={`${stats.pendingTransactions} requests`}
                icon={CreditCard}
                color="text-blue-500"
                bgColor="bg-blue-500/10"
                alert={stats.pendingTransactions > 10}
            />
            <StatCard
                title="Low Stock Alert"
                value={stats.lowStockProducts}
                subtitle={`${stats.outOfStockProducts} out of stock`}
                icon={AlertTriangle}
                color="text-red-500"
                bgColor="bg-red-500/10"
                alert={stats.lowStockProducts > 10}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
                title="Total Revenue"
                value={`LE ${stats.totalRevenue.toLocaleString()}`}
                subtitle={`Month: LE ${stats.monthRevenue.toLocaleString()}`}
                icon={DollarSign}
                color="text-emerald-500"
                bgColor="bg-emerald-500/10"
            />
            <StatCard
                title="Total Orders"
                value={stats.totalOrders.toLocaleString()}
                subtitle={`${stats.deliveredOrders} delivered`}
                icon={ShoppingCart}
                color="text-blue-500"
                bgColor="bg-blue-500/10"
            />
            <StatCard
                title="Active Users"
                value={stats.activeUsers.toLocaleString()}
                subtitle={`${stats.newUsersToday} new today`}
                icon={Users}
                color="text-purple-500"
                bgColor="bg-purple-500/10"
            />
            <StatCard
                title="Total Products"
                value={stats.totalProducts}
                subtitle={`${stats.activeProducts} active`}
                icon={Package}
                color="text-indigo-500"
                bgColor="bg-indigo-500/10"
            />
            <StatCard
                title="Wallet Balance"
                value={`LE ${stats.totalWalletBalance.toLocaleString()}`}
                subtitle="Total user wallets"
                icon={CreditCard}
                color="text-cyan-500"
                bgColor="bg-cyan-500/10"
            />
            <StatCard
                title="Avg Rating"
                value={stats.avgRating.toFixed(1)}
                subtitle={`${stats.totalReviews} reviews`}
                icon={MessageSquare}
                color="text-amber-500"
                bgColor="bg-amber-500/10"
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-400" />
                        Recent Activity
                    </h3>
                </div>
                <div className="space-y-3">
                    {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
                            <div className={`p-2 rounded-lg ${activity.type === 'order' ? 'bg-blue-500/10 text-blue-400' :
                                activity.type === 'transaction' ? 'bg-green-500/10 text-green-400' :
                                    activity.type === 'user' ? 'bg-purple-500/10 text-purple-400' :
                                        'bg-amber-500/10 text-amber-400'
                                }`}>
                                {activity.type === 'order' && <ShoppingCart className="w-4 h-4" />}
                                {activity.type === 'transaction' && <CreditCard className="w-4 h-4" />}
                                {activity.type === 'user' && <Users className="w-4 h-4" />}
                                {activity.type === 'review' && <MessageSquare className="w-4 h-4" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-white">{activity.description}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <p className="text-xs text-gray-500">
                                        {new Date(activity.timestamp).toLocaleTimeString()}
                                    </p>
                                    {activity.amount && (
                                        <span className="text-xs text-green-400">LE {activity.amount}</span>
                                    )}
                                </div>
                            </div>
                            {activity.status && (
                                <span className={`text-xs px-2 py-1 rounded-full ${activity.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                                    activity.status === 'shipped' ? 'bg-blue-500/10 text-blue-400' :
                                        'bg-green-500/10 text-green-400'
                                    }`}>
                                    {activity.status}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                        Top Products
                    </h3>
                </div>
                <div className="space-y-3">
                    {topProducts.map((product, index) => (
                        <div key={product.id} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{product.name}</p>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-xs text-gray-500">{product.sales} sales</span>
                                    <span className="text-xs text-emerald-400">LE {product.revenue.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const OrdersTab = ({ stats }: { stats: DashboardStats }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
            title="Pending Orders"
            value={stats.pendingOrders}
            subtitle="Awaiting processing"
            icon={Clock}
            color="text-yellow-500"
            bgColor="bg-yellow-500/10"
        />
        <StatCard
            title="Shipped Orders"
            value={stats.shippedOrders}
            subtitle="In transit"
            icon={ShoppingBag}
            color="text-blue-500"
            bgColor="bg-blue-500/10"
        />
        <StatCard
            title="Delivered Orders"
            value={stats.deliveredOrders}
            subtitle="Completed"
            icon={CheckCircle}
            color="text-green-500"
            bgColor="bg-green-500/10"
        />
        <StatCard
            title="Cancelled Orders"
            value={stats.cancelledOrders}
            subtitle="Refunded/Cancelled"
            icon={XCircle}
            color="text-red-500"
            bgColor="bg-red-500/10"
        />
    </div>
);

const UsersTab = ({ stats }: { stats: DashboardStats }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            subtitle="All registered users"
            icon={Users}
            color="text-purple-500"
            bgColor="bg-purple-500/10"
        />
        <StatCard
            title="Active Users"
            value={stats.activeUsers.toLocaleString()}
            subtitle="Not banned"
            icon={CheckCircle}
            color="text-green-500"
            bgColor="bg-green-500/10"
        />
        <StatCard
            title="New This Week"
            value={stats.newUsersWeek}
            subtitle={`${stats.newUsersToday} today`}
            icon={TrendingUp}
            color="text-blue-500"
            bgColor="bg-blue-500/10"
        />
        <StatCard
            title="Banned Users"
            value={stats.bannedUsers}
            subtitle="Restricted accounts"
            icon={XCircle}
            color="text-red-500"
            bgColor="bg-red-500/10"
        />
    </div>
);

const InventoryTab = ({ stats }: { stats: DashboardStats }) => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                title="Total Products"
                value={stats.totalProducts}
                subtitle={`${stats.totalVariants} variants`}
                icon={Package}
                color="text-indigo-500"
                bgColor="bg-indigo-500/10"
            />
            <StatCard
                title="Active Products"
                value={stats.activeProducts}
                subtitle="Currently listed"
                icon={CheckCircle}
                color="text-green-500"
                bgColor="bg-green-500/10"
            />
            <StatCard
                title="Low Stock"
                value={stats.lowStockProducts}
                subtitle="Need restock soon"
                icon={AlertTriangle}
                color="text-amber-500"
                bgColor="bg-amber-500/10"
                alert={stats.lowStockProducts > 10}
            />
            <StatCard
                title="Out of Stock"
                value={stats.outOfStockProducts}
                subtitle="Unavailable items"
                icon={XCircle}
                color="text-red-500"
                bgColor="bg-red-500/10"
                alert={stats.outOfStockProducts > 5}
            />
        </div>
    </div>
);

const FinanceTab = ({ stats }: { stats: DashboardStats }) => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
                title="Total Revenue"
                value={`LE ${stats.totalRevenue.toLocaleString()}`}
                subtitle="All time"
                icon={DollarSign}
                color="text-emerald-500"
                bgColor="bg-emerald-500/10"
            />
            <StatCard
                title="Month Revenue"
                value={`LE ${stats.monthRevenue.toLocaleString()}`}
                subtitle="Current month"
                icon={TrendingUp}
                color="text-green-500"
                bgColor="bg-green-500/10"
            />
            <StatCard
                title="Week Revenue"
                value={`LE ${stats.weekRevenue.toLocaleString()}`}
                subtitle="Last 7 days"
                icon={Calendar}
                color="text-blue-500"
                bgColor="bg-blue-500/10"
            />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                title="Pending Deposits"
                value={`LE ${stats.pendingDeposits.toLocaleString()}`}
                subtitle={`${stats.pendingTransactions} requests`}
                icon={Clock}
                color="text-yellow-500"
                bgColor="bg-yellow-500/10"
                alert={stats.pendingTransactions > 10}
            />
            <StatCard
                title="Confirmed"
                value={stats.confirmedTransactions}
                subtitle="Approved transactions"
                icon={CheckCircle}
                color="text-green-500"
                bgColor="bg-green-500/10"
            />
            <StatCard
                title="Rejected"
                value={stats.rejectedTransactions}
                subtitle="Declined transactions"
                icon={XCircle}
                color="text-red-500"
                bgColor="bg-red-500/10"
            />
            <StatCard
                title="User Wallets"
                value={`LE ${stats.totalWalletBalance.toLocaleString()}`}
                subtitle="Total balance"
                icon={CreditCard}
                color="text-cyan-500"
                bgColor="bg-cyan-500/10"
            />
        </div>
    </div>
);

export function StatsCards({ stats, recentActivity, topProducts }: StatsCardsProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'users' | 'inventory' | 'finance'>('overview');

    return (
        <div className="min-h-screen">
            <div className="flex flex-wrap gap-2 mb-6 bg-gray-900/50 p-2 rounded-xl border border-gray-800">
                {[
                    { id: 'overview', label: 'Overview', icon: PieChart },
                    { id: 'orders', label: 'Orders', icon: ShoppingCart },
                    { id: 'users', label: 'Users', icon: Users },
                    { id: 'inventory', label: 'Inventory', icon: Package },
                    { id: 'finance', label: 'Finance', icon: DollarSign },
                ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === tab.id
                                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
                                : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {activeTab === 'overview' && <OverviewTab stats={stats} recentActivity={recentActivity} topProducts={topProducts} />}
            {activeTab === 'orders' && <OrdersTab stats={stats} />}
            {activeTab === 'users' && <UsersTab stats={stats} />}
            {activeTab === 'inventory' && <InventoryTab stats={stats} />}
            {activeTab === 'finance' && <FinanceTab stats={stats} />}
        </div>
    );
}