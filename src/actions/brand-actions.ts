"use server";

import { createBrand } from "@/data-access/admin/products";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { cwd } from "process";

export async function createBrandAction(prevState: any, formData: FormData) {
    try {
        const name = formData.get("name") as string;
        const file = formData.get("logo") as File;

        if (!name || name.length < 2) {
            return { success: false, message: "Brand name must be at least 2 characters" };
        }

        // 1. Create Brand in Database
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

        // Check if brand exists or handle potential duplicate error? 
        // The data access layer will throw if it fails, likely due to unique constraint if slug exists.
        // For now we trust createBrand to handle DB interactions.

        const brand = await createBrand({ name, slug });

        // 2. Save Logo if provided
        if (file && file.size > 0) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const extension = file.name.split(".").pop()?.toLowerCase() || "svg";

            // Enforce checking if it's an image? Basic extension check sufficient for admin.

            // Use the BRAND NAME as the filename to match the user's requirement
            // "show them like you do the images shown be the brand name"
            const fileName = `${name}.${extension}`;

            const brandsDir = join(cwd(), "public", "assets", "images", "brands");

            // Ensure directory exists
            await mkdir(brandsDir, { recursive: true });

            await writeFile(join(brandsDir, fileName), buffer);
        }

        revalidatePath("/dashboard/brands");
        revalidatePath("/"); // Update homepage

        return { success: true, message: "Brand created successfully" };
    } catch (error: any) {
        console.error("Failed to create brand:", error);
        return { success: false, message: error.message || "Failed to create brand" };
    }
}
