"use client";

import ProductCard from "@/components/ui/Cards/ProductCard";
import { Product } from "@/types/database";
import { toggleFavorite } from "@/data-access/user/favorites";
import { toast } from "sonner";
import { useState } from "react";

interface RelatedProductsProps {
    products: Product[];
    favoriteIds: string[];
}

export default function RelatedProducts({ products, favoriteIds: initialFavoriteIds }: RelatedProductsProps) {
    const [favoriteIds, setFavoriteIds] = useState<string[]>(initialFavoriteIds);

    const handleToggleFavorite = async (productId: string) => {
        try {
            const isFav = favoriteIds.includes(productId);
            setFavoriteIds(prev => isFav ? prev.filter(id => id !== productId) : [...prev, productId]);
            const newStatus = await toggleFavorite(productId);
            if (newStatus !== !isFav) {
                setFavoriteIds(prev => newStatus ? [...prev, productId] : prev.filter(id => id !== productId));
            }
            toast.success(newStatus ? "Added to favorites" : "Removed from favorites");
        } catch {
            toast.error("Please login to manage favorites");
            setFavoriteIds(initialFavoriteIds);
        }
    };

    const mapProductToCard = (p: Product) => {
        const sortedVariants = p.variants ? [...p.variants].sort((a, b) => a.price - b.price) : [];
        const chosenVariant = sortedVariants.find(v => v.stock_quantity > 0) || sortedVariants[0];
        const minPrice = chosenVariant?.price || 0;
        const inStock = p.variants?.some(v => v.stock_quantity > 0);

        return {
            id: p.id,
            variantId: chosenVariant?.id,
            title: p.title,
            brand: p.brand?.name || "Brand",
            price: minPrice,
            image: p.base_image_url || "/placeholder.jpg",
            category: p.category?.name || "Category",
            inStock
        };
    };

    if (products.length === 0) return null;

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-12 bg-white/2">
            <div className="mx-auto">
                <div className="mb-10">
                    <h2 className="text-3xl font-bold font-serif text-white tracking-wide">You Might Also Like</h2>
                    <div className="mt-2 h-1 w-20 bg-secondary rounded-full" />
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={mapProductToCard(product)}
                            isFavorite={favoriteIds.includes(product.id)}
                            onToggleFavorite={() => handleToggleFavorite(product.id)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
