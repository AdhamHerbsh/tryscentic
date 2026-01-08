"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type AddCartItemInput = Omit<CartItem, "quantity"> & {
  quantity?: number;
};

type CartContextValue = {
  cartItems: CartItem[];
  totalItems: number;
  subtotal: number;
  isInitialized: boolean;
  addToCart: (item: AddCartItemInput) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "tryscentic_cart_items";
const initialCart: CartItem[] = [];

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Initialize with empty array to match server-side rendering
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCart);

  // Flag to track if we've loaded from storage to prevent overwriting with empty
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CartItem[];
        if (Array.isArray(parsed)) {
          const validItems = parsed.filter(
            (item) =>
              typeof item.id === "string" &&
              typeof item.name === "string" &&
              typeof item.price === "number" &&
              typeof item.image === "string" &&
              typeof item.quantity === "number" &&
              item.quantity > 0
          );
          setCartItems(validItems);
        }
      }
    } catch (e) {
      console.error("Failed to load cart from storage", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to local storage whenever cartItems changes
  useEffect(() => {
    if (!isInitialized || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Ignore write errors
    }
  }, [cartItems, isInitialized]);

  const totals = useMemo(() => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    return { totalItems, subtotal };
  }, [cartItems]);

  const addToCart = (item: AddCartItemInput) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id
            ? {
              ...i,
              quantity: i.quantity + (item.quantity ?? 1),
            }
            : i
        );
      }

      return [
        ...prev,
        {
          ...item,
          quantity: item.quantity ?? 1,
        },
      ];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems: totals.totalItems,
        subtotal: totals.subtotal,
        isInitialized,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
