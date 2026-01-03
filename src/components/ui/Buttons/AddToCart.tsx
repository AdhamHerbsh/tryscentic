"use client";
// import styles from "./buttons.module.css";
import { useCart } from "@/lib/context/CartContext";
import type { ProductDetail, ProductSizeOption } from "@/types";
import { toast } from "sonner";

type Props = {
  product: ProductDetail;
  sizes: ProductSizeOption;
  quantity: number;
};

export default function ButtonAddToCart({ product, sizes, quantity }: Props) {
  const { addToCart } = useCart();

  const isOutOfStock = sizes.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addToCart({
      id: sizes.id,
      name: `${product.name} (${sizes.label})`,
      price: sizes.price,
      image: product.baseImage,
      quantity: quantity,
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isOutOfStock}
      className={`btn py-3 rounded-md font-semibold transition ${isOutOfStock
        ? "bg-gray-500/20 text-white/40 cursor-not-allowed border-white/5"
        : "bg-secondary hover:bg-transparent hover:text-white"
        }`}
    >
      {isOutOfStock ? "Out of Stock" : "Add to Cart"}
    </button>
  );
}
