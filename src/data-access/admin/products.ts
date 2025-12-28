"use server";

import { verifyAdmin, revalidateAdminPaths } from "./auth";
import type {
  Product,
  ProductVariant,
  Brand,
  Category,
} from "@/types/database";
import {
  createProductSchema,
  updateProductSchema,
  createBrandSchema,
  createCategorySchema,
} from "@/lib/validation/admin-schemas";

/**
 * Get all products with variants
 */
export async function getProducts(params?: {
  search?: string;
  page?: number;
  limit?: number;
  category_id?: string;
  brand_id?: string;
  is_active?: boolean;
}) {
  const { supabase } = await verifyAdmin();

  const {
    search = "",
    page = 1,
    limit = 20,
    category_id,
    brand_id,
    is_active,
  } = params || {};
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase.from("products").select(
    `
      *,
      brand:brands(*),
      category:categories(*),
      variants:product_variants(*)
    `,
    { count: "exact" }
  );

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  if (category_id) {
    query = query.eq("category_id", category_id);
  }

  if (brand_id) {
    query = query.eq("brand_id", brand_id);
  }

  if (is_active !== undefined) {
    query = query.eq("is_active", is_active);
  }

  query = query.order("created_at", { ascending: false }).range(from, to);

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`Failed to fetch products: ${error.message}`);
  }

  return {
    products: data as Product[],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

/**
 * Create a new product with variants
 */
export async function createProduct(input: {
  title: string;
  description: string;
  brand_id: string;
  category_id: string;
  base_image_url: string;
  gallery_images?: string[];
  variants: {
    size_label: string;
    price: number;
    stock_quantity: number;
  }[];
}) {
  const { supabase } = await verifyAdmin();

  const validatedInput = createProductSchema.parse(input);

  // Create product
  const { data: product, error: productError } = await supabase
    .from("products")
    .insert({
      title: validatedInput.title,
      description: validatedInput.description,
      brand_id: validatedInput.brand_id,
      category_id: validatedInput.category_id,
      base_image_url: validatedInput.base_image_url,
      gallery_images: validatedInput.gallery_images || [],
      is_active: true,
    })
    .select()
    .single();

  if (productError) {
    throw new Error(`Failed to create product: ${productError.message}`);
  }

  // Create variants
  const variantsToInsert = validatedInput.variants.map((v) => ({
    product_id: product.id,
    ...v,
  }));

  const { error: variantsError } = await supabase
    .from("product_variants")
    .insert(variantsToInsert);

  if (variantsError) {
    // Rollback product creation
    await supabase.from("products").delete().eq("id", product.id);
    throw new Error(`Failed to create variants: ${variantsError.message}`);
  }

  revalidateAdminPaths();

  return product;
}

/**
 * Update product and/or variants
 */
export async function updateProduct(input: {
  id: string;
  title: string;
  description: string;
  brand_id: string;
  category_id: string;
  base_image_url: string;
  gallery_images?: string[];
  variants: {
    id?: string;
    size_label: string;
    price: number;
    stock_quantity: number;
  }[];
  is_active?: boolean;
}) {
  const { supabase } = await verifyAdmin();

  // Validate input
  const validatedInput = updateProductSchema.parse(input);
  const { id, variants, ...updates } = validatedInput;

  // 1. Update Product Base Details
  const { error: productError } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id);

  if (productError) {
    throw new Error(`Failed to update product: ${productError.message}`);
  }

  // 2. Handle Variants
  // Strategy: Delete all existing variants for this product and re-insert/upsert.
  // Ideally, we matches IDs to update, but deleting and re-inserting is safer/easier
  // given we don't hold much state on variants other than ID/stock/price.
  // HOWEVER, deleting breaks order statistics if linked by ID.
  // SO: We must UPSERT.

  if (variants && variants.length > 0) {
    const variantsToUpsert = variants.map((v) => ({
      ...v,
      product_id: id,
      // Ensure ID is valid UUID if present, else let Postgres generate (via omit?)
      // If we pass undefined ID for new ones, we can't use upsert easily without excluding it.
      // But if we use 'id' as key, we need it.
      // Solution: Split into "Updates" and "Inserts" or just use separate calls.
    }));

    // Identify variants to keep (IDs present in input)
    const variantIdsToKeep = variants
      .map((v) => v.id)
      .filter((id): id is string => !!id);

    // Delete variants NOT in the input list
    if (variantIdsToKeep.length > 0) {
      await supabase
        .from("product_variants")
        .delete()
        .eq("product_id", id)
        .not("id", "in", `(${variantIdsToKeep.join(",")})`);
    } else {
      // If no IDs to keep, it implies all are new? Or we just cleared them?
      // But validation requires min 1.
      // If we are replacing all, we might delete all first.
      // Assuming if IDs exist we filter, if new ones don't have IDs.
    }

    // Upsert each variant
    for (const variant of variants) {
      if (variant.id) {
        // Update
        const { error: maxError } = await supabase
          .from("product_variants")
          .update({
            size_label: variant.size_label,
            price: variant.price,
            stock_quantity: variant.stock_quantity,
          })
          .eq("id", variant.id);
        if (maxError) throw maxError;
      } else {
        // Insert
        const { error: insertError } = await supabase
          .from("product_variants")
          .insert({
            product_id: id,
            size_label: variant.size_label,
            price: variant.price,
            stock_quantity: variant.stock_quantity,
          });
        if (insertError) throw insertError;
      }
    }
  }

  revalidateAdminPaths();

  return { success: true };
}

/**
 * Delete product (cascades to variants)
 */
export async function deleteProduct(productId: string) {
  const { supabase } = await verifyAdmin();

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) {
    throw new Error(`Failed to delete product: ${error.message}`);
  }

  revalidateAdminPaths();

  return { success: true };
}

/**
 * Update product variant stock
 */
export async function updateVariantStock(variantId: string, quantity: number) {
  const { supabase } = await verifyAdmin();

  if (quantity < 0) {
    throw new Error("Stock quantity cannot be negative");
  }

  const { error } = await supabase
    .from("product_variants")
    .update({ stock_quantity: quantity })
    .eq("id", variantId);

  if (error) {
    throw new Error(`Failed to update stock: ${error.message}`);
  }

  revalidateAdminPaths();

  return { success: true };
}

/**
 * Get low stock products (stock < 10)
 */
export async function getLowStockProducts() {
  const { supabase } = await verifyAdmin();

  const { data, error } = await supabase
    .from("product_variants")
    .select(
      `
      *,
      product:products(*)
    `
    )
    .lt("stock_quantity", 10)
    .order("stock_quantity", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch low stock products: ${error.message}`);
  }

  return data;
}

/**
 * Get all brands
 */
export async function getBrands() {
  const { supabase } = await verifyAdmin();

  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .order("name");

  if (error) {
    throw new Error(`Failed to fetch brands: ${error.message}`);
  }

  return data as Brand[];
}

/**
 * Create brand
 */
export async function createBrand(input: { name: string; slug: string }) {
  const { supabase } = await verifyAdmin();

  const validatedInput = createBrandSchema.parse(input);

  const { data, error } = await supabase
    .from("brands")
    .insert(validatedInput)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create brand: ${error.message}`);
  }

  revalidateAdminPaths();

  return data;
}

/**
 * Get all categories
 */
export async function getCategories() {
  const { supabase } = await verifyAdmin();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }

  return data as Category[];
}

/**
 * Create category
 */
export async function createCategory(input: {
  name: string;
  parent_id?: string | null;
}) {
  const { supabase } = await verifyAdmin();

  const validatedInput = createCategorySchema.parse(input);

  const { data, error } = await supabase
    .from("categories")
    .insert(validatedInput)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create category: ${error.message}`);
  }

  revalidateAdminPaths();

  return data;
}

/**
 * Get product by ID (admin)
 */
export async function getProductById(productId: string) {
  const { supabase } = await verifyAdmin();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      brand:brands(*),
      category:categories(*),
      variants:product_variants(*)
    `
    )
    .eq("id", productId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch product: ${error.message}`);
  }

  return data as Product;
}

/**
 * Toggle product active status
 */
export async function toggleProductStatus(
  productId: string,
  isActive: boolean
) {
  const { supabase } = await verifyAdmin();

  const { error } = await supabase
    .from("products")
    .update({ is_active: isActive })
    .eq("id", productId);

  if (error) {
    throw new Error(`Failed to update product status: ${error.message}`);
  }

  await revalidateAdminPaths();

  return { success: true };
}
