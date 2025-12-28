"use client";

import { useMemo } from "react";

interface RevenueDataPoint {
    date: string;
    revenue: number;
    orders: number;
}

interface RevenueChartProps {
    data: RevenueDataPoint[];
}

export function RevenueChart({ data }: RevenueChartProps) {
    const maxRevenue = useMemo(() => {
        return Math.max(...data.map(d => d.revenue), 1);
    }, [data]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-1">Revenue Analytics</h2>
                <p className="text-gray-400 text-sm">Daily revenue and order trends</p>
            </div>

            {data.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-gray-400">
                    No revenue data available
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Chart */}
                    <div className="relative h-64">
                        <div className="absolute inset-0 flex items-end justify-between gap-2">
                            {data.map((point, index) => {
                                const heightPercentage = (point.revenue / maxRevenue) * 100;

                                return (
                                    <div
                                        key={index}
                                        className="flex-1 flex flex-col items-center group"
                                    >
                                        {/* Tooltip */}
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-2 bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-lg absolute bottom-full">
                                            <p className="text-xs text-gray-400 mb-1">{formatDate(point.date)}</p>
                                            <p className="text-sm font-semibold text-white">{formatCurrency(point.revenue)}</p>
                                            <p className="text-xs text-gray-400">{point.orders} orders</p>
                                        </div>

                                        {/* Bar */}
                                        <div
                                            className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg transition-all duration-300 hover:from-purple-500 hover:to-purple-300 cursor-pointer"
                                            style={{
                                                height: `${Math.max(heightPercentage, 2)}%`,
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* X-axis labels */}
                    <div className="flex items-center justify-between gap-2">
                        {data.map((point, index) => (
                            <div key={index} className="flex-1 text-center">
                                <p className="text-xs text-gray-400">{formatDate(point.date)}</p>
                            </div>
                        ))}
                    </div>

                    {/* Summary stats */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
                        <div>
                            <p className="text-xs text-gray-400 mb-1">Total Revenue</p>
                            <p className="text-lg font-semibold text-white">
                                {formatCurrency(data.reduce((sum, d) => sum + d.revenue, 0))}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 mb-1">Total Orders</p>
                            <p className="text-lg font-semibold text-white">
                                {data.reduce((sum, d) => sum + d.orders, 0)}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 mb-1">Avg. Order Value</p>
                            <p className="text-lg font-semibold text-white">
                                {formatCurrency(
                                    data.reduce((sum, d) => sum + d.revenue, 0) /
                                    Math.max(data.reduce((sum, d) => sum + d.orders, 0), 1)
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
