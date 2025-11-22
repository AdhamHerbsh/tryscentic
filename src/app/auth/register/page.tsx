"use client";
import React, { useState, type ChangeEvent, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

interface InputFieldProps {
  icon: ReactNode;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  icon,
  placeholder,
  type = "text",
  value,
  onChange,
}) => (
  <div className="relative w-full">
    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#511624] pointer-events-none">
      {icon}
    </div>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
      className="w-full pl-10 pr-4 py-3 bg-white/90 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#511624] transition placeholder:text-gray-600 text-gray-900 text-sm shadow-inner text-center"
    />
  </div>
);

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email !== confirmEmail) {
      console.error("Emails do not match.");
      return;
    }
    console.log(`Registration attempted for: ${email}`);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#3D0B18] font-sans px-4">
      <div className="flex flex-col md:flex-row w-full max-w-7xl h-[95vh] items-center justify-center gap-6">
        {/* Left Section: Register Form */}
        <div className="relative w-full md:w-[30%] max-h-[90vh] rounded-xl shadow-xl flex items-center justify-center overflow-hidden">
          {/* Overlay background */}
          <div className="absolute inset-0 bg-white/30 backdrop-blur-sm rounded-xl"></div>

          {/* Form Content */}
          <div className="relative z-20 w-full p-6 flex flex-col justify-center items-center space-y-4 text-gray-900">
            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col space-y-4"
            >
              <InputField
                icon={<Mail size={16} />}
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <InputField
                icon={<Mail size={16} />}
                placeholder="Confirm Email"
                type="email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
              />
              <InputField
                icon={<Lock size={16} />}
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="flex items-center my-1">
                <hr className="flex-grow border-gray-400" />
                <span className="mx-2 text-gray-700 text-xs">or</span>
                <hr className="flex-grow border-gray-400" />
              </div>

              <button
                type="button"
                className="w-full py-2 flex items-center justify-center gap-2 bg-white text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium transition text-sm shadow"
              >
                <FcGoogle size={20} />
                Continue with Google
              </button>

              <div className="text-center text-xs mt-1">
                <a
                  href="/forgot-password"
                  className="text-[#511624] font-medium hover:underline"
                >
                  Forgot Password?
                </a>
              </div>

              <Link
                href="../../"
                className="block bg-black text-white py-2 rounded-lg hover:bg-[#380206] font-semibold transition text-sm shadow-md mt-2 text-center"
              >
                Sign Up
              </Link>

              <Link
                href="/auth/login"
                className="block bg-white text-gray-800 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 font-semibold transition text-sm shadow-sm mt-2 text-center"
              >
                Login
              </Link>
            </form>

            <p className="text-[10px] text-center text-gray-700 mt-2">
              By creating an account you agree with our{" "}
              <a href="/terms" className="text-[#3D0B18] hover:underline">
                Terms
              </a>{" "}
              &{" "}
              <a href="/privacy" className="text-[#3D0B18] hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>

        {/* Right Section: Image */}
        <div className="relative w-full md:w-[70%] h-[600px] flex items-center justify-center rounded-xl overflow-hidden shadow-2xl">
          <div className="absolute inset-5 bg-white/50 backdrop-blur-sm rounded-xl p-4">
            <div className="w-full h-full rounded-xl bg-transparent flex items-center justify-center">
              <div className="relative w-[95%] h-[95%] rounded-xl overflow-hidden shadow-xl">
                <Image
                  src="/assets/images/2.PNG"
                  alt="Luxury Fragrance Display"
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
