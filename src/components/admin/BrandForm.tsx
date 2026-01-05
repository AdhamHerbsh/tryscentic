"use client";

import { useState, useEffect } from "react";
import { createBrandAction, updateBrandAction } from "@/actions/brand-actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Upload, Save, Link as LinkIcon, Tag, Globe } from "lucide-react";
import { InputField } from "@/components/ui/Forms/InputField";
import { Brand } from "@/types/database";
import { compressImage } from "@/lib/utils/image-compression";
import Image from "next/image";

interface BrandFormProps {
    brand?: Brand;
}

export default function BrandForm({ brand }: BrandFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(brand?.name || "");
    const [slug, setSlug] = useState(brand?.slug || "");
    const [manualSlug, setManualSlug] = useState(!!brand);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [compressing, setCompressing] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [originalSize, setOriginalSize] = useState<number | null>(null);
    const [compressedSize, setCompressedSize] = useState<number | null>(null);

    // Auto-generate slug from name unless manually edited
    useEffect(() => {
        if (!manualSlug) {
            const generatedSlug = name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");
            setSlug(generatedSlug);
        }
    }, [name, manualSlug]);

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSlug(e.target.value);
        setManualSlug(true);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setOriginalSize(file.size);
        setCompressing(true);

        // Preview original or loading state
        const reader = new FileReader();
        reader.onload = (event) => {
            setPreview(event.target?.result as string);
        };
        reader.readAsDataURL(file);

        try {
            const compressed = await compressImage(file);
            setLogoFile(compressed);
            setCompressedSize(compressed.size);

            // Update preview with compressed one (WebP)
            const compressedReader = new FileReader();
            compressedReader.onload = (event) => {
                setPreview(event.target?.result as string);
            };
            compressedReader.readAsDataURL(compressed);

            const savedPercent = Math.round(((file.size - compressed.size) / file.size) * 100);
            if (savedPercent > 0) {
                toast.success(`Image compressed! Saved ${savedPercent}% size.`);
            }
        } catch (error) {
            console.error("Compression failed:", error);
            setLogoFile(file);
            toast.error("Compression failed, using original file.");
        } finally {
            setCompressing(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData(e.currentTarget);

            // Override logo with compressed file if exists
            if (logoFile) {
                formData.set("logo", logoFile);
            }

            let result;

            if (brand) {
                result = await updateBrandAction(brand.id, null, formData);
            } else {
                result = await createBrandAction(null, formData);
            }

            if (result.success) {
                toast.success(brand ? "Brand updated successfully" : "Brand created successfully");
                router.push("/dashboard/brands");
            } else {
                toast.error(result.message);
            }
        } catch (error: any) {
            toast.error("An unexpected error occurred" + error.message.split("\n")[0]);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-lg mx-auto">
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Brand Name *
                    </label>
                    <InputField
                        icon={<Tag size={18} className="text-[#511624]" />}
                        type="text"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Chanel"
                        required
                        className="bg-gray-50 border-gray-200 focus:bg-white transition-all"
                    />
                </div>

                <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <LinkIcon size={14} className="text-gray-400" />
                        Brand Slug *
                    </label>
                    <InputField
                        icon={<Globe size={18} className="text-white" />}
                        type="text"
                        name="slug"
                        value={slug}
                        onChange={handleSlugChange}
                        placeholder="brand-slug"
                        required
                        disabled
                        className="bg-gray-50 border-gray-200 focus:bg-white transition-all font-mono text-xs"
                    />
                    <p className="mt-1 text-[10px] text-gray-400">The URL-friendly version of the name. Must be unique.</p>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Brand Logo {brand ? "(Leave empty to keep current)" : "*"}
                    </label>
                    <div className="group relative border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-[#511624]/30 hover:bg-[#511624]/5 transition-all cursor-pointer overflow-hidden">
                        <input
                            type="file"
                            name="logo"
                            id="logo-upload"
                            accept=".svg,.png,.jpg,.jpeg,.webp"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            required={!brand && !logoFile}
                        />

                        {preview ? (
                            <div className="space-y-4">
                                <div className="relative mx-auto w-32 h-32 bg-gray-50 rounded-lg p-2 flex items-center justify-center border border-gray-100">
                                    <Image
                                        src={preview}
                                        alt="Logo preview"
                                        fill
                                        className="object-contain p-2"
                                    />
                                    {compressing && (
                                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[1px]">
                                            <Loader2 className="animate-spin text-[#511624]" size={24} />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                                        {compressing ? "Optimizing..." : "Preview Ready"}
                                    </span>
                                    {originalSize && compressedSize && !compressing && (
                                        <div className="flex items-center justify-center gap-3 text-[10px]">
                                            <span className="text-gray-400 line-through">{(originalSize / 1024).toFixed(1)} KB</span>
                                            <span className="bg-[#511624]/10 text-[#511624] px-1.5 py-0.5 rounded font-bold">
                                                {(compressedSize / 1024).toFixed(1)} KB
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="mx-auto h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-[#511624]/20 group-hover:text-[#511624] transition-colors">
                                    <Upload size={24} />
                                </div>
                                <span className="text-sm font-medium text-gray-600 block">
                                    {brand ? "Click to change logo" : "Click or drag logo here"}
                                </span>
                                <span className="text-xs text-gray-400 block">SVG, PNG, JPG (Optimized to WebP)</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-[#511624] text-white rounded-xl hover:bg-[#511624]/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-lg shadow-[#511624]/20"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        {brand ? "Update Brand" : "Save Brand"}
                    </button>
                </div>
            </div>
        </form>
    );
}


