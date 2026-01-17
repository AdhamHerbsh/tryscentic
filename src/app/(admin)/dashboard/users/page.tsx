"use client";
import { useState } from "react";
import { createClient } from "@/lib/utils/supabase/client";
import { toast } from "sonner";
import { Search, Shield, User as UserIcon, Wallet, MessageCircle } from "lucide-react";
import { useUsers } from "@/lib/react-query/hooks";

interface UserProfile {
    id: string;
    email: string;
    full_name: string;
    phone?: string;
    role: "user" | "admin";
    wallet_balance: number;
    created_at: string;
}

export default function UserManagementPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const supabase = createClient();

    // Use React Query hook for data fetching
    const { data: users = [], isLoading } = useUsers();

    const toggleRole = async (userId: string, currentRole: string) => {
        const newRole = currentRole === "admin" ? "user" : "admin";

        try {
            const { error } = await supabase
                .from("profiles")
                .update({ role: newRole })
                .eq("id", userId);

            if (error) throw error;
            toast.success(`User role updated to ${newRole}`);

            // The mutation will automatically refetch the data
        } catch {
            toast.error("Failed to update role");
        }
    };

    const filteredUsers = users.filter(user =>
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div className="">
                    <h1 className="text-3xl font-bold text-gray-200">User Management</h1>
                    <p className="text-gray-400 mt-1">Manage user roles and permissions</p>
                </div>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-800">User</th>
                                <th className="px-6 py-4 font-semibold text-gray-800">Role</th>
                                <th className="px-6 py-4 font-semibold text-gray-800">Wallet</th>
                                <th className="px-6 py-4 font-semibold text-gray-800">Joined</th>
                                <th className="px-6 py-4 font-semibold text-gray-800 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No users found matching &quot;{searchTerm}&quot;
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                                    <UserIcon size={16} />
                                                </div>
                                                <div className="text-gray-800">
                                                    <p className="font-medium">{user.full_name || "Unnamed User"}</p>
                                                    <p className="text-sm">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium ${user.role === 'admin'
                                                ? 'bg-purple-100 text-purple-700'
                                                : 'bg-green-100 text-green-700'
                                                }`}>
                                                {user.role === 'admin' && <Shield size={12} />}
                                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-gray-800">
                                                <Wallet size={16} className="text-gray-600" />
                                                ${user.wallet_balance?.toFixed(2) || "0.00"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <a
                                                    href={user.phone ? `https://wa.me/${user.phone.replace(/\D/g, '')}` : undefined}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`p-2 rounded-lg transition-colors border ${user.phone
                                                        ? "text-green-600 border-green-200 hover:bg-green-50"
                                                        : "text-gray-300 border-gray-200 cursor-not-allowed"
                                                        }`}
                                                    title={user.phone ? `Message ${user.phone}` : "No phone number available"}
                                                    aria-disabled={!user.phone}
                                                    onClick={(e) => !user.phone && e.preventDefault()}
                                                >
                                                    <MessageCircle size={18} />
                                                </a>
                                                <button
                                                    onClick={() => toggleRole(user.id, user.role)}
                                                    className="text-primary hover:text-primary/80 font-medium border border-primary/20 px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-colors"
                                                >
                                                    {user.role === 'admin' ? 'Demote' : 'Promote'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
