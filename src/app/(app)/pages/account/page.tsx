"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/utils/supabase/client";
import Sidebar from "@/components/ui/Sidebars/Sidebar";
import WalletSection from "@/components/parts/WalletSection";
import OrderHistorySection from "@/components/parts/OrderHistorySection";
import PromoCodesSection from "@/components/parts/PromoCodesSection";
import FavoritesSection from "@/components/parts/FavoritesSection";
import PersonalInfoSection from "@/components/parts/PersonalInfoSection";
import MyGiftsSection from "@/components/parts/MyGiftsSection";
import EditProfileModal from "@/components/ui/Modals/EditProfileModal";
import { toast } from "sonner";
import { Loader, ShieldAlert, Menu } from "lucide-react";
import { useUser } from "@/lib/context/UserContext";

interface DashboardUser {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  created_at?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}


export default function AccountPage() {
  const { user, profile, isLoading, refreshProfile, signOut } = useUser();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("personal-info");
  const router = useRouter();
  const supabase = createClient();

  const handleUpdateProfile = async (updatedData: {
    full_name: string;
    bio: string;
    avatar_url: string;
  }) => {
    if (!user) return;
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        ...updatedData,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      await refreshProfile();
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error updating profile:", error);
      throw error;
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center backdrop-blur-3xl">
        <Loader className="h-10 w-10 animate-spin text-amber-600" />
      </div>
    );
  }

  // Auth Guard State
  return (
    <>
      {!user ? (
        <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-6 pt-20 text-center px-4">
          <ShieldAlert className="h-16 w-16 text-amber-600" />
          <h1 className="text-3xl font-bold text-white">Protected Content</h1>
          <p className="text-gray-400 max-w-md">
            You need to be signed in to access your dashboard, wallet, and order
            history.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="rounded-md bg-amber-600 px-6 py-3 font-bold text-white transition-transform hover:scale-105 hover:bg-amber-700 shadow-xl shadow-amber-600/20"
          >
            Go to Sign In
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row pt-20 min-h-screen relative overflow-hidden">

          {/* Sidebar */}
          <Sidebar
            type="user"
            user={{
              full_name: profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User",
              image: profile?.avatar_url || user?.user_metadata?.avatar_url,
            }}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onEditProfile={() => setIsEditModalOpen(true)}
            onSignOut={handleSignOut}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-10 relative z-10">
            {/* Header / Mobile Toggle */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden p-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-colors"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {activeTab === 'personal-info' && 'Personal Info'}
                  {activeTab === 'orders' && 'Order History'}
                  {activeTab === 'wallet' && 'My Wallet'}
                  {activeTab === 'promo-codes' && 'Promo Codes'}
                  {activeTab === 'gifts' && 'My Gifts'}
                  {activeTab === 'favorites' && 'Favorites'}
                </h1>
              </div>

              {/* Quick Actions / Status could go here if needed */}
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {activeTab === 'personal-info' && (
                <div className="space-y-8">
                  <PersonalInfoSection user={user} />
                </div>
              )}
              {activeTab === 'wallet' && <WalletSection />}
              {activeTab === 'orders' && <OrderHistorySection />}
              {activeTab === 'promo-codes' && <PromoCodesSection />}
              {activeTab === 'gifts' && <MyGiftsSection />}
              {activeTab === 'favorites' && <FavoritesSection />}
            </div>
          </main>
        </div>
      )}

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={{
          full_name: profile?.full_name || user?.user_metadata?.full_name || "",
          bio: profile?.bio || "",
          avatar_url: profile?.avatar_url || user?.user_metadata?.avatar_url || "",
        }}
        onSave={handleUpdateProfile}
      />
    </>
  );
}
