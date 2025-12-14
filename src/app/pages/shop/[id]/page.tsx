"use client";

import { useParams } from "next/navigation";
import ProductDetials from "@/app/parts/ProductDetials";
import { productCatalog } from "@/app/data/productCatalog";

const defaultProductSlug = "velvet-shadow";

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const slug = params?.id?.toLowerCase() ?? defaultProductSlug;
  const product = productCatalog[slug] ?? productCatalog[defaultProductSlug];

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Fragrances", href: "/pages/shop" },
  ];

  return (
    <>
      <ProductDetials product={product} breadcrumbs={breadcrumbs} />
    </>
  );
}

