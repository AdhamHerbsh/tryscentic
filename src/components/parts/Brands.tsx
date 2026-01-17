import { getPublicBrands } from "@/data-access/products";
import type { Brand } from "@/types/database";
import { readdir } from "fs/promises";
import { join } from "path";
import { cwd } from "process";
import BrandsSwiper from "./BrandsSwiper";

export default async function Brands() {
    const brands = (await getPublicBrands()) as Brand[] | null;

    if (!brands || brands.length === 0) return null;

    // Get list of existing brand images
    let brandImages: string[] = [];
    try {
        const brandsDir = join(cwd(), "public", "assets", "images", "brands");
        brandImages = await readdir(brandsDir);
    } catch (error) {
        brandImages = [];
    }

    // Helper to find image for a brand
    const getBrandImage = (brandName: string) => {
        const validExtensions = ['.svg', '.png', '.jpg', '.jpeg', '.webp'];
        const imageFile = brandImages.find(file => {
            const ext = '.' + file.split('.').pop()?.toLowerCase();
            const name = file.substring(0, file.lastIndexOf('.'));
            return name === brandName && validExtensions.includes(ext);
        });
        return imageFile ? `/assets/images/brands/${imageFile}` : null;
    };

    // Filter brands that have a matching logo
    const brandsWithLogos = brands.map(brand => ({
        ...brand,
        logoUrl: getBrandImage(brand.name)
    })).filter(brand => brand.logoUrl);

    if (brandsWithLogos.length === 0) return null;

    return (
        <section className="py-6 bg-linear-to-b from-secondary/5 to-primary/20">
            <div className="container mx-auto px-4">
                <div className="mb-8 text-center lg:mb-12">
                    <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">Shop By Brand</h2>
                    <p className="mt-4 text-lg">Shop by brand and find your favorite fragrance</p>
                </div>
                <BrandsSwiper brandsWithLogos={brandsWithLogos as any} />
            </div>
        </section>
    );
}
