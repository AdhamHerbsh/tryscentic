import VactionCard from "../components/ui/Cards/VactionCard";

// Main Products Grid Component
function CardsGrid() {
  const products = [
    {
      id: 1,
      title: "Chanel No. 5",
      image: "/assets/images/p-1.png",
      price: 145,
      rating: 1,
      bgColor: "bg-gray-100",
    },
    {
      id: 2,
      title: "Dior Sauvage",
      image: "/assets/images/p-2.png",
      price: 95,
      rating: 2,
      bgColor: "bg-amber-50",
    },
    {
      id: 3,
      title: "Creed Aventus",
      image: "/assets/images/p-3.png",
      price: 325,
      rating: 5,
      bgColor: "bg-gray-50",
    },
    {
      id: 4,
      title: "Jo Malone London",
      image: "/assets/images/p-4.png",
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
            <VactionCard
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

export default function NewReleases() {
  return (
    <section className="p-auto">
      <div className="text-center">
        <h1 className="text-6xl">New Releases</h1>
      </div>
      <CardsGrid />
    </section>
  );
}
