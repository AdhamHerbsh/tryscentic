"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { Product } from "../../../components/context/CartContext";
import { useRouter } from "next/navigation";
import React from "react";

interface ProductCardProps {
  product: Product;
  favorites: number[];
  addToCart: (product: Product) => void;
  toggleFavorite: (id: number) => void;
}

function ProductCardComponent({ product, favorites, addToCart, toggleFavorite }: ProductCardProps) {
  const router = useRouter();
  const isFavorite = Array.isArray(favorites) && favorites.includes(product.id);

  if (!product) return null;

  return (
    <div
      className="bg-white/20 backdrop-blur-md p-4 rounded-xl flex flex-col shadow-xl border border-transparent hover:border-[#FEEA00]/50 transition duration-300 cursor-pointer"
    >
      <div
        className="w-full h-48 relative mb-3 rounded-md overflow-hidden bg-white/5"
        onClick={() => router.push(`/pages/home/product/${product.id}`)}
      >
        <Image
          src={product.image || "/placeholder.png"}
          alt={product.name || "Product Image"}
          fill
          className="object-cover"
          loading="lazy"
          unoptimized
        />
      </div>

      <h3 className="font-semibold text-lg text-white">{product.name}</h3>
      <p className="text-sm text-gray-300">{product.brand}</p>
      <p className="font-bold text-xl text-white mb-3">${product.price}</p>

      <div className="flex gap-2 mt-auto">
        <button
          onClick={(e) => { e.stopPropagation(); addToCart(product); }}
          className="bg-[#F79A20] text-black px-3 py-2 rounded-md font-bold hover:bg-amber-700 transition"
        >
          Add to Cart
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
          className={`w-12 rounded-lg flex items-center justify-center text-xl transition shadow-md ${
            isFavorite ? "text-red-500 bg-white" : "text-white bg-[#A60030] hover:bg-[#800020]"
          }`}
        >
          <Heart />
        </button>
      </div>
    </div>
  );
}

// React.memo لمنع إعادة الرندر غير الضرورية
export default React.memo(ProductCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.favorites === nextProps.favorites
  );
});
