"use client";

import { useState } from "react";
import { createBrandAction } from "@/actions/brand-actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Upload, Save } from "lucide-react";
import { InputField } from "@/components/ui/Forms/InputField";

export default function BrandForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData(e.currentTarget);
            const result = await createBrandAction(null, formData);

            if (result.success) {
                toast.success("Brand created successfully");
                router.push("/dashboard/brands");
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-lg">
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                        Brand Name *
                    </label>
                    <InputField
                        icon=""
                        type="text"
                        name="name"
                        placeholder="e.g. Chanel"
                        required
                        minLength={2}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                        Brand Logo *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                        <input
                            type="file"
                            name="logo"
                            id="logo-upload"
                            accept=".svg,.png,.jpg,.jpeg,.webp"
                            className="hidden"
                            required
                            onChange={(e) => {
                                // Optional: Preview logic could go here

                            }}
                        />
                        <label htmlFor="logo-upload" className="cursor-pointer block">
                            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-600 block">Click to upload logo</span>
                            <span className="text-xs text-gray-400 block mt-1">SVG, PNG, JPG (re-named to match brand)</span>
                        </label>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#511624] text-white rounded-lg hover:bg-[#511624]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    Save Brand
                </button>
            </div>
        </form>
    );
}
