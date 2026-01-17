"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SocialsSettingsSchema, SocialsSettingsValues } from "@/lib/validation/settings-schemas";
import { updateSiteSettings } from "@/actions/settings-actions";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";

interface SocialsFormProps {
    initialData?: SocialsSettingsValues;
}

export default function SocialsForm({ initialData }: SocialsFormProps) {
    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SocialsSettingsValues>({
        resolver: zodResolver(SocialsSettingsSchema),
        defaultValues: initialData || {
            links: [
                { platform: "Instagram", url: "" },
                { platform: "Facebook", url: "" },
                { platform: "TikTok", url: "" },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "links",
    });

    const onSubmit = async (data: SocialsSettingsValues) => {
        try {
            await updateSiteSettings("social_settings", data);
            toast.success("Social links updated");
        } catch (error) {
            toast.error("Failed to update settings");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-white">
            <div className="space-y-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-4 items-start bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                        <div className="flex-1 space-y-2">
                            <input
                                {...register(`links.${index}.platform`)}
                                placeholder="Platform Name (e.g. Instagram)"
                                className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white outline-none focus:ring-1 focus:ring-amber-500"
                            />
                            {errors.links?.[index]?.platform && (
                                <p className="text-red-400 text-xs">{errors.links[index]?.platform?.message}</p>
                            )}
                        </div>

                        <div className="flex-2 w-full space-y-2">
                            <input
                                {...register(`links.${index}.url`)}
                                placeholder="URL (https://...)"
                                className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white outline-none focus:ring-1 focus:ring-amber-500"
                            />
                            {errors.links?.[index]?.url && (
                                <p className="text-red-400 text-xs">{errors.links[index]?.url?.message}</p>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-gray-400 hover:text-red-400 p-2"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={() => append({ platform: "", url: "" })}
                    className="flex items-center gap-2 text-sm text-amber-500 hover:text-amber-400"
                >
                    <Plus size={16} />
                    Add Social Link
                </button>
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
