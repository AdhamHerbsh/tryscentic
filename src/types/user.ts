export interface User {
  id: string;
  name: string;
  bio: string;
  email: string;
  avatar_url?: string;
  walletBalance?: number;
}

export interface Order {
  id: string;
  date: string;
  status: "processing" | "delivered" | "cancelled";
  total: number;
  items: OrderItem[];
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface PromoCode {
  code: string;
  description: string;
  expiresAt: string;
  discount: number;
  type: "percentage" | "fixed";
}
