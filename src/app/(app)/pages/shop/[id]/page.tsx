import { getProductById, getPublicProducts } from "@/data-access/products";
import { isProductFavorite, getFavoriteProductIds } from "@/data-access/user/favorites";
import ProductDetials from "@/components/parts/ProductDetials";
import RelatedProducts from "@/components/parts/RelatedProducts";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {

  const { id } = await params;

  try {
    const product = await getProductById(id);

    if (!product || !product.is_active) {
      notFound();
    }

    // Fetch related products (same category, excluding current product)
    const { products: relatedProductsData } = await getPublicProducts({
      category_id: product.category_id || undefined,
      limit: 6,
    });

    const relatedProducts = relatedProductsData.filter(p => p.id !== id).slice(0, 5);
    const favoriteIds = await getFavoriteProductIds();

    // Map Database Product to ProductDetail UI Type
    const mappedProduct = {
      id: product.id,
      name: product.title,
      type: product.brand?.name || product.category?.name || "Eau de Parfum",
      baseImage: product.base_image_url || "",
      images: product.gallery_images || [],
      sizes:
        product.variants?.map((v) => ({
          id: v.id,
          label: v.size_label,
          color: v.color || undefined,
          price: v.price,
          stock: v.stock_quantity,
          thumbnail: v.thumbnail_image,
          images: v.images?.map((img: any) => img.image_url) || [],
        })) || [],
      baseDescription: product.description || "",
      rating: product.rating || 5.0, // Default if 0
      reviewCount: product.review_count || 0,
      reviews: [], // TODO: Fetch real reviews
    };

    const breadcrumbs = [
      { label: "Home", href: "/" },
      { label: "Shop", href: "/pages/shop" },
      {
        label: product.brand?.name || "Brand",
        href: `/pages/shop?brand_id=${product.brand_id}`,
      },
    ];

    const isFavorite = favoriteIds.includes(id);

    return (
      <main className="container mx-auto">

        <ProductDetials
          product={mappedProduct as any}
          breadcrumbs={breadcrumbs}
          isFavorite={isFavorite}
        />

        <RelatedProducts
          products={relatedProducts}
          favoriteIds={favoriteIds}
        />

      </main>);
  } catch (error) {
    console.error("Failed to load product:", error);
    notFound();
  }
}
