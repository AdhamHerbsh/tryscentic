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
import EditProfileModal from "@/components/ui/Modals/EditProfileModal";
import { toast } from "sonner";
import { Loader, ShieldAlert, Menu } from "lucide-react";

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
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("personal-info");
  const router = useRouter();
  const supabase = createClient();


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !authUser) {
          setIsLoading(false);
          return;
        }

        // Fetch additional profile data
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single();

        if (profileError && profileError.code !== "PGRST116") {
          console.log("Error fetching profile:", profileError);
        }

        // Merge auth user and profile data
        setUser({
          ...authUser,
          ...(profile || {}),
          // Ensure we have displayable fields
          full_name: profile?.full_name || authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "User",
          email: authUser.email,
          avatar_url: profile?.avatar_url || authUser.user_metadata?.avatar_url,
          bio: profile?.bio || "",
          created_at: profile?.created_at || authUser.created_at,
        });
      } catch (error) {
        console.log("Unexpected error in auth check:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, supabase]);

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

      setUser((prev) => (prev ? { ...prev, ...updatedData } : null));
    } catch (error) {
      console.log("Error updating profile:", error);
      throw error; // Re-throw for the modal to handle/display error
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
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
              full_name: user.full_name || "",
              image: user.avatar_url,
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
                  {activeTab === 'orders'}
                  {activeTab === 'wallet'}
                  {activeTab === 'promo-codes'}
                  {activeTab === 'favorites'}
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
              {activeTab === 'favorites' && <FavoritesSection />}
            </div>
          </main>
        </div>
      )}

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={{
          full_name: user?.full_name || "",
          bio: user?.bio || "",
          avatar_url: user?.avatar_url || "",
        }}
        onSave={handleUpdateProfile}
      />
    </>
  );
}
