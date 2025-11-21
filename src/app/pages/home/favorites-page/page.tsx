// src/app/pages/home/favorites-page/page.tsx
"use client";

import Header from "../../../components/layout/Header";
import Footer from "../../../components/layout/Footer";
import { useCart } from "../../../components/context/CartContext";
import ProductCard from "../../home/shop-page/ProductCard";
import { allProducts } from "../data/products";

export default function FavoritesPage() {
  const { favorites, addToCart, toggleFavorite } = useCart();

  const favoriteProducts = allProducts.filter(p => favorites.includes(p.id));

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#360000] text-white pt-24 px-4">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              favorites={favorites}
              addToCart={addToCart}
              toggleFavorite={toggleFavorite}
            />
          ))}
          {favoriteProducts.length === 0 && (
            <p className="col-span-full text-center text-white font-bold mt-10">
              No favorites yet
            </p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
