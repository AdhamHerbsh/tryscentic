"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const tabs = [
        { name: "Hero Section", href: "/dashboard/settings/hero" },
        { name: "Content & Legal", href: "/dashboard/settings/content" },
        { name: "Social Links", href: "/dashboard/settings/socials" },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Site Settings</h1>
                <p className="text-gray-400">Manage your website's dynamic content and configuration.</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-700">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.href;
                        return (
                            <Link
                                key={tab.name}
                                href={tab.href}
                                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${isActive
                                        ? "border-amber-500 text-amber-500"
                                        : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
                                    }
                `}
                                aria-current={isActive ? "page" : undefined}
                            >
                                {tab.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
                {children}
            </div>
        </div>
    );
}
