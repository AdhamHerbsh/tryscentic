"use client";

import type { DashboardStats } from "@/types/database";
import { DollarSign, ShoppingCart, Users, Package, AlertTriangle, Clock } from "lucide-react";

interface StatsCardsProps {
    stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
    const cards = [
        {
            title: "Total Revenue",
            value: `LE ${stats.totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: "text-green-500",
            bgColor: "bg-green-500/10",
        },
        {
            title: "Total Orders",
            value: stats.totalOrders,
            icon: ShoppingCart,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
        },
        {
            title: "Pending Orders",
            value: stats.pendingOrders,
            icon: Clock,
            color: "text-yellow-500",
            bgColor: "bg-yellow-500/10",
            alert: stats.pendingOrders > 0,
        },
        {
            title: "Total Users",
            value: stats.totalUsers,
            icon: Users,
            color: "text-purple-500",
            bgColor: "bg-purple-500/10",
        },
        {
            title: "Total Products",
            value: stats.totalProducts,
            icon: Package,
            color: "text-indigo-500",
            bgColor: "bg-indigo-500/10",
        },
        {
            title: "Low Stock Alert",
            value: stats.lowStockProducts,
            icon: AlertTriangle,
            color: "text-red-500",
            bgColor: "bg-red-500/10",
            alert: stats.lowStockProducts > 0,
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => {
                const Icon = card.icon;
                return (
                    <div
                        key={card.title}
                        className="admin-card group bg-black/20 shadow border py-1 px-2 rounded-lg hover:scale-105 transition-transform duration-200"
                    >
                        <div className="flex items-start justify-between">
                            <div className={`${card.bgColor} ${card.color} py-2 px-4 rounded-lg`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-200 mb-1">{card.title}</p>
                                <p className="text-3xl font-bold text-white">{card.value}</p>
                            </div>
                        </div>
                        {card.alert && (
                            <div className="mt-3 px-2 py-1 bg-amber-500/20 border border-amber-500/50 rounded text-xs text-amber-400">
                                Requires attention
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
