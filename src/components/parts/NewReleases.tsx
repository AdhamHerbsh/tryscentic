"use client";
import { useEffect, useState } from "react";
import NewReleaseCard from "@/components/ui/Cards/NewReleaseCard";
import { createClient } from "@/lib/utils/supabase/client";
import SimpleLoader from "@/components/shared/SimpleLoader";

// Define Product type locally or import if available
interface Product {
  id: string;
  title: string;
  image: string;
  price: number;
  rating: number;
  in_stock: boolean;
}

export default function CardsGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Mock data to fall back on if DB is empty (for demo purposes)
  const fallbackProducts = [
    {
      id: "1",
      title: "Chanel No. 5",
      image: "/assets/images/p-1.png",
      price: 145,
      rating: 5,
    },
    {
      id: "2",
      title: "Dior Sauvage",
      image: "/assets/images/p-2.png",
      price: 95,
      rating: 4,
    },
    {
      id: "3",
      title: "Creed Aventus",
      image: "/assets/images/p-3.png",
      price: 325,
      rating: 5,
    },
    {
      id: "4",
      title: "Jo Malone London",
      image: "/assets/images/p-4.png",
      price: 112,
      rating: 4,
    }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*, variants:product_variants(*)")
          .limit(4)
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const mapped = data.map(p => {
            const variant = p.variants?.sort((a: any, b: any) => a.price - b.price)[0];
            return {
              id: variant?.id || p.id,
              title: p.title,
              image: p.base_image_url || "/placeholder.jpg",
              price: variant?.price || 0,
              rating: p.rating || 5,
              in_stock: p.variants?.some((v: any) => v.stock_quantity > 0)
            };
          });
          setProducts(mapped as any);
        } else {
          // Use fallback if no products found in DB
          setProducts(fallbackProducts as any);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        // Fallback on error too
        setProducts(fallbackProducts as any);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [supabase]);

  // if (loading) {
  //   return <div className="py-20 flex justify-center"><SimpleLoader /></div>;
  // }

  return (
    <section id="new-releases" className="py-12 px-4 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-3/4">
        <div className="mb-8 text-center lg:mb-12">
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">Featured Fragrances</h2>
          <p className="mt-4 text-lg">Discover our most popular signature scents</p>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {fallbackProducts.map((product) => (
            <NewReleaseCard
              key={product.id}
              id={product.id}
              title={product.title}
              image={product.image}
              price={product.price}
              rating={product.rating || 5} // Default to 5 stars if not set
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function NewReleases() {
  return (
    <section className="p-auto">
      <div className="text-center">
        <h1 className="text-6xl font-bold mt-10">New Releases</h1>
      </div>
      <CardsGrid />
    </section>
  );
}
