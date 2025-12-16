import Link from "next/link";
import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import styles from "@/assets/styles/login.module.css";
import { InputField } from "./InputField";
import { createClient } from "@/lib/utils/supabase/client";


export default function LoginForm() {

    const supabase = createClient();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        alert(email + " " + password);

        try {

            const { data, error } = await supabase.auth.signInWithPassword(
                {
                    email: email,
                    password: password
                }
            );

            console.log(JSON.stringify(data));
            console.log(JSON.stringify(error));

        } catch (error) {
            console.log(error);
        }

    }

    return (
        <>
            {/* Main Container */}
            <div className="">
                {/* Logo */}
                <div className="mb-8">
                    <h1
                        className={styles.brandTitle}>
                        TRYSCENTIC
                    </h1>
                </div>
                {/* Login Card */}
                <div className={styles.loginForm + ` rounded-3xl border-2 border-gray-300 p-8 shadow-2xl`}>
                    {/* Google Sign In Button */}
                    <LoginLink
                        authUrlParams={{
                            connection_id: process.env.NEXT_PUBLIC_KINDE_CONNECTION_GOOGLE || '' // Common ID, but might vary. If it fails, Kinde ignores it usually.
                        }}
                        className="mb-4 w-full flex items-center gap-5 justify-center rounded-lg bg-white px-6 py-3 font-semibold text-gray-800 shadow-md transition-transform hover:scale-105 hover:shadow-lg"
                    >
                        <FcGoogle size={20} />
                        Continue with Google
                    </LoginLink>

                    {/* Divider */}
                    <div className="relative flex justify-center my-5">
                        <span className="bg-white rounded-full px-4 text-lg text-black">
                            or
                        </span>
                    </div>
                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                        {/* Email Input */}
                        <InputField
                            icon={<Mail size={16} />}
                            placeholder="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        {/* Password Input - Visual Only for now as Kinde handles secure auth */}
                        <InputField
                            icon={<Lock size={16} />}
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {/* Login Button */}
                        {/* Equivalent to .signUpButton: w-full, padding, bg/color, rounded-lg, styling */}
                        <button
                            type="submit"
                            className="block w-full py-4 bg-black text-white rounded-lg font-bold text-center 
                                   transition-all duration-200 shadow-md mt-2 hover:bg-[#511624] hover:shadow-lg hover:-translate-y-px"
                        >
                            Login
                        </button>


                        {/* Sign Up Button */}
                        <Link
                            href='/register'
                            className="block w-full py-4 bg-white text-gray-700 border border-gray-300 rounded-lg font-semibold text-center 
                                   transition-all duration-200 shadow-sm mt-2 hover:bg-gray-50 hover:shadow-md hover:-translate-y-px"
                        >
                            Sign Up
                        </Link>

                        {/* Forget Password Link */}
                        <div className="mb-6">
                            <Link
                                href="#forgot"
                                className="hover:underline"
                            >
                                Forget Password?
                            </Link>
                        </div>
                    </form>

                    {/* Terms and Privacy */}
                    <p className="text-center text-sm">
                        By creating an account you agree with our
                        <br />
                        <Link href="/terms" className="text-cyan-400 hover:underline">
                            Terms of Service
                        </Link>
                        {" "}&{" "}
                        <Link
                            href="/privacy"
                            className="text-cyan-400 hover:underline"
                        >
                            Privacy Policy
                        </Link>
                    </p>
                </div>
            </div>

        </>
    )
}



