"use client";
import React, { useState } from "react";
import Link from "next/link";
import { User, Mail, Lock, RotateCcw } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

import { InputField } from "./InputField";
import { createClient } from "@/lib/utils/supabase/client";
// from register.module.css, but replacing form structure/styling with Tailwind.
import styles from "@/assets/styles/register.module.css";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
// ... imports

export const RegisterForm: React.FC = () => {
    const supabase = createClient();
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/`,
                },
            });
            if (error) {
                toast.error(error.message);
            }
        } catch (error) {
            toast.error("An error occurred with Google login");
            console.error(error);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        setIsLoading(true);

        try {
            const { error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        name: name,
                    }
                }
            });

            if (error) {
                toast.error(error.message);
                console.error(error);
            } else {
                toast.success("Registration successful! Check your email to confirm.");
                // Optionally redirect or wait for verification
                router.push('/login');
            }
        } catch (error) {
            toast.error("Registration failed. Please try again.");
            console.error("Registration failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // ... container
        <div className={styles.registerForm + ` relative w-full rounded-xl flex items-center justify-center overflow-hidden`}>
            {/* Equivalent to .formContent: relative, z-20, w-full, padding, flex, flex-col, center content */}
            <div className="w-full p-8 sm:p-8 flex flex-col justify-center items-center">
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                    <InputField
                        icon={<User size={16} />}
                        placeholder="Name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <InputField
                        icon={<Mail size={16} />}
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <InputField
                        icon={<Lock size={16} />}
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputField
                        icon={<RotateCcw size={16} />}
                        placeholder="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    {/* Equivalent to .divider, .dividerLine, .dividerText */}
                    <div className="flex items-center my-1">
                        <hr className="w-1/2 border-t border-gray-400" />
                        <span className="mx-2 text-sm text-white">or</span>
                        <hr className="w-1/2 border-t border-gray-400" />
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="mb-4 w-full flex items-center gap-5 justify-center rounded-lg bg-white px-6 py-3 font-semibold text-gray-800 shadow-md transition-transform hover:scale-105 hover:shadow-lg">
                        <FcGoogle size={20} />
                        Continue with Google
                    </button>


                    {/* Sign Up Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="block w-full py-4 bg-black text-white rounded-lg font-bold text-center transition-all duration-200 shadow-md mt-2 hover:bg-[#511624] hover:shadow-lg hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed">
                        {isLoading ? "Signing Up..." : "Sign Up"}
                    </button>

                    {/* Equivalent to .loginButton: w-full, padding, bg/color, rounded-lg, styling */}
                    <Link href="/login" className="block w-full py-4 bg-white text-gray-700 border border-gray-300 rounded-lg font-bold text-center transition-all duration-200 shadow-sm mt-2 hover:bg-gray-50 hover:shadow-md hover:-translate-y-px">
                        Login
                    </Link>
                    {/* Equivalent to .forgotPassword, .forgotPasswordLink */}
                    <div className="text-center mt-1">
                        <Link href="/forgot-password" className="hover:underline">
                            Forgot Password?
                        </Link>
                    </div>
                </form>

                {/* Equivalent to .termsText, .termsLink */}
                <p className="text-center mt-2 text-sm">
                    By creating an account you agree with our
                    <br />
                    <Link href="/terms" className="text-secondary hover:underline">
                        Terms
                    </Link>
                    {"  "}&{"   "}
                    <Link href="/privacy" className="text-secondary hover:underline">
                        Privacy Policy
                    </Link>
                </p>
            </div>
        </div>
    );
};