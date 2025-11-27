export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export type AddCartItemInput = Omit<CartItem, "quantity"> & {
  quantity?: number;
};

export interface CartContextValue {
  cartItems: CartItem[];
  totalItems: number;
  subtotal: number;
  addToCart: (item: AddCartItemInput) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}
