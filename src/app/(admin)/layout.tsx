"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/utils/supabase/client";
import AdminSidebar from "@/components/ui/Sidebars/AdminSidebar";
import SimpleLoader from "@/components/shared/SimpleLoader";
import { useUser } from "@/lib/context/UserContext";

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
        <div className="flex h-screen">
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto p-8">
                <div className="mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
