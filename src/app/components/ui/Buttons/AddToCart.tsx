"use client";
// import styles from "./buttons.module.css";
import { useCart } from "../../../parts/CartContext";
import type {
  ProductDetail,
  ProductSizeOption,
} from "../../../data/productDetails";

type Props = {
  product: ProductDetail;
  sizes: ProductSizeOption;
  quantity: number;
};

export default function ButtonAddToCart({ product, sizes, quantity }: Props) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: `${product.id}-${sizes.label}`,
      name: `${product.name} (${sizes.label})`,
      price: sizes.price,
      image: product.baseImage,
      quantity: quantity,
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      className="btn py-3 rounded-md font-semibold bg-secondary hover:bg-transparent hover:text-white transition"
    >
      Add to Cart
    </button>
  );
}
