"use client";

import { useParams } from "next/navigation";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import ProductDetials from "../../../parts/ProductDetials";
import { productCatalog } from "../../../data/productDetails";

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
      <Header />

      <ProductDetials product={product} breadcrumbs={breadcrumbs} />

      <Footer />
    </>
  );
}
