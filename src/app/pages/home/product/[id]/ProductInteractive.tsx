"use client";
import { useState } from "react";
import { useCart } from "../../../../components/context/CartContext";

interface Product {
  id: number;
  name: string;
  brand: string;
  sizes: Record<string, number>;
  description: string;
  gallery: Record<string, string[]>;
}

interface Props {
  product: Product;
}

export default function ProductInteractive({ product }: Props) {
  const initialSize = Object.keys(product.sizes)[0];
  const [selectedSize, setSelectedSize] = useState(initialSize);
  const [quantity, setQuantity] = useState(1);
  const [descOpen, setDescOpen] = useState(true);

  const { addToCart, toggleFavorite, favorites } = useCart();

  const price = product.sizes[selectedSize];
  const image = product.gallery[selectedSize][0];

  const isFavorite = favorites.includes(product.id);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price,
      scent: "",
      image,        // ← أهم نقطة! لازم يبقى موجود علشان CartContext يقبله
    });
  };

  return (
    <>
      <p className="text-4xl font-bold mt-2">${price}</p>

      {/* Size Selector */}
      <div className="mt-4">
        <p className="text-sm mb-2">Size</p>
        <div className="flex gap-2">
          {Object.keys(product.sizes).map(size => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-4 py-2 border rounded-md text-sm transition-all ${
                selectedSize === size
                  ? "bg-white text-[#2b0004] font-semibold border-white"
                  : "border-gray-500 bg-transparent text-white hover:border-white"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div className="flex items-center gap-3 mt-6">
        <p className="text-sm">Quantity</p>
        <div className="flex items-center border border-gray-500 rounded-md">
          <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
            className="px-3 py-1 text-lg hover:bg-white/10 transition">
            -
          </button>
          <span className="px-4 text-sm">{quantity}</span>
          <button onClick={() => setQuantity(q => q + 1)}
            className="px-3 py-1 text-lg hover:bg-white/10 transition">
            +
          </button>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3 mt-8">
        <button
          onClick={handleAddToCart}
          className="bg-orange-500 text-black px-10 py-3 rounded-xl font-semibold hover:bg-orange-600 transition flex items-center gap-2 shadow-lg shadow-orange-500/30"
        >
          Add to Cart
        </button>

        <button
          onClick={() => toggleFavorite(product.id)}
          className={`border border-gray-600 w-12 h-12 rounded-xl flex items-center justify-center text-xl hover:bg-white/10 transition ${
            isFavorite ? "bg-white text-red-500" : ""
          }`}
        >
          ❤️
        </button>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-600 mt-8"></div>

      {/* Description */}
      <div className="mt-4">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setDescOpen(!descOpen)}
        >
          <p className="font-semibold">Description</p>
          <span>{descOpen ? "▲" : "▼"}</span>
        </div>
        {descOpen && (
          <p className="text-gray-200 text-sm mt-3">{product.description}</p>
        )}
        </div>
    </>
  );
}
