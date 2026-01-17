"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HeroSettingsSchema, HeroSettingsValues } from "@/lib/validation/settings-schemas";
import { updateSiteSettings, uploadAssetAction } from "@/actions/settings-actions";
import { compressImage } from "@/lib/utils/image-compression";
import { toast } from "sonner";
import { Loader2, Upload, ImageIcon } from "lucide-react";
import Image from "next/image";

interface HeroFormProps {
    initialData?: HeroSettingsValues;
}

export default function HeroForm({ initialData }: HeroFormProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(initialData?.backgroundImageUrl || "");

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<HeroSettingsValues>({
        resolver: zodResolver(HeroSettingsSchema),
        defaultValues: initialData || {
            title: "",
            subtitle: "",
            backgroundImageUrl: "",
        },
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            const compressed = await compressImage(file);

            const formData = new FormData();
            formData.append("file", compressed);
            formData.append("category", "hero");

            const result = await uploadAssetAction(formData);

            if (result.success && result.url) {
                setValue("backgroundImageUrl", result.url);
                setPreview(result.url);
                toast.success("Image uploaded successfully");
            } else {
                toast.error(result.error || "Upload failed");
            }
        } catch (error) {
            toast.error("Failed to process image");
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = async (data: HeroSettingsValues) => {
        try {
            await updateSiteSettings("hero_section", data);
            toast.success("Hero settings updated");
        } catch (error) {
            toast.error("Failed to update settings");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-white">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Hero Title</label>
                    <input
                        {...register("title")}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-amber-500 outline-none"
                        placeholder="Enter hero title"
                    />
                    {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Subtitle</label>
                    <input
                        {...register("subtitle")}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-amber-500 outline-none"
                        placeholder="Enter subtitle"
                    />
                    {errors.subtitle && <p className="text-red-400 text-sm mt-1">{errors.subtitle.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Background Image</label>
                    <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-amber-500 transition-colors relative group">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            disabled={uploading}
                        />

                        {preview ? (
                            <div className="relative aspect-video w-full max-w-md mx-auto overflow-hidden rounded-lg">
                                <Image
                                    src={preview}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <p className="text-white font-medium flex items-center gap-2">
                                        <ImageIcon size={20} />
                                        key to change
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <Upload className="text-gray-400" size={32} />
                                <p className="text-sm text-gray-400">Click or drag image to upload</p>
                                <p className="text-xs text-gray-500">Max size 1MB (auto-compressed)</p>
                            </div>
                        )}

                        {uploading && (
                            <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20 rounded-lg">
                                <Loader2 className="animate-spin text-amber-500" size={30} />
                            </div>
                        )}
                    </div>
                    {errors.backgroundImageUrl && <p className="text-red-400 text-sm mt-1">{errors.backgroundImageUrl.message}</p>}
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting || uploading}
                className="px-6 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
            >
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "Save Changes"}
            </button>
        </form>
    );
}
