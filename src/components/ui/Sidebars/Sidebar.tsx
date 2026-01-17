import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./sidebars.module.css";
import { LogOut, UserPen, X } from "lucide-react";

interface SidebarProps {
  type: "shop" | "user";
  user?: {
    full_name: string;
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
  minPrice?: number;
  maxPrice?: number;
  onFilterChange?: (key: string, value: string) => void;
  onClearAll?: () => void;
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
  minPrice,
  maxPrice,
  onFilterChange,
  onClearAll,
}: SidebarProps) {
  const [localMin, setLocalMin] = useState(minPrice || 755);
  const [localMax, setLocalMax] = useState(maxPrice || 20000);

  // Sync with props (e.g. when cleared or URL changed directly)
  useEffect(() => {
    setLocalMin(minPrice || 755);
  }, [minPrice]);

  useEffect(() => {
    setLocalMax(maxPrice || 20000);
  }, [maxPrice]);

  const handlePriceCommit = (key: string, value: number) => {
    onFilterChange?.(key, String(value));
  };

  // ========== Shop Sidebar ==========
  if (type === "shop") {
    return (
      <div
        className={
          styles.sidebar +
          ` p-4 sm:p-6 rounded-md shadow-card h-full overflow-y-auto bg-accent`
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
          <label className="block text-white text-sm sm:text-base mb-2 font-bold uppercase tracking-wider opacity-90">
            Brand
          </label>
          <div className="grid grid-cols-1 gap-2 sm:gap-3">
            <button
              key="all-brands"
              onClick={() => onFilterChange?.('brand_id', '')}
              className={`text-xs sm:text-sm py-2 rounded-md transition-all duration-300 ${!selectedBrand ? "bg-secondary text-white shadow-lg shadow-secondary/20" : "bg-primary/40 hover:bg-secondary/20 text-white/70 border border-white/5"
                }`}
            >
              All Brands
            </button>
            {brands.map((b) => (
              <button
                key={b.id}
                onClick={() => onFilterChange?.('brand_id', b.id)}
                className={`text-xs sm:text-sm py-2 rounded-md transition-all duration-300 ${selectedBrand === b.id ? "bg-secondary text-white shadow-lg shadow-secondary/20" : "bg-primary/40 hover:bg-secondary/20 text-white/70 border border-white/5"
                  }`}
              >
                {b.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-white text-sm sm:text-base mb-2 font-bold uppercase tracking-wider opacity-90">
            Category
          </label>
          <div className="grid grid-cols-1 gap-2 sm:gap-3">
            <button
              key="all-cats"
              onClick={() => onFilterChange?.('category_id', '')}
              className={`text-xs sm:text-sm py-2 rounded-md transition-all duration-300 ${!selectedCategory ? "bg-secondary text-white shadow-lg shadow-secondary/20" : "bg-primary/40 hover:bg-secondary/20 text-white/70 border border-white/5"
                }`}
            >
              All Categories
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => onFilterChange?.('category_id', c.id)}
                className={`text-xs sm:text-sm py-2 rounded-md transition-all duration-300 ${selectedCategory === c.id ? "bg-secondary text-white shadow-lg shadow-secondary/20" : "bg-primary/40 hover:bg-secondary/20 text-white/70 border border-white/5"
                  }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-white text-sm sm:text-base mb-2 font-bold uppercase tracking-wider opacity-90">
            Price Range (EGP)
          </label>
          <div className="space-y-4 pt-2">
            <div className="flex gap-2">
              <div className="flex-1">
                <span className="text-[10px] text-white/40 uppercase font-bold">Min</span>
                <input
                  type="number"
                  value={localMin}
                  onChange={(e) => setLocalMin(Number(e.target.value))}
                  onBlur={() => handlePriceCommit('min_price', localMin)}
                  className="w-full bg-primary/40 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-secondary outline-none transition-colors"
                />
              </div>
              <div className="flex-1">
                <span className="text-[10px] text-white/40 uppercase font-bold">Max</span>
                <input
                  type="number"
                  value={localMax}
                  onChange={(e) => setLocalMax(Number(e.target.value))}
                  onBlur={() => handlePriceCommit('max_price', localMax)}
                  className="w-full bg-primary/40 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-secondary outline-none transition-colors"
                />
              </div>
            </div>

            <div className="px-2">
              <input
                type="range"
                min={755}
                max={20000}
                step={50}
                value={localMax}
                onChange={(e) => setLocalMax(Number(e.target.value))}
                onMouseUp={() => handlePriceCommit('max_price', localMax)}
                onTouchEnd={() => handlePriceCommit('max_price', localMax)}
                className="w-full h-1.5 bg-primary/60 rounded-lg appearance-none cursor-pointer accent-secondary transition-all hover:accent-amber-400"
              />
            </div>

            <div className="flex justify-between text-[11px] text-white/40 px-1 font-medium italic">
              <span>{localMin} EGP</span>
              <span>{localMax} EGP</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 sm:py-3 bg-secondary text-white font-semibold mb-3 rounded-md hover:bg-secondary/90 transition-colors text-sm sm:text-base"
        >
          Show Results
        </button>

        <button
          onClick={() => {
            onClearAll?.();
            onClose?.();
          }}
          className="w-full py-2.5 sm:py-3 border border-white text-white rounded-md hover:bg-white/10 transition-colors text-sm sm:text-base"
        >
          Clear All
        </button>
      </div>

    );
  }

  // ========== User Dashboard Sidebar ==========
  return (
    <>
      {/* Overlay - Mobile Only */}
      {type === "user" && isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      <aside
        className={`
          fixed inset-y-0 left-0 z-20 bg-white/5 border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:h-[calc(100vh-5rem)] lg:w-80 lg:bg-transparent lg:border-none lg:p-6
        `}
      >
        <div className="flex flex-col h-full bg-white/5 lg:bg-white/5 lg:border lg:border-white/10 lg:rounded-3xl p-6 lg:p-6 overflow-y-auto custom-scrollbar">
          {/* Mobile Close Button */}
          <div className="flex justify-end lg:hidden mb-4">
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X />
            </button>
          </div>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl shadow-amber-500/10">
              <Image
                src={user?.image || "/assets/images/logo/logo-icon-1200x1200.png"}
                alt="Profile"
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="overflow-hidden">
              <h3 className="text-sm font-bold text-white truncate">{user?.full_name}</h3>
            </div>
          </div>

          <nav className="space-y-2 flex-1">
            {[
              { id: "personal-info", label: "Personal Info" },
              { id: "orders", label: "Order History" },
              { id: "wallet", label: "Wallet" },
              { id: "promo-codes", label: "Promo Codes" },
              { id: "gifts", label: "Gifts" },
              { id: "favorites", label: "Favorites" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange?.(item.id);
                  onClose?.(); // Close on mobile after selection
                }}
                className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-300 flex items-center gap-3 group ${activeTab === item.id
                  ? "bg-amber-500 text-black font-bold shadow-lg shadow-amber-500/20"
                  : "hover:bg-white/10 text-gray-300 hover:text-white"
                  }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full bg-current transition-all duration-300 ${activeTab === item.id ? "scale-100" : "scale-0 group-hover:scale-100"}`} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-auto space-y-3 pt-6 border-t border-white/10">
            <button
              onClick={() => {
                onEditProfile?.();
                onClose?.();
              }}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              <UserPen className="w-4 h-4" />
              Edit Profile
            </button>

            <button
              onClick={onSignOut}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-red-600/10 text-red-400 border border-red-600/20 hover:bg-red-600/20 hover:border-red-600/30 transition-all duration-300"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
