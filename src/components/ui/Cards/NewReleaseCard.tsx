import Image from "next/image";
import { ShoppingCart, Star } from "lucide-react";

import { useCart } from "@/lib/context/CartContext";
import { toast } from "sonner";

interface ProductCardProps {
  id: string;
  image: string;
  title: string;
  price: number;
  rating: number;
  bgColor?: string;
}

// Vocation Card Component
export default function NewReleaseCard({
  id,
  image,
  title,
  price,
  rating,
}: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id,
      name: title,
      price,
      image,
      quantity: 1,
    });
    toast.success(`${title} added to cart!`);
  };
  return (
    <div className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl">
      {/* Product Image Container */}
      <div className="relative overflow-hidden">
        <Image
          src={image || ""}
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
          alt="Perfume"
          width={100}
          height={100}
          unoptimized
        />

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-4 right-4 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-orange-500 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-orange-600 hover:shadow-xl active:scale-95"
        >
          <ShoppingCart className="h-5 w-5" />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h2>{title}</h2>
        {/* Price */}
        <p className="mb-2 font-bold text-gray-400">LE {price}</p>

        {/* Rating Stars */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              className={`h-4 w-4 ${index < rating
                ? "fill-orange-400 text-orange-400"
                : "fill-gray-300 text-gray-300"
                }`}
            />
          ))}
          {rating}
        </div>
      </div>
    </div>
  );
}
