"use client";

import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, Heart, Menu, X, SquareArrowUp } from "lucide-react";
import Image from "next/image";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  
  const { cartCount, favoritesCount } = useCart(); 

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/pages/home/shop-page" },
    { name: "Wallet", href: "#wallet" },
    { name: "About Us", href: "/pages/home/about-us" },
    { name: "Contact Us", href: "/pages/home/contact-us" },
    { name: "Login", href: "/auth/login" },
    { name: "Register", href: "/auth/register" },
  ];

  return (
    <header className="fixed bg-[#1A0101] text-white font-bold z-50 w-full" data-aos="slide-down">
      <div className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex-shrink-0">
            <h1 className="text-3xl font-bold tracking-wider sm:text-3xl">TRYSCENTIC</h1>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="text-sm font-medium transition-colors hover:text-amber-400 lg:text-base">
                {link.name}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            <button className="hidden sm:flex items-center gap-2 rounded-md bg-[#F79A20] text-black px-3 py-1.5 font-semibold transition-all hover:bg-amber-700 hover:border-amber-700 lg:px-4 lg:py-2 cursor-pointer">
              <span>Top-Up</span>
              <SquareArrowUp />
            </button>

            <div className="hidden md:flex items-center gap-2 rounded-lg bg-black bg-opacity-30 px-4 py-2 lg:w-64">
              <Search className="h-4 w-4 text-orange-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-white placeholder-orange-400 outline-none"
              />
            </div>

            <button
              onClick={() => router.push("/pages/home/checkout")}
              className="relative rounded-full p-2 transition-colors hover:bg-white hover:text-black"
            >
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs font-bold">
                {cartCount}
              </span>
            </button>

            <button
              onClick={() => router.push("/pages/home/favorites-page")}
              className="relative rounded-full p-2 transition-colors hover:bg-white hover:text-black"
            >
              <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
              {favoritesCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs font-bold">
                  {favoritesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => router.push("/pages/home/user-dashboard")}
              className="h-9 w-9 overflow-hidden rounded-full border-2 border-amber-600 transition-transform hover:scale-105 sm:h-10 sm:w-10"
            >
              <Image
                className="h-full w-full object-cover"
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                alt="User Avatar"
                width={40}
                height={40}
                unoptimized
              />
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden rounded-full p-2 transition-colors hover:bg-white hover:bg-opacity-10"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="border-t border-amber-900 py-4 md:hidden">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-base font-medium transition-colors hover:text-amber-400"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
