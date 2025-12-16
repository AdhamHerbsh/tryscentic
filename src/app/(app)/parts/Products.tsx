"use client";
import { useState } from "react";
import Sidebar from "@/components/ui/Sidebars/Sidebar";
import ProductCard from "@/components/ui/Cards/ProductCard";
import Pagination from "@/components/ui/Pagination/Pagination";

import sampleData from "@/app/(app)/data/products";

export default function ProductsPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pageSize = 12;
  const filtered = sampleData.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase())
  );
  const shown = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <section className="relative">
      {/* Filter Toggle Button - Now visible on all screen sizes */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed bottom-6 right-6 z-50 bg-secondary text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-secondary/90 transition-all text-sm sm:text-base"
        aria-label={sidebarOpen ? "Close filters" : "Open filters"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 sm:h-5 sm:w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" />
        </svg>
        <span className="hidden sm:inline">Filters</span>
      </button>

      {/* Overlay when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`grid transition-all duration-300 gap-4 lg:gap-8 ${sidebarOpen ? "grid-cols-1 lg:grid-cols-4" : "grid-cols-1"
        }`}>
        {/* Sidebar - Fixed position when open on all screens */}
        {sidebarOpen && (
          <aside
            className="fixed top-0 left-0 h-full w-[280px] sm:w-[320px] lg:w-[340px] z-50 transition-transform duration-300 ease-in-out"
          >
            <Sidebar
              type="shop"
              onSearch={(q: string) => {
                setQuery(q);
                setPage(1);
              }}
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
          </aside>
        )}

        {/* Products Section */}
        <div className={`px-2 sm:px-0 transition-all duration-300 ${sidebarOpen ? "lg:col-start-2 lg:col-span-3" : "col-span-1"
          }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="text-sm sm:text-base">
              Showing {Math.min((page - 1) * pageSize + 1, filtered.length)} -{" "}
              {Math.min(page * pageSize, filtered.length)} of {filtered.length}{" "}
              results
            </div>
            <div>
              <select className="bg-black px-3 sm:px-4 py-2 rounded-md shadow-sm text-sm sm:text-base">
                <option>Sort by: Popularity</option>
              </select>
            </div>
          </div>

          {/* Product Grid - Responsive based on sidebar state */}
          <div className={`grid gap-3 sm:gap-4 md:gap-6 ${sidebarOpen
            ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-3"
            : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            }`}>
            {shown.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-8 sm:mt-12 flex justify-center">
            <Pagination
              page={page}
              total={Math.ceil(filtered.length / pageSize)}
              onChange={setPage}
            />
          </div>
        </div>
      </div>
    </section>
  );
}