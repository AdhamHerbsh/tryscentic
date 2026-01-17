"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, LayoutDashboard, PackagePlus, LogOut, LockKeyhole, Users, ShieldQuestionMark, Banknote, ShoppingBag, Ticket, Gift, Settings } from "lucide-react";
import { useUser } from "@/lib/context/UserContext";
import { toast } from "sonner";

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { signOut } = useUser();

    const handleLogout = async () => {
        await signOut();
        toast.success("Logged out successfully");
        router.push("/login");
    };

    const navItems = [
        {
            name: "Dashboard",
            href: "/dashboard",
            icon: <LayoutDashboard size={20} />,
        },
        {
            name: "Transactions",
            href: "/dashboard/transactions",
            icon: <Banknote size={20} />,
        },
        {
            name: "Orders",
            href: "/dashboard/orders",
            icon: <ShoppingBag size={20} />,
        },
        {
            name: "Promo Codes",
            href: "/dashboard/promo-codes",
            icon: <Ticket size={20} />,
        },
        {
            name: "Gifts",
            href: "/dashboard/gifts",
            icon: <Gift size={20} />,
        },
        {
            name: "Products",
            href: "/dashboard/products",
            icon: <PackagePlus size={20} />,
        },
        {
            name: "Brands",
            href: "/dashboard/brands",
            icon: <ShieldQuestionMark size={20} />,
        },
        {
            name: "Users",
            href: "/dashboard/users",
            icon: <Users size={20} />,
        },
        {
            name: "Settings",
            href: "/dashboard/settings/hero", // Default to hero
            icon: <Settings size={20} />,
        },
    ];

    return (
        <aside className="w-75 text-white min-h-screen flex flex-col bg-linear-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-br-3xl rounded-tr-3xl p-6">

            <div className="flex gap-4 p-6 border-b border-gray-800 text-secondary">
                <LockKeyhole size={32} />
                <h2 className="text-2xl font-bold tracking-wider">ADMIN</h2>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            prefetch={false}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? "bg-amber-600 text-white"
                                : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                }`}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-800 gap-4">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-4 py-3 w-full text-left text-green-400 hover:bg-green-500/20 rounded-lg transition-colors"
                >
                    <Home size={20} />
                    <span>Home</span>
                </Link>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
