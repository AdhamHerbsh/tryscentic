"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/utils/supabase/client";
import Sidebar from "@/components/ui/Sidebars/Sidebar";
import WalletSection from "@/app/(app)/parts/WalletSection";
import OrderHistorySection from "@/app/(app)/parts/OrderHistorySection";
import PromoCodesSection from "@/app/(app)/parts/PromoCodesSection";
import FavoritesSection from "@/app/(app)/parts/FavoritesSection";
import EditProfileModal from "@/components/ui/Modals/EditProfileModal";
import { toast } from "sonner";
import { Loader2, ShieldAlert } from "lucide-react";

interface DashboardUser {
  id: string;
  email?: string;
  name?: string;
  avatar_url?: string;
  bio?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}


export default function UserDashboardPage() {
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
          // If unauthenticated, we can redirect or show a protected state.
          // The prompt suggests automatic redirect OR protected content state.
          // We'll perform a redirect after a short delay or immediately.
          // For better UX during dev, let's just terminate loading and show protected state if redirect fails/is blocked,
          // but typically we push to login.
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
          name: profile?.name || authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "User",
          email: authUser.email,
          avatar_url: profile?.avatar_url || authUser.user_metadata?.avatar_url,
          bio: profile?.bio || "",
        });
      } catch (error) {
        console.log("Unexpected error in auth check:", error);
      }
    };

    checkAuth();
  }, [router, supabase]);

  const handleUpdateProfile = async (updatedData: {
    name: string;
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

  // Auth Guard State
  if (!user) {
    return (
      <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-6 pt-20 text-center px-4">
        <ShieldAlert className="h-16 w-16 text-amber-600" />
        <h1 className="text-3xl font-bold">Protected Content</h1>
        <p className="text-gray-500 max-w-md">
          You need to be signed in to access your dashboard, wallet, and order
          history.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="rounded-md bg-amber-600 px-6 py-3 font-bold text-white transition-transform hover:scale-105 hover:bg-amber-700"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row pt-20 min-h-screen">
        <Sidebar
          type="user"
          user={{
            name: user.name || "",
            email: user.email || "",
            image: user.avatar_url,
          }}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onEditProfile={() => setIsEditModalOpen(true)}
          onSignOut={handleSignOut}
        />

        <main className="flex-1 p-6 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-3xl font-bold mb-6 text-gray-200 dark:text-gray-100">
            {activeTab === 'personal-info' && 'Personal Info'}
            {activeTab === 'orders' && 'Order History'}
            {activeTab === 'wallet' && 'My Wallet'}
            {activeTab === 'promo-codes' && 'Promo Codes'}
            {activeTab === 'favorites' && 'My Favorites'}
          </h1>

          <div className="space-y-8">
            {activeTab === 'personal-info' && (
              <>
                <WalletSection />
                {/* Add more personal info overview if needed */}
              </>
            )}
            {activeTab === 'wallet' && <WalletSection />}
            {activeTab === 'orders' && <OrderHistorySection />}
            {activeTab === 'promo-codes' && <PromoCodesSection />}
            {activeTab === 'favorites' && <FavoritesSection />}
          </div>
        </main>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={{
          name: user.name || "",
          bio: user.bio || "",
          avatar_url: user.avatar_url || "",
        }}
        onSave={handleUpdateProfile}
      />
    </>
  );
}
