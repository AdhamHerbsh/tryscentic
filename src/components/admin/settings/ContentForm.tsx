"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContentSettingsSchema, ContentSettingsValues } from "@/lib/validation/settings-schemas";
import { updateSiteSettings } from "@/actions/settings-actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ContentFormProps {
    initialData?: ContentSettingsValues;
}

export default function ContentForm({ initialData }: ContentFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ContentSettingsValues>({
        resolver: zodResolver(ContentSettingsSchema),
        defaultValues: initialData || {
            ourStory: "",
            disclaimer: "",
            privacyPolicy: "",
        },
    });

    const onSubmit = async (data: ContentSettingsValues) => {
        try {
            await updateSiteSettings("content_settings", data);
            toast.success("Content settings updated");
        } catch (error) {
            toast.error("Failed to update settings");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-white">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Our Story</label>
                    <textarea
                        {...register("ourStory")}
                        rows={6}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-amber-500 outline-none"
                        placeholder="Tell your brand's story..."
                    />
                    {errors.ourStory && <p className="text-red-400 text-sm mt-1">{errors.ourStory.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Disclaimer</label>
                    <textarea
                        {...register("disclaimer")}
                        rows={4}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-amber-500 outline-none"
                        placeholder="Website disclaimer..."
                    />
                    {errors.disclaimer && <p className="text-red-400 text-sm mt-1">{errors.disclaimer.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Privacy Policy Snippet</label>
                    <textarea
                        {...register("privacyPolicy")}
                        rows={4}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-amber-500 outline-none"
                        placeholder="Short privacy policy text or link..."
                    />
                    {errors.privacyPolicy && <p className="text-red-400 text-sm mt-1">{errors.privacyPolicy.message}</p>}
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
            >
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "Save Changes"}
            </button>
        </form>
    );
}
