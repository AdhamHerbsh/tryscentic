"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import { InputField } from "./InputField";
import { createClient } from "@/lib/utils/supabase/client";
import { toast } from "sonner";
import styles from "@/assets/styles/login.module.css";

export default function ForgotPasswordForm() {
    const supabase = createClient();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) {
                toast.error(error.message);
                console.error(error);
            } else {
                toast.success("Password reset link sent to your email!");
                setIsSent(true);
            }
        } catch (error) {
            toast.error("Failed to send reset email.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.loginForm + ` rounded-3xl border-2 border-gray-300 p-8 shadow-2xl`}>
            <h2 className="text-2xl font-bold text-center mb-2">Reset Password</h2>
            <p className="text-center text-gray-500 mb-6 text-sm">
                Enter your email address and we'll send you a link to reset your password.
            </p>

            {isSent ? (
                <div className="text-center">
                    <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4">
                        Check your email! Included is a link to reset your password.
                    </div>
                    <Link
                        href="/login"
                        className="text-sm font-semibold text-gray-700 hover:text-black flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={16} /> Back to Login
                    </Link>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                    <InputField
                        icon={<Mail size={16} />}
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="block w-full py-4 bg-black text-white rounded-lg font-bold text-center 
                                   transition-all duration-200 shadow-md mt-2 hover:bg-[#511624] hover:shadow-lg hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Sending..." : "Send Reset Link"}
                    </button>

                    <div className="text-center mt-4">
                        <Link
                            href="/login"
                            className="text-sm font-semibold text-gray-500 hover:text-black flex items-center justify-center gap-2"
                        >
                            <ArrowLeft size={16} /> Back to Login
                        </Link>
                    </div>
                </form>
            )}
        </div>
    );
}
