"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart } from "lucide-react";
import { useCart } from "@/lib/context/CartContext";
import styles from "./cards.module.css";
import type { Product } from "@/types/product";



export default function ProductCard({ product }: { product: Product }) {
  const [liked, setLiked] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.title,
      price: product.price,
      image: product.image,
    });
  };

  return (
    <article
      className={
        styles.card +
        ` rounded-lg p-2 sm:p-3 shadow-card hover:cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 `
      }
    >


      {/* Aspect Ratio Wrapper for Responsive Image */}
      <div className="rounded-md mb-2 sm:mb-4 relative aspect-square">
        {/* Ensure the parent element is relatively positioned for `fill` to work */}
        <Link href={`/pages/shop/${product.id}`}>

          <Image
            src={product.image}
            alt={product.title}
            fill
            style={{ objectFit: "cover" }} // Use objectFit for better image control
          />
        </Link>
      </div>

      <h4 className="text-white font-semibold mb-1 text-sm sm:text-base line-clamp-1">{product.title}</h4>
      <div className="text-white/70 text-xs mb-2 sm:mb-4">{product.brand}</div>
      <div className="text-white font-bold mb-2 sm:mb-4 text-sm sm:text-base">
        ${product.price.toFixed(2)}
      </div>

      <div className="flex gap-2 sm:gap-3">
        <button
          onClick={handleAddToCart}
          className="flex-3 btn py-2 sm:py-3 rounded-md font-semibold bg-secondary hover:bg-accent transition text-xs sm:text-sm"
        >
          Add to Cart
        </button>
        <button
          onClick={() => setLiked((v) => !v)}
          className="flex-1btn rounded-md bg-white flex items-center justify-center p-2 sm:p-3"
        >
          {liked ? (
            <Heart fill="red" className="text-red-600 w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <Heart className="text-black w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </button>
      </div>
    </article>
  );
}
