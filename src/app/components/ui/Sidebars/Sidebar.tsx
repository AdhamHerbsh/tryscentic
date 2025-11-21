"use client";
import { useState } from "react";
import styles from "./sidebars.module.css";

export default function Sidebar({
  onSearch,
}: {
  onSearch: (q: string) => void;
}) {
  const [q, setQ] = useState("");
  return (
    <div className={styles.sidebar + ` p-6 rounded-md shadow-card `}>
      <h3 className="text-white font-semibold mb-4">Filters</h3>

      <div className="mb-6">
        <label className="block text-white">Brand</label>
        {/* Use grid for responsiveness on button list */}
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
        {/* Use grid for responsiveness on button list */}
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

      {/* Changed mt-auto to regular margin to prevent unexpected stretching outside of flex context */}
      <div className="mt-8">
        <button
          onClick={() => onSearch(q)}
          className="w-full py-3 bg-secondary text-white font-semibold mb-3 rounded-md"
        >
          Search
        </button>
        <button className="w-full py-3 border border-white text-white rounded-md">
          Clear All
        </button>
      </div>
    </div>
  );
}
