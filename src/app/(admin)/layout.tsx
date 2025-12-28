"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/utils/supabase/client";
import AdminSidebar from "@/components/ui/Sidebars/AdminSidebar";
import SimpleLoader from "@/components/shared/SimpleLoader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const checkAdmin = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                router.push("/login");
                return;
            }

            // Check profile role
            const { data: profile, error } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", user.id)
                .single();

            if (error || profile?.role !== "admin") {
                router.push("/"); // Not authorized
                return;
            }

            setLoading(false);
        };

        checkAdmin();
    }, [router, supabase]);

    if (loading) {
        return <SimpleLoader />;
    }

    return (
        <div className="flex h-screen">
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
