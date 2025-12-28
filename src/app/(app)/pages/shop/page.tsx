'use client';

import { useState, useEffect } from "react";
import Sidebar from "@/components/ui/Sidebars/Sidebar";
import ProductCard from "@/components/ui/Cards/ProductCard";
import Pagination from "@/components/ui/Pagination/Pagination";
import { getPublicProducts, getPublicBrands, getPublicCategories } from '@/data-access/products';
import { Product, Brand, Category } from '@/types/database';
import { Loader } from "lucide-react";

import { toast } from "sonner";
import { getFavoriteProductIds, toggleFavorite } from "@/data-access/user/favorites";

export default function ShopPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filters, setFilters] = useState({
    brand_id: '',
    category_id: '',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Parallel fetch for initial load (brands/cats only needed once ideally, but simple here)
        const [productsData, brandsData, categoriesData, favData] = await Promise.all([
          getPublicProducts({
            search: query,
            page,
            limit: 12,
            ...filters
          }),
          getPublicBrands(),
          getPublicCategories(),
          getFavoriteProductIds(),
        ]);

        setProducts(productsData.products);
        setTotalPages(productsData.totalPages);
        setTotalCount(productsData.total); // assuming getPublicProducts returns total count
        setBrands(brandsData);
        setCategories(categoriesData);
        setFavoriteIds(favData);

      } catch (err) {
        console.error("Unexpected error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [page, query, filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  // Helper to map DB Product to UI Product for ProductCard
  // Assuming ProductCard expects simple flat object. 
  // If ProductCard accepts strict types, we might need adjustments.
  const mapProductToCard = (p: Product) => {
    const minPrice = p.variants?.length ? Math.min(...p.variants.map(v => v.price)) : 0;
    const inStock = p.variants?.some(v => v.stock_quantity > 0);

    return {
      id: p.id,
      title: p.title,
      // ProductCard likely expects string or object for brand? Products.tsx mapped 'item.brand'
      // If DB has brand_id relation, 'p.brand' is an object { name, ... }.
      // If ProductCard expects string: p.brand?.name. If object: p.brand.
      // I'll assume object for now based on relation, or name. 
      // Safest is to check Products.tsx mapping: `brand: item.brand`. item was raw DB.
      // Let's pass the whole brand object if possible, or constructs a string.
      brand: p.brand?.name || "Brand",
      price: minPrice,
      image: p.base_image_url || "/placeholder.jpg",
      category: p.category?.name || "Category",
      inStock
    };
  };

  return (
    <section className="pt-5 relative min-h-screen">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed bottom-6 right-6 z-50 bg-[#511624] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-[#511624]/90 transition-all text-sm sm:text-base"
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

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`grid transition-all duration-300 gap-4 lg:gap-8 ${sidebarOpen ? "grid-cols-1 lg:grid-cols-4" : "grid-cols-1"}`}>
        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full w-[280px] sm:w-[320px] lg:w-[340px] z-50 transition-transform duration-300 ease-in-out bg-[#1A1A1A] ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } ${/* Use fixed position always active for transition but hidden via transform */ ""}`}
        >
          {/* We only render Sidebar content if needed or always keep it mounted but hidden? 
              Products.tsx conditionally rendered <aside>.
              But transition on mount is tricky. Products.tsx had: {sidebarOpen && <aside...>}
              To animate slide-in, it should be mounted or use AnimatePresence.
              I will stick to Products.tsx logic exactly.
          */}
          <Sidebar
            type="shop"
            onSearch={(q: string) => {
              setQuery(q);
              setPage(1);
            }}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            // Dynamic Props I added
            brands={brands}
            categories={categories}
            selectedBrand={filters.brand_id}
            selectedCategory={filters.category_id}
            onFilterChange={handleFilterChange}
          />
        </aside>

        {/* Products Section */}
        <div className={`pt-20 px-4 sm:px-6 py-8 transition-all duration-300 ${sidebarOpen ? "lg:col-start-2 lg:col-span-3" : "col-span-1"}`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="text-sm sm:text-base text-gray-200">
              {/* totalCount check */}
              Showing {Math.min((page - 1) * 12 + 1, totalCount)} -{" "}
              {Math.min(page * 12, totalCount)} of {totalCount}{" "}
              results
            </div>
            <div>
              <select className="border border-gray-300 px-3 sm:px-4 py-2 rounded-md shadow-sm text-sm sm:text-base focus:ring-2 focus:ring-[#511624]">
                <option>Sort by: Popularity</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <div className={`grid gap-3 sm:gap-4 md:gap-6 ${sidebarOpen
            ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-3"
            : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            }`}>
            {loading ? (
              <div className="col-span-full flex justify-center py-20">
                <Loader className="animate-spin text-[#511624] w-8 h-8" />
              </div>
            ) : products.length === 0 ? (
              <div className="col-span-full text-center py-20 text-gray-500">
                No products found.
              </div>
            ) : (
              products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={mapProductToCard(product)}
                  isFavorite={favoriteIds.includes(product.id)}
                  onToggleFavorite={async () => {
                    try {
                      const newStatus = await toggleFavorite(product.id);
                      setFavoriteIds(prev =>
                        newStatus
                          ? [...prev, product.id]
                          : prev.filter(id => id !== product.id)
                      );
                      if (newStatus) toast.success("Added to favorites");
                      else toast.success("Removed from favorites");
                    } catch {
                      toast.error("Please login to manage favorites");
                      throw new Error("Failed"); // Rethrow for ProductCard
                    }
                  }}
                />
              ))
            )}
          </div>

          <div className="mt-8 sm:mt-12 flex justify-center">
            {totalPages > 1 && (
              <Pagination
                page={page}
                total={totalPages}
                onChange={setPage}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
