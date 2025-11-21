// src/app/pages/home/shop-page/page.tsx
"use client";

import { useState, useMemo } from "react";
import Header from "../../../components/layout/Header";
import Footer from "../../../components/layout/Footer";
import { CartProvider, useCart } from "../../../components/context/CartContext";
import ProductCard from "./ProductCard";
import { allProducts, Product } from "../data/products";

const brandsList = ["Chanel", "Dior", "Gucci", "Tom Ford", "Giorgio Armani", "Versace"];
const scentTypesList = ["Floral", "Woody", "Citrus", "Spicy"];
const perPage = 6;

interface FilterBadgeProps {
  value: string;
  isSelected: boolean;
  onClick: () => void;
}
const FilterBadge = ({ value, isSelected, onClick }: FilterBadgeProps) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-full font-semibold transition ${isSelected ? "bg-[#F79A20] text-black" : "bg-white/20 text-white hover:bg-white/30"}`}
  >
    {value}
  </button>
);

function ShopDashboard() {
  const [brandOpen, setBrandOpen] = useState(false);
  const [scentOpen, setScentOpen] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedScents, setSelectedScents] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState<number>(250);
  const [appliedPrice, setAppliedPrice] = useState<number>(250);
  const [page, setPage] = useState<number>(1);

  const { addToCart, favorites, toggleFavorite } = useCart();

  const toggleBrand = (brand: string) =>
    setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
  const toggleScent = (scent: string) =>
    setSelectedScents(prev => prev.includes(scent) ? prev.filter(s => s !== scent) : [...prev, scent]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter(p =>
      (selectedBrands.length === 0 || selectedBrands.includes(p.brand)) &&
      (selectedScents.length === 0 || selectedScents.includes(p.scent)) &&
      p.price <= appliedPrice
    );
  }, [selectedBrands, selectedScents, appliedPrice]);

  const paginated = filteredProducts.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filteredProducts.length / perPage);

  const handleClearAll = () => {
    setSelectedBrands([]);
    setSelectedScents([]);
    setPriceFilter(250);
    setAppliedPrice(250);
  };

  return (
    <div className="min-h-screen bg-[#360000] text-white pt-24 px-4 mb-9">
      <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-6">

        {/* Filters */}
        <aside className="col-span-12 lg:col-span-3 bg-white/20 backdrop-blur-md p-6 rounded-xl shadow-2xl border-r border-white/20">
          <h2 className="text-2xl font-bold mb-6 border-b border-white/20 pb-4">Filters</h2>

          {/* Brand Accordion */}
          <div className="mb-6">
            <button
              onClick={() => setBrandOpen(prev => !prev)}
              className="flex justify-between items-center w-full text-white font-semibold text-lg mb-2"
            >
              Brand
              <span className={`transform transition-transform ${brandOpen ? "rotate-180" : "rotate-0"}`}>▼</span>
            </button>
            {brandOpen && (
              <div className="flex flex-col gap-2">
                {brandsList.map((b) => (
                  <button
                    key={b}
                    onClick={() => toggleBrand(b)}
                    className={`w-full py-2 rounded font-semibold text-white transition ${
                      selectedBrands.includes(b)
                        ? "bg-[#800020]" 
                        : "bg-[#4b0015] hover:bg-[#800020]"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Scent Accordion */}
          <div className="mb-6">
            <button
              onClick={() => setScentOpen(prev => !prev)}
              className="flex justify-between items-center w-full text-white font-semibold text-lg mb-2"
            >
              Scent Type
              <span className={`transform transition-transform ${scentOpen ? "rotate-180" : "rotate-0"}`}>▼</span>
            </button>
            {scentOpen && (
              <div className="flex flex-col gap-2">
                {scentTypesList.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleScent(s)}
                    className={`w-full py-2 rounded font-semibold text-white transition ${
                      selectedScents.includes(s)
                        ? "bg-[#800020]" 
                        : "bg-[#4b0015] hover:bg-[#800020]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Price */}
          <div className="mb-8 pt-4">
            <h3 className="font-semibold text-lg mb-4">Price Range</h3>
            <input
              type="range"
              min={50}
              max={250}
              value={priceFilter}
              onChange={(e) => {
                const value = Number(e.target.value);
                setPriceFilter(value);
                e.target.style.background = `linear-gradient(to right, #F79A20 ${(value - 50) / 2}%, white ${(value - 50) / 2}%)`;
              }}
              style={{
                background: `linear-gradient(to right, #F79A20 ${(priceFilter - 50) / 2}%, white ${(priceFilter - 50) / 2}%)`,
              }}
              className="w-full h-2 rounded-lg cursor-pointer appearance-none
                bg-white
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#F79A20]
                [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#F79A20]"
            />
            <div className="flex justify-between text-base mt-2 font-bold text-white">
              <span>$50</span>
              <span>${priceFilter}</span>
            </div>
          </div>

          <button
            onClick={() => setAppliedPrice(priceFilter)}
            className="w-full bg-[#F79A20] text-black py-3 rounded-lg font-extrabold hover:bg-amber-700 transition uppercase mb-3 shadow-lg"
          >
            Search
          </button>
          <button
            onClick={handleClearAll}
            className="w-full bg-white/10 py-3 rounded-lg text-sm hover:bg-white/20 transition font-medium"
          >
            Clear All
          </button>
        </aside>

        {/* Products */}
        <main className="col-span-12 lg:col-span-9">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                favorites={favorites}
                addToCart={addToCart}
                toggleFavorite={toggleFavorite}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6 gap-3">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded-md font-bold transition ${page === i + 1 ? "bg-[#F79A20] text-black" : "bg-white/20 text-white hover:bg-white/30"}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function ShopPageWrapper() {
  return (
    <CartProvider>
      <Header />
      <ShopDashboard />
      <Footer />
    </CartProvider>
  );
}
