"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Sidebar from "@/components/ui/Sidebars/Sidebar";
import ProductCard from "@/components/ui/Cards/ProductCard";
import Pagination from "@/components/ui/Pagination/Pagination";
import { Product, Brand, Category } from "@/types/database";
import { toggleFavorite } from "@/data-access/user/favorites";
import { toast } from "sonner";

interface ProductsProps {
  products: Product[];
  totalCount: number;
  totalPages: number;
  brands: Brand[];
  categories: Category[];
  favoriteIds: string[];
}

export default function Products({
  products,
  totalCount,
  totalPages,
  brands,
  categories,
  favoriteIds: initialFavoriteIds,
}: ProductsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>(initialFavoriteIds);

  const currentPage = Number(searchParams.get("page")) || 1;
  const currentQuery = searchParams.get("q") || "";
  const currentBrand = searchParams.get("brand_id") || "";
  const currentCategory = searchParams.get("category_id") || "";

  const updateSearchParam = (params: { [key: string]: string | number | null }) => {
    const newParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === "") {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
    });

    // Reset to page 1 on filter/search change unless explicitly setting page
    if (!params.page && params.page !== 0) {
      newParams.set("page", "1");
    }

    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  const handleToggleFavorite = async (productId: string) => {
    try {
      const isFav = favoriteIds.includes(productId);
      // Optimistic update
      setFavoriteIds(prev => isFav ? prev.filter(id => id !== productId) : [...prev, productId]);

      const newStatus = await toggleFavorite(productId);

      // Sync in case of server failure or different return
      if (newStatus !== !isFav) {
        setFavoriteIds(prev => newStatus ? [...prev, productId] : prev.filter(id => id !== productId));
      }

      toast.success(newStatus ? "Added to favorites" : "Removed from favorites");
    } catch {
      toast.error("Please login to manage favorites");
      // Revert optimistic update
      setFavoriteIds(prev => initialFavoriteIds);
    }
  };

  const mapProductToCard = (p: Product) => {
    const sortedVariants = p.variants ? [...p.variants].sort((a, b) => a.price - b.price) : [];
    const chosenVariant = sortedVariants.find(v => v.stock_quantity > 0) || sortedVariants[0];
    const minPrice = chosenVariant?.price || 0;
    const inStock = p.variants?.some(v => v.stock_quantity > 0);

    return {
      id: p.id,
      variantId: chosenVariant?.id,
      title: p.title,
      brand: p.brand?.name || "Brand",
      price: minPrice,
      image: p.base_image_url || "/placeholder.jpg",
      category: p.category?.name || "Category",
      inStock
    };
  };

  return (
    <section className="relative pt-20">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed bottom-6 right-6 z-50 bg-[#511624] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-[#511624]/90 transition-all text-sm sm:text-base border border-white/10"
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
        <span className="hidden sm:inline font-semibold">Filters</span>
      </button>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`grid transition-all duration-300 gap-4 lg:gap-8 ${sidebarOpen ? "grid-cols-1 lg:grid-cols-4" : "grid-cols-1"}`}>
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="fixed top-0 left-0 h-full w-[280px] sm:w-[320px] lg:w-[340px] z-50">
            <Sidebar
              type="shop"
              onSearch={(q: string) => updateSearchParam({ q })}
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              brands={brands}
              categories={categories}
              selectedBrand={currentBrand}
              selectedCategory={currentCategory}
              onFilterChange={(key, value) => updateSearchParam({ [key]: value })}
            />
          </aside>
        )}

        {/* Products Section */}
        <div className={`transition-all duration-300 ${sidebarOpen ? "lg:col-start-2 lg:col-span-3" : "col-span-1"}`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8 bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="text-sm sm:text-base text-white/60">
              Showing <span className="text-white font-semibold">{Math.min((currentPage - 1) * 12 + 1, totalCount)}</span> -{" "}
              <span className="text-white font-semibold">{Math.min(currentPage * 12, totalCount)}</span> of <span className="text-white font-semibold">{totalCount}</span>{" "}
              results
            </div>
            <div>
              <select className="bg-black/40 border border-white/10 text-white px-3 sm:px-4 py-2 rounded-xl shadow-sm text-sm sm:text-base focus:ring-1 focus:ring-amber-500/50 outline-none">
                <option>Sort by: Newest</option>
                <option>Sort by: Price (Low to High)</option>
                <option>Sort by: Price (High to Low)</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white/5 border border-dashed border-white/10 rounded-3xl">
              <p className="text-white/40 text-lg mb-2">No fragrances found</p>
              <button onClick={() => router.push(pathname)} className="text-amber-500 hover:underline text-sm">Clear all filters</button>
            </div>
          ) : (
            <div className={`grid gap-3 sm:gap-4 md:gap-6 ${sidebarOpen
              ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
              }`}>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={mapProductToCard(product)}
                  isFavorite={favoriteIds.includes(product.id)}
                  onToggleFavorite={() => handleToggleFavorite(product.id)}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-8 sm:mt-12 flex justify-center">
              <Pagination
                page={currentPage}
                total={totalPages}
                onChange={(p) => updateSearchParam({ page: p })}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}