import { getPublicProducts, getPublicBrands, getPublicCategories } from '@/data-access/products';
import { getFavoriteProductIds } from "@/data-access/user/favorites";
import Products from "@/components/parts/Products";
import { Suspense } from 'react';
import { Loader } from 'lucide-react';

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

  // Fetch all data on the server
  const [productsData, brands, categories, favoriteIds] = await Promise.all([
    getPublicProducts({
      search: query,
      page,
      limit: 12,
      brand_id,
      category_id,
    }),
    getPublicBrands(),
    getPublicCategories(),
    getFavoriteProductIds(),
  ]);

  return (
    <main className="container mx-auto min-h-screen">
      <Suspense fallback={
        <div className="flex items-center justify-center py-40">
          <Loader className="animate-spin text-amber-500 w-10 h-10" />
        </div>
      }>
        <Products
          products={productsData.products}
          totalCount={productsData.total}
          totalPages={productsData.totalPages}
          brands={brands}
          categories={categories}
          favoriteIds={favoriteIds}
        />
      </Suspense>
    </main>
  );
}
