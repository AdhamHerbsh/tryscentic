'use client';

interface Activity {
    id: string;
    type: 'order' | 'user' | 'product' | 'wallet';
    description: string;
    timestamp: string;
    metadata?: {
        amount?: number;
        user_email?: string;
        product_name?: string;
    };
}

interface RecentActivityProps {
    activities: Activity[];
}

const activityIcons = {
    order: "🛍️",
    user: "👤",
    product: "📦",
    wallet: "💰",
};

const activityColors = {
    order: "text-green-400 bg-green-400/10",
    user: "text-blue-400 bg-blue-400/10",
    product: "text-purple-400 bg-purple-400/10",
    wallet: "text-yellow-400 bg-yellow-400/10",
};

export function RecentActivity({ activities }: RecentActivityProps) {
    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 h-full">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-1">Recent Activity</h2>
                <p className="text-gray-400 text-sm">Latest updates from your store</p>
            </div>

            {activities.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-gray-400">
                    No recent activity
                </div>
            ) : (
                <div className="space-y-4">
                    {activities.map((activity) => (
                        <div
                            key={activity.id}
                            className="flex items-start gap-4 p-4 rounded-lg bg-gray-900/50 border border-gray-700/50 hover:border-gray-600 transition-colors duration-200"
                        >
                            {/* Icon */}
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${activityColors[activity.type]}`}>
                                <span className="text-lg">{activityIcons[activity.type]}</span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-white mb-1 leading-relaxed">
                                    {activity.description}
                                </p>

                                {/* Metadata */}
                                {activity.metadata && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {activity.metadata.amount !== undefined && (
                                            <span className="text-xs px-2 py-1 rounded-full bg-green-400/10 text-green-400">
                                                {formatCurrency(activity.metadata.amount)}
                                            </span>
                                        )}
                                        {activity.metadata.user_email && (
                                            <span className="text-xs px-2 py-1 rounded-full bg-blue-400/10 text-blue-400">
                                                {activity.metadata.user_email}
                                            </span>
                                        )}
                                        {activity.metadata.product_name && (
                                            <span className="text-xs px-2 py-1 rounded-full bg-purple-400/10 text-purple-400">
                                                {activity.metadata.product_name}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Timestamp */}
                                <p className="text-xs text-gray-500 mt-2">
                                    {formatTimestamp(activity.timestamp)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activities.length > 0 && (
                <div className="mt-6 text-center">
                    <button className="text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200">
                        View all activity →
                    </button>
                </div>
            )}
        </div>
    );
}
