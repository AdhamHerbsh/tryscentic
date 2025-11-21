"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  scent: string;
  image: string;
}

interface CartContextType {
  cart: Product[];
  favorites: number[];
  cartCount: number;
  favoritesCount: number;
  addToCart: (product: Product) => void;
  toggleFavorite: (id: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    const storedFavs = localStorage.getItem("favorites");
    if (storedCart) setCart(JSON.parse(storedCart));
    if (storedFavs) setFavorites(JSON.parse(storedFavs));
  }, []);

  // Save cart & favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [cart, favorites]);

  const addToCart = (product: Product) => setCart(prev => [...prev, product]);

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  return (
    <CartContext.Provider value={{
      cart,
      favorites,
      cartCount: cart.length,
      favoritesCount: favorites.length,
      addToCart,
      toggleFavorite
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
