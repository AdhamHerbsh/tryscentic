"use client";

export type ProductReview = {
  author: string;
  rating: number;
  content: string;
};

export type ProductSizeOption = {
  label: string;
  price: number;
};

export type ProductDetail = {
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
};

export const productCatalog: Record<string, ProductDetail> = {
  "velvet-shadow": {
    id: "velvet-shadow",
    name: "Velvet Shadow",
    type: "Eau de Parfum",
    baseDescription:
      "A mysterious and alluring fragrance that captures the essence of a moonlit walk through a secret garden. Velvet Shadow opens with notes of bergamot and pink pepper, leading to a heart of jasmine and iris, and settling into a warm base of sandalwood and vanilla.",
    baseImage:
      "/assets/images/beautinow-niche-perfume-k1X05CSCybE-unsplash.jpg",
    images: [
      "/assets/images/beautinow-niche-perfume-k1X05CSCybE-unsplash.jpg",
      "/assets/images/beautinow-niche-perfume-0sHorINihAI-unsplash.jpg",
      "/assets/images/darklammur-oRgeDVPL1ks-unsplash.jpg",
      "/assets/images/laura-chouette-4sKdeIMiFEI-unsplash.jpg",
    ],
    sizes: [
      { label: "50ml", price: 250 },
      { label: "100ml", price: 370 },
    ],
    rating: 3.5,
    reviewCount: 12,
    reviews: [
      {
        author: "Olivia R.",
        rating: 5,
        content:
          "Absolutely divine! The scent is long-lasting and I get so many compliments. It's my new signature fragrance.",
      },
      {
        author: "James T.",
        rating: 4,
        content:
          "A very sophisticated and elegant scent. Perfect for evening wear. The packaging is also beautiful.",
      },
    ],
  },
};

