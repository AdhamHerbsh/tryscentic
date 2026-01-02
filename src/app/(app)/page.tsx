import Hero from "../../components/parts/Hero";
import Posters from "../../components/parts/Posters";
import NewReleases from "../../components/parts/NewReleases";
import FAQ from "../../components/parts/FAQ";
import Brands from "../../components/parts/Brands";
import { getPublicBrands } from "../../data-access/products";
import type { Brand } from "@/types/database";
import { readdir } from "fs/promises";
import { join } from "path";
import { cwd } from "process";

export default async function Home() {
  const brands = (await getPublicBrands()) as Brand[] | null;

  // Get list of existing brand images
  let brandImages: string[] = [];
  try {
    const brandsDir = join(cwd(), "public", "assets", "images", "brands");
    brandImages = await readdir(brandsDir);
  } catch (error) {
    brandImages = [];
  }

  return (
    <>
      <Hero kind="index" />
      {brands && <Brands brands={brands} existingImages={brandImages} />}
      <Posters />
      <NewReleases />
      <FAQ />
    </>
  );
}
