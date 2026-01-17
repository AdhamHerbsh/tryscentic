import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProducts,
  getBrands,
  getCategories,
  deleteProduct,
  toggleProductStatus,
} from "@/data-access/admin/products";
import { toast } from "sonner";

// Query Keys
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: any) => [...productKeys.lists(), filters] as const,
  brands: () => ["brands"] as const,
  categories: () => ["categories"] as const,
};

// Hooks
export function useProducts(filters: {
  search?: string;
  page?: number;
  limit?: number;
  brand_id?: string;
  category_id?: string;
  is_active?: boolean;
}) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => getProducts(filters),
  });
}

export function useBrands() {
  return useQuery({
    queryKey: productKeys.brands(),
    queryFn: getBrands,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: productKeys.categories(),
    queryFn: getCategories,
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      toast.success("Product deleted successfully");
      // Invalidate all product lists
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
    onError: (error) => {
      toast.error("Failed to delete product");
      console.error(error);
    },
  });
}

export function useToggleProductStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      newStatus,
    }: {
      productId: string;
      newStatus: boolean;
    }) => toggleProductStatus(productId, newStatus),
    onSuccess: (_, { newStatus }) => {
      toast.success(`Product ${newStatus ? "activated" : "deactivated"}`);
      // Invalidate all product lists
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
    onError: (error) => {
      toast.error("Failed to update status");
      console.error(error);
    },
  });
}
