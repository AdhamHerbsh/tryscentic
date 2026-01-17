import { getPublicProducts, getPublicBrands, getPublicCategories } from '@/data-access/products';
import { getFavoriteProductIds } from "@/data-access/user/favorites";
import Products from "@/components/parts/Products";

export const dynamic = 'force-dynamic';

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const query = (params.q as string) || "";
  const page = Number(params.page) || 1;
  const brand_id = (params.brand_id as string) || "";
  const category_id = (params.category_id as string) || "";
  const min_price = params.min_price ? Number(params.min_price) : undefined;
  const max_price = params.max_price ? Number(params.max_price) : undefined;

  // Fetch all data on the server
  const [productsData, brands, categories, favoriteIds] = await Promise.all([
    getPublicProducts({
      search: query,
      page,
      limit: 12,
      brand_id,
      category_id,
      min_price,
      max_price,
    }),
    getPublicBrands(),
    getPublicCategories(),
    getFavoriteProductIds(),
  ]);

  return (
    <main className="container mx-auto min-h-screen px-2 lg:px-6">
      <Products
        products={productsData.products}
        totalCount={productsData.total}
        totalPages={productsData.totalPages}
        brands={brands}
        categories={categories}
        favoriteIds={favoriteIds}
      />
    </main>
  );
}
