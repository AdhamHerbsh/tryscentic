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
  const TOP_OFFSET = 80;

  // ========== Shop Sidebar ==========
  if (type === "shop") {
    return (
      <div
  className={`${styles.sidebar} mt-6 mb-6 p-4 rounded-md shadow-card fixed flex flex-col justify-between`}
  style={{
    top: TOP_OFFSET,
    left: 24,
    bottom: "10px",
    width: 350,
  }}
>
      
        <div className="flex flex-col gap-3">
          <h3 className="text-white font-semibold mb-2">Filters</h3>

          <div>
            <label className="block text-white text-sm mb-1">Brand</label>
            <div className="grid grid-cols-1 gap-2">
              {["Chanel", "Dior", "Gucci"].map((b) => (
                <button
                  key={b}
                  className="text-sm bg-primary hover:bg-secondary text-white py-1.5 rounded-md"
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-white text-sm mb-1">Scent Type</label>
            <div className="flex flex-col gap-2 ">
              {["Floral", "Woody", "Citrus", "Spicy"].map((s) => (
                <button
                  key={s}
                  className="text-sm bg-primary hover:bg-secondary text-white py-1.5 rounded-md text-center"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-white text-sm mb-1">Price Range</label>
            <input type="range" min={0} max={500} className="w-full" />
            <div className="flex justify-between text-xs text-white mt-1">
              <span>$50</span>
              <span>$250</span>
            </div>
          </div>
        </div>

       
        <div className="flex flex-col gap-2 mt-4">
          <button
            onClick={() => onSearch?.("")}
            className="w-full py-2 bg-secondary text-white font-semibold rounded-md"
          >
            Search
          </button>

          <button className="w-full py-2 border border-white text-white rounded-md">
            Clear All
          </button>
        </div>
      </div>
    );
  }

  // ========== User Dashboard Sidebar ==========
  return (
    <aside
      className={`${styles.sidebar} m-6 w-60 p-4 rounded-md border border-white/10 flex flex-col fixed justify-between`}
      style={{
      top: TOP_OFFSET,
       bottom: "10px",    
    left: "10px",      
      
       
      }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <Image
              src={user?.image || "/placeholder-profile.png"}
              alt="Profile"
              width={40}
              height={40}
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold">{user?.name}</h3>
            <p className="text-xs text-gray-300">{user?.email}</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          <button className="w-full text-left px-2 py-1 rounded-md bg-[#f0a020] text-black font-semibold">
            Personal Info
          </button>
          <button className="w-full text-left px-2 py-1 rounded-md hover:bg-white/10">
            Order History
          </button>
          <button className="w-full text-left px-2 py-1 rounded-md hover:bg-white/10">
            Wallet
          </button>
          <button className="w-full text-left px-2 py-1 rounded-md hover:bg-white/10">
            Promo Codes
          </button>
          <button className="w-full text-left px-2 py-1 rounded-md hover:bg-white/10">
            Favorites
          </button>
        </nav>
      </div>

      <button className="mt-4 bg-[#f0a020] text-black font-semibold py-2 rounded-md">
        Edit Profile
      </button>
    </aside>
  );
}
