"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/utils/supabase/client";
import ProductCard from "@/components/ui/Cards/ProductCard";
import { Product } from "@/types/product";
import { toast } from "sonner";

export default function FavoritesSection() {
    const [favorites, setFavorites] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('favorites')
                .select('product:products(*)')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            console.log("Favorites fetched:", data);

            // Map the result to Product array
            // The query returns { product: { ... } } array
            const products = data
                ?.map((item: any) => item.product)
                .filter(Boolean) as Product[];

            setFavorites(products || []);
        } catch (error) {
            console.log("Error fetching favorites:", error);
            // toast.error("Failed to load favorites."); // Optional: Don't spam toasts on load
        } finally {
            setLoading(false);
        }
    };

    const handleUnfavorite = async (product: Product) => {
        // Optimistic UI update
        const previousFavorites = favorites;
        setFavorites(prev => prev.filter(p => p.id !== product.id));

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { error } = await supabase
                .from('favorites')
                .delete()
                .eq('user_id', user.id)
                .eq('product_id', product.id);

            if (error) throw error;
            toast.success("Removed from favorites");
        } catch (error) {
            console.log("Error removing favorite:", error);
            toast.error("Failed to remove favorite");
            setFavorites(previousFavorites); // Revert
        }
    };

    if (loading) {
        return (
            <section>
                <h2 className="text-xl font-semibold mb-6 text-white">My Favorites</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-80 bg-white/5 rounded-3xl" />
                    ))}
                </div>
            </section>
        );
    }

    if (favorites.length === 0) {
        return (
            <section>
                <h2 className="text-xl font-semibold mb-6 text-white">My Favorites</h2>
                <div className="flex flex-col items-center justify-center p-12 bg-white/5 rounded-3xl border border-white/10 text-center animate-in fade-in zoom-in-95 duration-500">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">❤️</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">No favorites yet</h3>
                    <p className="text-gray-400 max-w-sm">
                        Start exploring our collection and save your favorite scents here.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section>
            <h2 className="text-xl font-semibold mb-6 text-white">My Favorites</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {favorites.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        isFavorite={true}
                        onToggleFavorite={handleUnfavorite}
                    />
                ))}
            </div>
        </section>
    );
}
