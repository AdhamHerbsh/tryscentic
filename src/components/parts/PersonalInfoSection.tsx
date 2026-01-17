"use client";
import { User, Mail, FileText, Calendar, ShieldCheck } from "lucide-react";

interface UserProfile {
    id: string;
    email?: string;
    phone?: string;
    full_name?: string;
    avatar_url?: string;
    bio?: string;
    created_at?: string;
}

interface PersonalInfoSectionProps {
    user: UserProfile | null;
}

export default function PersonalInfoSection({ user }: PersonalInfoSectionProps) {
    if (!user) return null;

    const joinDate = user.created_at
        ? new Date(user.created_at).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
            day: 'numeric'
        })
        : "Member since 2024";

    return (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info Card */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-12 w-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-500">
                            <User className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Profile Basics</h2>
                            <p className="text-gray-400 text-sm">Your identity on Tryscentic</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-bold uppercase tracking-wider text-gray-200 ml-1">Full Name</label>
                            <div className="flex items-center gap-3 bg-black/20 border border-white/5 p-4 rounded-2xl">
                                <span className="text-white font-medium">{user.full_name || "Not set"}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-bold uppercase tracking-wider text-gray-200 ml-1">Phone Number</label>
                            <div className="flex items-center gap-3 bg-black/20 border border-white/5 p-4 rounded-2xl">
                                <span className="text-white font-medium">{user.phone || "Not set"}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-bold uppercase tracking-wider text-gray-200 ml-1">Email Address</label>
                            <div className="flex items-center gap-3 bg-black/20 border border-white/5 p-4 rounded-2xl">
                                <Mail className="h-4 w-4 text-amber-500/50" />
                                <span className="text-white font-medium">{user.email || "Not set"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bio & Extra Card */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-12 w-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-500">
                            <FileText className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">About You</h2>
                            <p className="text-gray-200 text-sm">Your story and preferences</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-bold uppercase tracking-wider text-gray-200 ml-1">Biography</label>
                            <div className="min-h-[100px] bg-black/20 border border-white/5 p-4 rounded-2xl">
                                <p className="text-gray-300 leading-relaxed italic">
                                    {user.bio || "No bio added yet. Tell us about your signature scent!"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-gray-400">
                                <Calendar className="h-4 w-4" />
                                <span className="text-sm">Joined {joinDate}</span>
                            </div>
                            <div className="flex items-center gap-2 text-amber-500/80">
                                <ShieldCheck className="h-4 w-4" />
                                <span className="text-[10px] font-bold uppercase tracking-tighter">Verified Account</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
