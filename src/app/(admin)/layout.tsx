"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import AdminSidebar from "@/components/ui/Sidebars/AdminSidebar";
import SimpleLoader from "@/components/shared/SimpleLoader";
import { useUser } from "@/lib/context/UserContext";
import { queryClient } from "@/lib/react-query/query-client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, profile, isLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push("/login");
            } else if (profile?.role !== "admin") {
                router.push("/");
            }
        }
    }, [user, profile, isLoading, router]);

    if (isLoading || !user || profile?.role !== "admin") {
        return <SimpleLoader />;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <div className="flex h-screen">
                <AdminSidebar />
                <main className="flex-1 overflow-y-auto p-8">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
            {/* DevTools - only visible in development */}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
