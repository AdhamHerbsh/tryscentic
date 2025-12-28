"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, ArrowLeft } from "lucide-react";
import { InputField } from "./InputField";
import { createClient } from "@/lib/utils/supabase/client";
import { toast } from "sonner";
import styles from "@/assets/styles/login.module.css";
import Link from "next/link";

export default function ResetPasswordForm() {
    const supabase = createClient();
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get("code");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSessionValid, setIsSessionValid] = useState(false);
    const [verifying, setVerifying] = useState(true);

    // Exchange the code for a session
    useEffect(() => {
        const exchangeCode = async () => {
            if (!code) {
                setVerifying(false);
                // If no code and no session, this page is invalid for reset
                // Check if we already have a session (user might be logged in)
                const { data } = await supabase.auth.getSession();
                if (data.session) {
                    setIsSessionValid(true);
                }
                return;
            }

            try {
                const { error } = await supabase.auth.exchangeCodeForSession(code);
                if (error) {
                    toast.error("Invalid or expired reset link.");
                    console.error(error);
                } else {
                    setIsSessionValid(true);
                    // Remove code from URL to clean it up
                    router.replace("/reset-password");
                }
            } catch (err) {
                console.error("Error exchanging code:", err);
                toast.error("An error occurred verifying the link.");
            } finally {
                setVerifying(false);
            }
        };

        exchangeCode();
    }, [code, supabase, router]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        setIsLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password,
            });

            if (error) {
                toast.error(error.message);
                console.error(error);
            } else {
                toast.success("Password updated successfully!");
                router.push("/login");
            }
        } catch (error) {
            toast.error("Failed to update password.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (verifying) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    if (!isSessionValid) {
        return (
            <div className={styles.loginForm + ` rounded-3xl border-2 border-gray-300 p-8 shadow-2xl text-center`}>
                <h2 className="text-xl font-bold mb-4 text-red-500">Invalid Link</h2>
                <p className="mb-6 text-gray-500">
                    This password reset link is invalid or has expired. Please request a new one.
                </p>
                <Link
                    href="/forgot-password"
                    className="block w-full py-3 bg-black text-white rounded-lg font-bold hover:bg-[#511624] transition-all"
                >
                    Request New Link
                </Link>
            </div>
        )
    }

    return (
        <div className={styles.loginForm + ` rounded-3xl border-2 border-gray-300 p-8 shadow-2xl`}>
            <h2 className="text-2xl font-bold text-center mb-6">Set New Password</h2>

            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                <InputField
                    icon={<Lock size={16} />}
                    placeholder="New Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <InputField
                    icon={<Lock size={16} />}
                    placeholder="Confirm New Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button
                    type="submit"
                    disabled={isLoading}
                    className="block w-full py-4 bg-black text-white rounded-lg font-bold text-center 
                                   transition-all duration-200 shadow-md mt-2 hover:bg-[#511624] hover:shadow-lg hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Updating..." : "Update Password"}
                </button>

                <div className="text-center mt-4">
                    <Link
                        href="/login"
                        className="text-sm font-semibold text-gray-500 hover:text-black flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={16} /> Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
