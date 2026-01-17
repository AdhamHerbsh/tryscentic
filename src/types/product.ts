export interface Product {
  id: string; // This is the Product ID
  variantId?: string; // This is the default/lowest-price variant ID for the cart
  title: string;
  brand: string;
  price: number;
  image: string;
  category?: string;
  inStock?: boolean;
}

export interface ProductSizeOption {
  id: string; // The Variant UUID from the database
  label: string;
  color?: string;
  price: number;
  stock: number;
  images?: string[];
  thumbnail?: string | null;
}

export interface ProductReview {
  author: string;
  rating: number;
  content: string;
  date?: string;
}

export interface ProductDetail {
  id: string;
  name: string;
  type: string;
  baseDescription: string;
  baseImage: string;
  images: string[];
  sizes: ProductSizeOption[];
  rating: number;
  reviewCount: number;
  reviews: ProductReview[];
  category?: string;
  brand?: string;
  inStock?: boolean;
}

export type ProductCatalog = Record<string, ProductDetail>;
