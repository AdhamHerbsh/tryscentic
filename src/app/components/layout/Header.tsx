"use client";
import { useState } from "react";
import {
  Search,
  ShoppingCart,
  Heart,
  Menu,
  X,
  SquareArrowUp,
} from "lucide-react";
import Image from "next/image";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "shop" },
    { name: "Wallet", href: "#wallet" },
    { name: "About Us", href: "/pages/home/about-us" },
    { name: "Contact Us", href: "/pages/home/contact-us" },
    { name: "Login", href: "auth/login" },
    { name: "Register", href: "/auth/register" },
  ];

  return (
    <header
      className="fixed bg-[#1A0101] text-white font-bold z-100 w-full"
      data-aos="slide-down"
    >
      <div className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-3xl font-bold tracking-wider sm:text-3xl">
              TRYSCENTIC
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium transition-colors hover:text-amber-400 lg:text-base"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Top-Up Button - Hidden on small screens */}
            <button className="hidden sm:flex items-center gap-2 rounded-md bg-[#F79A20] text-black px-3 py-1.5 font-semibold transition-all hover:bg-amber-700 hover:border-amber-700 lg:px-4 lg:py-2 cursor-pointer">
              <span>Top-Up</span>
              <SquareArrowUp />
            </button>

            {/* Search Bar - Hidden on mobile, show on tablet+ */}
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

            {/* Search Icon for Mobile */}
            <button className="md:hidden rounded-lg p-2 transition-colors hover:bg-white hover:bg-opacity-10">
              <Search className="h-5 w-5" />
            </button>

            {/* Cart Icon */}
            <button className="relative rounded-full p-2 transition-colors hover:bg-white hover:text-black">
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs font-bold">
                0
              </span>
            </button>

            {/* Wishlist Icon */}
            <button className="rounded-full p-2 transition-colors hover:bg-white hover:text-black">
              <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            {/* User Avatar */}
            <button className="h-9 w-9 overflow-hidden rounded-full border-2 border-amber-600 transition-transform hover:scale-105 sm:h-10 sm:w-10">
              <Image
                className="h-full w-full object-cover"
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                alt="User Avatar"
                width={40}
                height={40}
                unoptimized
              />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden rounded-full p-2 transition-colors hover:bg-white hover:bg-opacity-10"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
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
              {/* Mobile Top-Up Button */}
              <button className="flex items-center justify-center gap-2 rounded-md border-2 border-amber-600 bg-amber-600 px-4 py-2 text-sm font-semibold transition-all hover:bg-amber-700">
                <span>Top-Up</span>
                <SquareArrowUp className="h-4 w-4" />
              </button>
              {/* Mobile Search */}
              <div className="flex items-center gap-2 rounded-lg bg-black bg-opacity-30 px-4 py-2">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full bg-transparent text-sm text-white placeholder-gray-400 outline-none"
                />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
