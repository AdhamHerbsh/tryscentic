import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  return (
    <>
      {/* Background Image with Overlay */}
      <div
        className="bg-img h-screen bg-center text-center items-center content-center"
        style={{
          backgroundImage: `url('/assets/images/logo/logo-icon-1200x1200.png')`,
        }}
      >
        <div className="container mx-auto">
          <div className="p-5">
            <div className="flex items-center justify-center p-4">
              {/* Main Container */}
              <div className="">
                {/* Logo */}
                <div className="mb-8">
                  <h1
                    data-aos="slide-up"
                    className="text-5xl font-serif font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-white to-amber-800 sm:text-6xl md:text-7xl"
                  >
                    TRYSCENTIC
                  </h1>
                </div>
                {/* Login Card */}
                <div className="rounded-3xl border-2 border-gray-300  p-8 shadow-2xl">
                  {/* Google Sign In Button */}
                  <button className="mb-4 w-full flex items-center gap-5 justify-center rounded-lg bg-white px-6 py-3 font-semibold text-gray-800 shadow-md transition-transform hover:scale-105 hover:shadow-lg">
                    <FcGoogle size={20} />
                    Continue with Google
                  </button>

                  {/* Divider */}
                  <div className="relative flex justify-center my-5">
                    <span className="bg-white rounded-full px-4 text-lg text-black">
                      or
                    </span>
                  </div>

                  <form action="">
                    {/* Email Input */}
                    <div className="mb-4">
                      <div className="flex items-center gap-3 rounded-lg border-2 border-gray-600 bg-white px-5 py-3 transition-all focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          placeholder="Email"
                          className="bg-transparent text-gray-800 placeholder-gray-400 outline-none"
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div className="mb-2">
                      <div className="flex items-center gap-3 rounded-lg border-2 border-gray-600 bg-white px-5 py-3 transition-all focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500">
                        <Lock className="h-5 w-5 text-gray-400" />
                        <input
                          type="password"
                          placeholder="Password"
                          className="bg-transparent text-gray-800 placeholder-gray-400 outline-none"
                        />
                      </div>
                    </div>

                    {/* Forget Password Link */}
                    <div className="mb-6">
                      <a
                        href="#forgot"
                        className="text-sm text-gray-400 transition-colors hover:text-white"
                      >
                        Forget Password?
                      </a>
                    </div>

                    {/* Login Button */}
                    <Link
                      href="/"
                      className="block mb-3 w-full rounded-lg bg-black py-3 font-semibold text-white shadow-lg transition-all hover:bg-gray-900 hover:shadow-xl"
                    >
                      Login
                    </Link>

                    {/* Sign Up Button */}
                    <Link
                      href="/auth/register"
                      className="block mb-6 rounded-lg border-2 border-white bg-white py-3 font-semibold text-gray-800 shadow-md transition-all hover:bg-gray-100 hover:shadow-lg"
                    >
                      Sign Up
                    </Link>
                  </form>

                  {/* Terms and Privacy */}
                  <p className="text-center text-xs text-gray-400">
                    By creating an account you agree with our{" "}
                    <a href="#terms" className="text-cyan-400 hover:underline">
                      Terms of Service
                    </a>{" "}
                    <a
                      href="#privacy"
                      className="text-cyan-400 hover:underline"
                    >
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
