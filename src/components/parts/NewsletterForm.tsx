"use client";

import { useState } from "react";
import { subscribeNewsletter } from "@/actions/contact-actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function NewsletterForm() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async () => {
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        try {
            setLoading(true);
            const result = await subscribeNewsletter(email);
            if (result.success) {
                toast.success(result.message);
                setEmail("");
            }
        } catch (error) {
            toast.error("Failed to subscribe. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex">
            <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="flex-1 rounded-l-md bg-white px-4 py-2.5 text-sm text-black placeholder-gray-500 outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-70"
            />
            <button
                onClick={handleSubscribe}
                disabled={loading}
                className="rounded-r-md bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-70 flex items-center justify-center min-w-[100px]"
            >
                {loading ? <Loader2 className="animate-spin" size={18} /> : "Subscribe"}
            </button>
        </div>
    );
}
