"use client";
import { useState, useEffect } from "react";
import { X, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface UserData {
    full_name: string;
    bio: string;
    avatar_url: string;
    phone: string;
}

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserData;
    onSave: (data: UserData) => Promise<void>;
}

export default function EditProfileModal({
    isOpen,
    onClose,
    user,
    onSave,
}: EditProfileModalProps) {
    const [formData, setFormData] = useState<UserData>({
        full_name: "",
        bio: "",
        avatar_url: "",
        phone: "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name || "",
                bio: user.bio || "",
                avatar_url: user.avatar_url || "",
                phone: user.phone || "",
            });
        }
    }, [user, isOpen]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateEgyptianPhone = (num: string) => {
        // Matches +201xxxxxxxxx or 01xxxxxxxxx where x is [0-9] and the third digit is 0, 1, 2, or 5
        const regex = /^(?:\+201|01)[0125]\d{8}$/;
        return regex.test(num.replace(/\s/g, ''));
    };

    const formatEgyptianPhone = (num: string) => {
        let clean = num.replace(/\D/g, '');
        if (clean.startsWith('20')) return '+' + clean;
        if (clean.startsWith('0')) return '+20' + clean.slice(1);
        return '+20' + clean;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Basic Validation
        if (!formData.full_name.trim()) {
            toast.error("Name is required");
            setLoading(false);
            return;
        }

        if (formData.phone && !validateEgyptianPhone(formData.phone)) {
            toast.error("Please enter a valid Egyptian phone number");
            setLoading(false);
            return;
        }

        try {
            const dataToSave = {
                ...formData,
                phone: formData.phone ? formatEgyptianPhone(formData.phone) : "",
            };
            await onSave(dataToSave);
            toast.success("Profile updated successfully!");
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl transform transition-all animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 p-6">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                        Edit Profile
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        <X className="h-5 w-5 text-zinc-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label
                            htmlFor="full_name"
                            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                        >
                            Full Name
                        </label>
                        <input
                            id="full_name"
                            name="full_name"
                            type="text"
                            value={formData.full_name}
                            onChange={handleChange}
                            placeholder="e.g. John Doe"
                            className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="phone"
                            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                        >
                            Phone Number
                        </label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+20 101 234 5678"
                            className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="avatar_url"
                            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                        >
                            Profile Picture URL
                        </label>
                        <input
                            id="avatar_url"
                            name="avatar_url"
                            type="text"
                            value={formData.avatar_url}
                            onChange={handleChange}
                            placeholder="https://example.com/avatar.jpg"
                            className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="bio"
                            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                        >
                            Bio
                        </label>
                        <textarea
                            id="bio"
                            name="bio"
                            rows={2}
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Tell us a little about yourself..."
                            className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-none"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
