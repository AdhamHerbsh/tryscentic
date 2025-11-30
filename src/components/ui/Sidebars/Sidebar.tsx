"use client";
import Image from "next/image";
import styles from "./sidebars.module.css";

interface SidebarProps {
  type: "shop" | "user";
  user?: {
    name: string;
    email: string;
    image?: string;
  };
  onSearch?: (q: string) => void;
}


      
export default function Sidebar({ type = "shop", user, onSearch }: SidebarProps) {
  // ========== Shop Sidebar ==========
  if (type === "shop") {
    return (
     <div
  className={
    styles.sidebar +
    ` p-6 rounded-md shadow-card sticky top-20`
  }
>
  <h3 className="text-white font-semibold mb-4">Filters</h3>

  <div className="mb-6">
    <label className="block text-white">Brand</label>
    <div className="grid grid-cols-1 gap-3 mt-3">
      {["Chanel", "Dior", "Gucci"].map((b) => (
        <button
          key={b}
          className="text-sm bg-primary hover:bg-secondary text-white py-2 rounded-md"
        >
          {b}
        </button>
      ))}
    </div>
  </div>

  <div className="mb-6">
    <label className="block text-white">Scent Type</label>
    <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 mt-3">
      {["Floral", "Woody", "Citrus", "Spicy"].map((s) => (
        <button
          key={s}
          className="text-sm bg-primary hover:bg-secondary text-white p-2 rounded-md text-center"
        >
          {s}
        </button>
      ))}
    </div>
  </div>

  <div className="mb-6">
    <label className="block text-white">Price Range</label>
    <input type="range" min={0} max={500} className="w-full mt-3" />
    <div className="flex justify-between text-xs text-white mt-2">
      <span>$50</span>
      <span>$250</span>
    </div>
  </div>

  <button
    onClick={() => onSearch?.("")}
    className="w-full py-3 bg-secondary text-white font-semibold mb-3 rounded-md"
  >
    Search
  </button>

  <button className="w-full py-3 border border-white text-white rounded-md">
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
            src={user?.image || '/placeholder-profile.png'}
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
        <button className="w-full text-left px-3 py-2 rounded-md bg-[#f0a020] text-black font-semibold">
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

      <button className="mt-6 bg-[#f0a020] text-black font-semibold py-2 rounded-md">
        Edit Profile
      </button>
    </aside>
  );
}
