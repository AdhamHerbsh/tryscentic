import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPendingOrders,
  getActiveOrders,
  verifyOrder,
  updateOrderStatus,
} from "@/data-access/admin/orders";
import { toast } from "sonner";

// Query Keys
export const orderKeys = {
  all: ["orders"] as const,
  pending: () => [...orderKeys.all, "pending"] as const,
  active: () => [...orderKeys.all, "active"] as const,
};

// Hooks
export function usePendingOrders() {
  return useQuery({
    queryKey: orderKeys.pending(),
    queryFn: getPendingOrders,
  });
}

export function useActiveOrders() {
  return useQuery({
    queryKey: orderKeys.active(),
    queryFn: getActiveOrders,
  });
}

export function useVerifyOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      action,
    }: {
      orderId: string;
      action: "approve" | "reject";
    }) => verifyOrder(orderId, action),
    onSuccess: (_, { action }) => {
      toast.success(`Order ${action}d successfully`);
      // Invalidate both pending and active orders
      queryClient.invalidateQueries({ queryKey: orderKeys.pending() });
      queryClient.invalidateQueries({ queryKey: orderKeys.active() });
    },
    onError: (error) => {
      toast.error("Failed to update order");
      console.error(error);
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ order_id, status }: { order_id: string; status: string }) =>
      updateOrderStatus({ order_id, status: status as any }),
    onSuccess: (_, { status }) => {
      toast.success(`Order status updated to ${status}`);
      queryClient.invalidateQueries({ queryKey: orderKeys.active() });
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });
}
