"use client";
import Image from "next/image";
import styles from "./sidebars.module.css";
import { LogOut, UserPen } from "lucide-react";

interface SidebarProps {
  type: "shop" | "user";
  user?: {
    name: string;
    email: string;
    image?: string;
  };
  onSearch?: (q: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  onEditProfile?: () => void;
  onSignOut?: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  brands?: { id: string; name: string }[];
  categories?: { id: string; name: string }[];
  selectedBrand?: string;
  selectedCategory?: string;
  onFilterChange?: (key: string, value: string) => void;
}

export default function Sidebar({
  type = "shop",
  user,
  onSearch,
  isOpen,
  onClose,
  onEditProfile,
  onSignOut,
  activeTab = "personal-info",
  onTabChange,
  brands = [],
  categories = [],
  selectedBrand,
  selectedCategory,
  onFilterChange,
}: SidebarProps) {
  // ... (Shop Sidebar logic remains same, skipping for brevity in thought process) ...
  // actually I need to be careful with the replacement.

  // ========== Shop Sidebar ==========
  if (type === "shop") {
    // ... same ...
    return (
      <div
        className={
          styles.sidebar +
          ` p-4 sm:p-6 rounded-md shadow-card h-full overflow-y-auto`
        }
      >
        {/* Close button - visible on all screen sizes */}
        <div className="flex items-center justify-end my-4">
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors"
            aria-label="Close filters"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-white text-sm sm:text-base mb-2">
            Brand
          </label>
          <div className="grid grid-cols-1 gap-2 sm:gap-3">
            <button
              key="all-brands"
              onClick={() => onFilterChange?.('brand_id', '')}
              className={`text-xs sm:text-sm py-2 rounded-md transition-colors ${!selectedBrand ? "bg-secondary text-white" : "bg-primary hover:bg-secondary text-white"
                }`}
            >
              All Brands
            </button>
            {brands.map((b) => (
              <button
                key={b.id}
                onClick={() => onFilterChange?.('brand_id', b.id)}
                className={`text-xs sm:text-sm py-2 rounded-md transition-colors ${selectedBrand === b.id ? "bg-secondary text-white" : "bg-primary hover:bg-secondary text-white"
                  }`}
              >
                {b.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-white text-sm sm:text-base mb-2">
            Category
          </label>
          <div className="grid grid-cols-1 gap-2 sm:gap-3">
            <button
              key="all-cats"
              onClick={() => onFilterChange?.('category_id', '')}
              className={`text-xs sm:text-sm py-2 rounded-md transition-colors ${!selectedCategory ? "bg-secondary text-white" : "bg-primary hover:bg-secondary text-white"
                }`}
            >
              All Categories
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => onFilterChange?.('category_id', c.id)}
                className={`text-xs sm:text-sm py-2 rounded-md transition-colors ${selectedCategory === c.id ? "bg-secondary text-white" : "bg-primary hover:bg-secondary text-white"
                  }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-white text-sm sm:text-base mb-2">
            Price Range
          </label>
          <input type="range" min={0} max={500} className="w-full mt-3" />
          <div className="flex justify-between text-xs text-white mt-2">
            <span>$50</span>
            <span>$250</span>
          </div>
        </div>

        <button
          onClick={() => {
            onSearch?.("");
            onClose?.();
          }}
          className="w-full py-2.5 sm:py-3 bg-secondary text-white font-semibold mb-3 rounded-md hover:bg-secondary/90 transition-colors text-sm sm:text-base"
        >
          Search
        </button>

        <button className="w-full py-2.5 sm:py-3 border border-white text-white rounded-md hover:bg-white/10 transition-colors text-sm sm:text-base">
          Clear All
        </button>
      </div>
    );
  }

  // ========== User Dashboard Sidebar ==========
  return (
    <aside
      className={
        styles.sidebar +
        " w-80 p-6 rounded-md border border-white/10 flex flex-col sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto"
      }
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
          <Image
            src={user?.image || "/assets/images/logo/logo-icon-1200x1200.png"}
            alt="Profile"
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="overflow-hidden">
          <h3 className="text-sm font-semibold truncate">{user?.name}</h3>
          <p className="text-xs text-gray-300 truncate">{user?.email}</p>
        </div>
      </div>

      <nav className="space-y-3 flex-1">
        {[
          { id: "personal-info", label: "Personal Info" },
          { id: "orders", label: "Order History" },
          { id: "wallet", label: "Wallet" },
          { id: "promo-codes", label: "Promo Codes" },
          { id: "favorites", label: "Favorites" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange?.(item.id)}
            className={`w-full text-left px-3 py-2 rounded-md transition-colors ${activeTab === item.id
              ? "bg-secondary text-black font-semibold"
              : "hover:bg-white/10 text-white"
              }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-6 space-y-3 pt-6 border-t border-white/10">
        <button
          onClick={onEditProfile}
          className="flex items-center justify-center gap-2 w-full py-2 rounded-md bg-secondary text-black font-semibold hover:bg-secondary/90 transition-colors"
        >
          <UserPen className="w-4 h-4" />
          Edit Profile
        </button>

        <button
          onClick={onSignOut}
          className="flex items-center justify-center gap-2 w-full py-2 rounded-md bg-red-600/20 text-red-200 border border-red-600/50 hover:bg-red-600/30 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
