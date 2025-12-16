"use client";
import Image from "next/image";
import styles from "./sidebars.module.css";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import Link from "next/link";

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
}



export default function Sidebar({ type = "shop", user, onSearch, isOpen, onClose }: SidebarProps) {
  // ========== Shop Sidebar ==========
  if (type === "shop") {
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
          <label className="block text-white text-sm sm:text-base mb-2">Brand</label>
          <div className="grid grid-cols-1 gap-2 sm:gap-3">
            {["Chanel", "Dior", "Gucci"].map((b) => (
              <button
                key={b}
                className="text-xs sm:text-sm bg-primary hover:bg-secondary text-white py-2 rounded-md transition-colors"
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-white text-sm sm:text-base mb-2">Scent Type</label>
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-3">
            {["Floral", "Woody", "Citrus", "Spicy"].map((s) => (
              <button
                key={s}
                className="text-xs sm:text-sm bg-primary hover:bg-secondary text-white p-2 rounded-md text-center transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-white text-sm sm:text-base mb-2">Price Range</label>
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
        " w-60 p-6 rounded-md border border-white/10 flex flex-col sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto"
      }
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <Image
            src={user?.image || '/assets/images/placeholder-profile.png'}
            alt="Profile"
            width={48}
            height={48}
          />
        </div>

        <div>
          <h3 className="text-sm font-semibold">{user?.name}</h3>
          <p className="text-xs text-gray-300">{user?.email}</p>
        </div>
      </div>

      <nav className="space-y-3 flex-1">
        <button className="w-full text-left px-3 py-2 rounded-md bg-secondary text-black font-semibold">
          Personal Info
        </button>
        <button className="w-full text-left px-3 py-2 rounded-md hover:bg-white/10">
          Order History
        </button>
        <button className="w-full text-left px-3 py-2 rounded-md hover:bg-white/10">
          Wallet
        </button>
        <button className="w-full text-left px-3 py-2 rounded-md hover:bg-white/10">
          Promo Codes
        </button>
        <button className="w-full text-left px-3 py-2 rounded-md hover:bg-white/10">
          Favorites
        </button>
      </nav>

      <button className="mt-6 bg-secondary text-white font-semibold py-2 rounded-md">
        Edit Profile
      </button>

      <Link href="/login" className="btn mt-6 bg-secondary text-white font-semibold py-2 rounded-md">Sign in</Link>
      <Link href="/register" className="btn mt-6 bg-secondary text-white font-semibold py-2 rounded-md">Sign up</Link>
      <LogoutLink className="btn mt-6 bg-secondary text-white font-semibold py-2 rounded-md">Logout</LogoutLink>

    </aside>
  );
}
