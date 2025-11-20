import Image from "next/image";
import { ShoppingCart, Star } from "lucide-react";

interface ProductCardProps {
  image: string;
  title: string;
  price: number;
  rating: number;
  bgColor?: string;
}

// Product Card Component
function ProductCardd({ image, title, price, rating }: ProductCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl">
      {/* Product Image Container */}
      <div className="relative overflow-hidden">
        <Image
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
          src={image}
          alt="Perfume"
          width={100}
          height={100}
          unoptimized
        />

        {/* Add to Cart Button */}
        <button className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-orange-600 hover:shadow-xl">
          <ShoppingCart className="h-5 w-5" />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h2>{title}</h2>
        {/* Price */}
        <p className="mb-2 font-bold text-gray-400">${price}</p>

        {/* Rating Stars */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              className={`h-4 w-4 ${
                index < rating
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

// Main Products Grid Component
export default function PerfumeProductsGrid() {
  const products = [
    {
      id: 1,
      title: "Chanel No. 5",
      image: "assets/images/p-1.png",
      price: 145,
      rating: 1,
      bgColor: "bg-gray-100",
    },
    {
      id: 2,
      title: "Dior Sauvage",
      image: "assets/images/p-2.png",
      price: 95,
      rating: 2,
      bgColor: "bg-amber-50",
    },
    {
      id: 3,
      title: "Creed Aventus",
      image: "assets/images/p-3.png",
      price: 325,
      rating: 5,
      bgColor: "bg-gray-50",
    },
    {
      id: 4,
      title: "Jo Malone London",
      image: "assets/images/p-4.png",
      price: 112,
      rating: 4,
      bgColor: "bg-gray-100",
    },
  ];

  return (
    <section className="py-12 px-4 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-3/4">
        {/* Section Header (Optional) */}
        <div className="mb-8 text-center lg:mb-12">
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Featured Fragrances
          </h2>
          <p className="mt-4 text-lg">
            Discover our most popular signature scents
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              title={product.title}
              image={product.image}
              price={product.price}
              rating={product.rating}
              bgColor={product.bgColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
